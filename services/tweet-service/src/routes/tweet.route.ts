// user routes

import { Router, Request, Response } from 'express';
import { createTweet, getTweetById, getTweetsByUserId, updateTweet, deleteTweet} from '../controllers/tweet.controller';

const tweetRouter: Router = Router();

tweetRouter.post('/', createTweet)
tweetRouter.get('/:id', getTweetById)
tweetRouter.get('/user/:id', getTweetsByUserId)
tweetRouter.put('/:id', updateTweet)
tweetRouter.delete('/:id', deleteTweet)

export default tweetRouter;
