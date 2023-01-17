import express, { Express, Response, Request } from 'express';
import userRouter from './routes/user.routes';
import { register } from './util/metrics'
import cors from 'cors';
import { requestUUIDMiddleware } from './middlewares/requestUUID';
import rateLimit from 'express-rate-limit'


const app: Express = express();

const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})

// Apply the rate limiting middleware to all requests
app.use(limiter)

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