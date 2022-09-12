import { redis } from "../redis";
import { sessionListPrefix, sessionPrefix } from "./redisPrefixes";

export async function sessionListManager() {
    const lists = await redis.keys(sessionListPrefix + '*');
    lists.forEach(async (sessionList) => {
        // Get all session keys
        const allSessions = await redis.lrange(sessionList, 0, -1);

        if (allSessions.length === 0) {
            const removed = await redis.del(sessionList);
            if (removed === 0) {
                console.error(`Error removing session list ${sessionList}`);
            }
            console.log(`Removed session list ${sessionList}`);
        }

        // Iterate over sessions
        allSessions.forEach(async (session) => {
            const sessionData = !!await redis.get(sessionPrefix + session);

            // If session already expired, clean it from the list
            if (!sessionData) {
                const removed = await redis.lrem(sessionList, 1, session);
                if (removed === 0) {
                    console.error(`Error removing session ${session} from list`);
                }
                console.log(`Session ${session} removed!`)
            }
        })
    })
}