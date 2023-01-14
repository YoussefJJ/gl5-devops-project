import { Router } from 'express';
import { getRetweetsByUserId, deleteRetweet, getRetweetById, createRetweet } from '../controllers/retweet.controller';

const retweetRouter: Router = Router();

retweetRouter.post('/', createRetweet)
retweetRouter.get('/:id', getRetweetById)
retweetRouter.get('/user/:id', getRetweetsByUserId)
retweetRouter.delete('/:id', deleteRetweet)

export default retweetRouter;
