import { Request, Response } from "express";

import { PrismaClient } from "@prisma/client";
import { httpCounter, tweetCounter, tweetsByUserHistogram } from "../util/metrics";
import { logger } from "../util/logger";

const prisma = new PrismaClient();

const childLogger = logger.child({ service: 'tweet-service' });

export const getTweetsByUserId = async (req: Request, res: Response) => {
    childLogger.info('Getting tweets by user id', { request_id: req.headers['x-request-id']})
    httpCounter.inc({ method: req.method, path: req.path });

    const { id } = req.params;
    // page query param
    const { page, perPage } = req.query;
    try {
        const tweets = await prisma.tweet.findMany({
            where: {
                authorId: Number(id)
            },
            skip: page && perPage ? (Number(page) - 1) * Number(perPage) : undefined,
            take: perPage ? Number(perPage) : undefined,
        });

        tweetsByUserHistogram.observe(tweets.length);
        childLogger.info('Tweets by user id', { request_id: req.headers['x-request-id'], tweets: tweets.length })
        
        res.status(200).send(tweets);
    } catch (err) {
        childLogger.error('Error getting tweets by user id', { request_id: req.headers['x-request-id'], error: err.message })
        res.status(400).send({ error: err.message });
    }
};

export const getTweetById = async (req: Request, res: Response) => {
    const { id } = req.params;

    childLogger.info('Getting tweet by id', { request_id: req.headers['x-request-id'], tweet_id: id})
    httpCounter.inc({ method: req.method, path: req.path });

    try {
        const tweet = await prisma.tweet.findUnique({
            where: {
                id: Number(id)
            }
        });
        if (!tweet) {
            childLogger.error('Error getting tweet by id', { request_id: req.headers['x-request-id'], error: 'Tweet not found' })
            return res.status(404).send({ error: 'Tweet not found' });
        }
        
        childLogger.info('Tweet by id', { request_id: req.headers['x-request-id'], tweet_id: id })
        
        res.status(200).send(tweet);
    } catch (err) {
        childLogger.error('Error getting tweet by id', { request_id: req.headers['x-request-id'], error: err.message })
        res.status(400).send({ error: err.message });
    }
};

export const createTweet = async (req: Request, res: Response) => {
    const { userId, text } = req.body;

    childLogger.info('Initiating tweet creation', { request_id: req.headers['x-request-id']})
    httpCounter.inc({ method: req.method, path: req.path });
    
    if (!userId || !text) {
        childLogger.error('Error creating tweet', { request_id: req.headers['x-request-id'], error: 'User id and text are required' })
        return res.status(400).send({ error: 'User id and text are required' });
    }
    try {
        // check if user exists
        const user = await prisma.user.findUnique({
            where: {
                id: userId
            }
        });
        if (!user) {
            childLogger.error('Error creating tweet', { request_id: req.headers['x-request-id'], error: 'User does not exist' , user_id: userId})
            return res.status(400).send({ error: 'User does not exist' });
        }
    }
    catch (err) {
        childLogger.error('Error creating tweet', { request_id: req.headers['x-request-id'], error: err.message })
        res.status(400).send({ error: err.message });
    }
    try {
        const tweet = await prisma.tweet.create({
            data: {
                authorId: userId,
                content: text
            }
        });
        childLogger.info('Tweet created', { request_id: req.headers['x-request-id'], tweet: tweet })
        res.status(201).send(tweet);
        tweetCounter.inc({
            user_id: userId
        });
        tweetsByUserHistogram.observe({ user_id: req.body.userId }, 1);
    } catch (err) {
        childLogger.error('Error creating tweet', { request_id: req.headers['x-request-id'], error: err.message })
        res.status(400).send({ error: err.message });
    }
};

export const updateTweet = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { text } = req.body;
    childLogger.info('Updating tweet', { request_id: req.headers['x-request-id']}, { tweet_id: id })
    httpCounter.inc({ method: req.method, path: req.path });
    if (!text) {
        childLogger.error('Error updating tweet', { request_id: req.headers['x-request-id'], error: 'Text is required' }, { tweet_id: id })
        return res.status(400).send({ error: 'Text is required' });
    }
    try {
        const tweet = await prisma.tweet.update({
            where: {
                id: Number(id)
            },
            data: {
                content: text
            }
        });
        childLogger.info('Tweet updated', { request_id: req.headers['x-request-id'], tweet: tweet }, { tweet_id: id })
        res.status(200).send(tweet);
    } catch (err) {
        childLogger.error('Error updating tweet', { request_id: req.headers['x-request-id'], error: err.message }, { tweet_id: id })
        res.status(400).send({ error: err.message });
    }
};

export const deleteTweet = async (req: Request, res: Response) => {
    httpCounter.inc({ method: req.method, path: req.path });
    const { id } = req.params;
    childLogger.info('Deleting tweet', { request_id: req.headers['x-request-id']}, { tweet_id: id })
    try {
        const tweet = await prisma.tweet.delete({
            where: {
                id: Number(id)
            }
        });
        childLogger.info('Tweet deleted', { request_id: req.headers['x-request-id'], tweet: tweet }, { tweet_id: id })
        res.status(200).send(tweet);
    } catch (err) {
        childLogger.error('Error deleting tweet', { request_id: req.headers['x-request-id'], error: err.message }, { tweet_id: id })
        res.status(400).send({ error: err.message });
    }
};