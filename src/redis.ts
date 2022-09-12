import Redis from "ioredis";

export const redis = process.env.NODE_ENV === 'production' ?
    new Redis({
        port: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT) : 6379,
        host: process.env.REDIS_HOST
    })
    :
    new Redis();