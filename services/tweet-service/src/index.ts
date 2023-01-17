import express, { Express, Request, Response } from 'express';
import { addReqUUIDMiddleware } from './middlewares/addreqID.middleware';
import { authMiddleware } from './middlewares/auth.middleware';
import retweetRouter from './routes/retweet.route';
import tweetRouter from './routes/tweet.route';
import { register } from './util/metrics';
// import retweetRouter from './routes/retweet.routes';
import rateLimit from 'express-rate-limit'

const app: Express = express();

const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    skip: (req: Request) => {
        const { path } = req;
        const skipPaths = ['/metrics'];
        return skipPaths.includes(path);
    }
})

// Apply the rate limiting middleware to all requests
app.use(limiter)

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// use routes
app.use('/tweet', authMiddleware, addReqUUIDMiddleware, tweetRouter);
app.use('/retweet', authMiddleware, addReqUUIDMiddleware, retweetRouter);
// app.use('/retweet', retweetRouter);

app.get('/metrics', async (req: Request, res: Response) => {
    res.setHeader('Content-Type', register.contentType);
    res.send(await register.metrics());
});

const port = process.env.NODE_LOCAL_PORT || 4000;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});