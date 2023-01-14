import { Request, Response } from "express";

import { PrismaClient } from "@prisma/client";
import { httpCounter, retweetCounter } from "../util/metrics";

const prisma = new PrismaClient();

export const getRetweetsByUserId = async (req: Request, res: Response) => {
    httpCounter.inc({ method: req.method, path: req.path });
    const { id } = req.params;
    // page query param
    const { page, perPage } = req.query;
    try {
        const retweets = await prisma.retweet.findMany({
            where: {
                authorId: Number(id)
            },
            skip: page && perPage ? (Number(page) - 1) * Number(perPage) : undefined,
            take: perPage ? Number(perPage) : undefined,
        });
        res.status(200).send(retweets);
    } catch (err) {
        res.status(400).send({ error: err.message });
    }
};

export const getRetweetById = async (req: Request, res: Response) => {
    httpCounter.inc({ method: req.method, path: req.path });
    const { id } = req.params;
    console.log(id);
    try {
        const retweet = await prisma.retweet.findUnique({
            where: {
                id: Number(id)
            }
        });
        if (!retweet) {
            return res.status(404).send({ error: 'Retweet not found' });
        }
        res.status(200).send(retweet);
    } catch (err) {
        res.status(400).send({ error: err.message });
    }
};

export const createRetweet = async (req: Request, res: Response) => {
    httpCounter.inc({ method: req.method, path: req.path });
    const { userId, tweetId } = req.body;
    if (!userId || !tweetId) {
        return res.status(400).send({ error: 'User id and tweet id are required' });
    }
    try {
        // check if user exists
        const user = await prisma.user.findUnique({
            where: {
                id: userId
            }
        });
        if (!user) {
            return res.status(400).send({ error: 'User does not exist' });
        }
        // check if tweet exists
        const tweet = await prisma.tweet.findUnique({
            where: {
                id: tweetId
            }
        });
        if (!tweet) {
            return res.status(400).send({ error: 'Tweet does not exist' });
        }
        const retweet = await prisma.retweet.create({
            data: {
                authorId: userId,
                tweetId: tweetId
            }
        });
        res.status(200).send(retweet);
        retweetCounter.inc({
            tweet_id: tweetId
        });
    }
    catch (err) {
        res.status(400).send({ error: err.message });
    }
};

export const deleteRetweet = async (req: Request, res: Response) => {
    httpCounter.inc({ method: req.method, path: req.path });
    const { id } = req.params;
    try {
        const retweet = await prisma.retweet.delete({
            where: {
                id: Number(id)
            }
        });
        res.status(200).send(retweet);
    } catch (err) {
        res.status(400).send({ error: err.message });
    }
};