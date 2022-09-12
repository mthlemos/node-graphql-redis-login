import type { Resolvers } from "../../../types/graphqlTypes";
import { destroySession } from "../../../utils/sessionUtils";

export const resolver: Resolvers = {
    Mutation: {
        logout: async (obj, args, context, info) => {

            await destroySession(context.req.session);

            context.res.clearCookie('sessid');

            return 'Logged out!';
        }
    }
}