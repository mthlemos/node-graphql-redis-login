import type { Resolvers } from "../../../generated/graphqlTypes";
import { UserModel } from "../../../entities/User";
import * as argon2 from "argon2";
import { GraphQLYogaError } from "@graphql-yoga/node";

export const resolver: Resolvers = {
    Mutation: {
        register: async (obj, args, context, info) => {
            // Get args
            const { email, password } = args.data;

            const emailExists = await UserModel.findOneBy({ email });
            if (emailExists) {
                throw new GraphQLYogaError("Email already exists");
            }

            const hashedPass = await argon2.hash(password, {
                type: argon2.argon2id,
                memoryCost: 15360,
                timeCost: 2
            });

            const newUser = UserModel.create({
                email,
                password: hashedPass
            });
            const createdUser = await newUser.save()

            return createdUser;
        }
    }
}