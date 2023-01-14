// user routes

import { Router, Request, Response } from 'express';
import { createUser, loginUser, validateToken} from '../controllers/user.controller';

const userRouter: Router = Router();

userRouter.post('/register', createUser)
userRouter.post('/login', loginUser)
userRouter.post('/token', validateToken)

export default userRouter;
