import { NextFunction, Request, Response } from "express";
import {v4 as uuidv4} from "uuid";

export const requestUUIDMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    console.log("hereeee")
    req.headers['x-request-id'] = req.headers['x-request-id'] || uuidv4();
    next();
}
