import type { Resolvers } from "../../../types/graphqlTypes";
import { UserModel } from "../../../entities/User";
import * as argon2 from "argon2";
import { GraphQLYogaError } from "@graphql-yoga/node";
import { saveSession } from "../../../utils/sessionUtils";
import { sessionListPrefix } from "../../../utils/redisPrefixes";

export const resolver: Resolvers = {
    Mutation: {
        login: async (obj, args, context, info) => {
            // Get args
            const { email, password } = args.data;

            const user = await UserModel.findOneBy({ email });
            if (!user) {
                throw new GraphQLYogaError("Email or password is incorrect!");
            }

            const isPasswordCorrect = await argon2.verify(user.password, password);

            if (!isPasswordCorrect) {
                throw new GraphQLYogaError("Email or password is incorrect!");
            }

            const session = context.req.session;

            session.userId = user.id;
            session.ip = context.req.ip;
            session.createdAt = new Date();

            await saveSession(session);

            // Save session into a redis list
            // in order to query the logged in session for the user
            // later
            const sessionListKey = sessionListPrefix + user.id;
            const sessions = await context.redis.lrange(sessionListKey, 0, -1);
            if (!sessions || (sessions && !sessions.find(id => session.id === id))) {
                await context.redis.rpush(sessionListKey, session.id);
            }

            return session.userId;
        }
    }
}