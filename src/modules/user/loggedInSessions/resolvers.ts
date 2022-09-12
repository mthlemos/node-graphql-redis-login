import type { Resolvers, UserSession } from "../../../types/graphqlTypes";
import { sessionListPrefix, sessionPrefix } from "../../../utils/redisPrefixes";

export const resolver: Resolvers = {
    Query: {
        loggedInSessions: async (obj, args, context, info) => {
            // Get args
            let { userId } = args;

            if (!userId) {
                // Use own user id
                userId = context.req.session.userId;
            }

            // Get user session from redis list
            const sessions = await context.redis.lrange(sessionListPrefix + userId, 0, -1);

            // Let's map the session ids with the real sessions
            const mappedSessions = await sessions.reduce<Promise<UserSession[]>>(async (accPromise, currSession) => {
                const acc = await accPromise;

                const sessionData = await context.redis.get(sessionPrefix + currSession);

                // Session doesn't exist anymore
                if (!sessionData) {
                    return acc;
                }

                const parsedSession = JSON.parse(sessionData);

                acc.push({
                    Ip: parsedSession.ip,
                    LoggedInAt: parsedSession.createdAt
                });

                return acc;
            }, Promise.resolve([]));

            return mappedSessions;
        }
    }
}