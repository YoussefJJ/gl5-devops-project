import express, { Express, Response, Request } from 'express';
import userRouter from './routes/user.routes';
import { register } from './util/metrics'
import cors from 'cors';
import { requestUUIDMiddleware } from './middlewares/requestUUID';

const app: Express = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());

// use routes
app.use('/auth', requestUUIDMiddleware, userRouter);

app.get('/metrics', async (req: Request, res: Response) => {
    res.setHeader('Content-Type', register.contentType);
    res.send(await register.metrics());
});

const port = process.env.NODE_LOCAL_PORT || 3000;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});