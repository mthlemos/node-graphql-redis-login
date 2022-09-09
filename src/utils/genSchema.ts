import path from "path";

const { mergeResolvers, mergeTypeDefs } = require('@graphql-tools/merge');
const { makeExecutableSchema } = require('@graphql-tools/schema');
const { loadFilesSync } = require('@graphql-tools/load-files');

export const genSchema = () => {
    const typeDefsArray = loadFilesSync(path.join(__dirname, '../modules/**/*.graphql'));
    const resolversArray = loadFilesSync(path.join(__dirname, '../modules/**/resolvers.ts'));

    return makeExecutableSchema({
        typeDefs: mergeTypeDefs(typeDefsArray),
        resolvers: mergeResolvers(resolversArray)
    });
}