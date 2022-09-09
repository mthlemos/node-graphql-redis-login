import { generate } from '@graphql-codegen/cli';
import { printSchema } from 'graphql'
import { genSchema } from '../utils/genSchema';

(async () => {
    const schema = printSchema(genSchema());

    await generate({
        schema: schema,
        config: {
            mappers: {
                User: "../entities/User#UserModel"
            }
        },
        generates: {
            [process.cwd() + '/src/generated/graphqlTypes.d.ts']: {
                plugins: ['typescript', 'typescript-resolvers']
            }
        }
    }, true)
    console.log('✅ GraphQL codeGen output generated!')
})().catch(err => {
    console.error(err);
    process.exit(1);
});