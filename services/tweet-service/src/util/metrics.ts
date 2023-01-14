import promClient from 'prom-client';

export const register = new promClient.Registry();
const collectDefaultMetrics = promClient.collectDefaultMetrics;
collectDefaultMetrics({ register });

export const httpCounter = new promClient.Counter({
    name: 'tweet_service_counter',
    help: 'tweet_service_counter',
    labelNames: ['method', 'path'],
    registers: [register]
});

export const retweetCounter = new promClient.Counter({
    name: 'tweet_service_retweet_counter',
    help: 'tweet_service_retweet_counter',
    labelNames: ['tweet_id'],
    registers: [register]
});

export const tweetCounter = new promClient.Counter({
    name: 'tweet_service_tweet_counter',
    help: 'tweet_service_tweet_counter',
    labelNames: ['user_id'],
    registers: [register]
});

export const tweetsByUserHistogram = new promClient.Histogram({
    name: 'tweet_service_tweet_histogram',
    help: 'tweet_service_tweet_histogram',
    labelNames: ['user_id'],
    registers: [register]
});