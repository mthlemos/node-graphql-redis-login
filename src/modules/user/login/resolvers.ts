import type { Resolvers } from "../../../generated/graphqlTypes";
import { UserModel } from "../../../entities/User";
import * as argon2 from "argon2";
import { GraphQLYogaError } from "@graphql-yoga/node";

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

            return 'Logged In!';
        }
    }
}