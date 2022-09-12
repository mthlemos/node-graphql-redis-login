import * as dotenv from 'dotenv';
// Initialize dotenv
dotenv.config();
import express, { Response } from 'express';
import { Request } from 'express';
import session from 'express-session';
import connectRedis from 'connect-redis';
import { createServer } from '@graphql-yoga/node';
import { genSchema } from './utils/genSchema';
import { AppDataSource } from './data-source';
import { Context } from './types/context';
import { redis } from './redis';
import { sessionListManager } from './utils/sessionListManager';

const app = express();

const RedisStore = connectRedis(session)

app.use(
    session({
        secret: process.env.COOKIE_SECRET || '',
        name: 'sessid',
        cookie: {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: true,
            maxAge: 600000
        },
        store: new RedisStore({ client: redis, ttl: 86400 }),
        resave: false,
        saveUninitialized: true
    })
)

// Run sessionListManager each minute
setInterval(sessionListManager, 60000 /* Every minute */);

// Start typeorm
AppDataSource.initialize()
    .then(() => {
        console.log("Data Source has been initialized!")
    })
    .catch((err) => {
        console.error("Error during Data Source initialization", err)
    })

const schema = genSchema();

const graphQLServer = createServer<{ req: Request, res: Response }>({
    schema,
    context({ req, res }) {
        const context: Context = {
            req,
            res,
            redis
        }
        return context;
    }
});

app.use('/graphql', graphQLServer);

app.listen(4000, () => {
    console.log("🚀 App started at http://localhost:4000/");
});