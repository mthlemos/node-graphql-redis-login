import { Request, Response } from "express"
import Redis from "ioredis"

// Set session data fields
declare module 'express-session' {
    interface SessionData {
        userId: string;
        ip: string;
        createdAt: Date;
    }
}

export type Context = {
    req: Request,
    res: Response,
    redis: Redis
};