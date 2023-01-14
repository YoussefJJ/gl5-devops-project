import { Request, Response, NextFunction } from 'express';
import axios from 'axios';

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    try {
        const result = await axios.post(`http://${process.env.AUTH_HOST}:${process.env.AUTH_PORT}/auth/token`, {
        }, {
            headers: {
                authorization: authHeader
            }
        });
        if (result.status === 200) {
            // add user id to request
            req.body.userId = result.data.id;
            next();
        }
    }
    catch (error) {
        console.log(error)
        if (error.response.status === 400) {
            return res.status(401).send({ error: 'Invalid token' });
        }
    }
}