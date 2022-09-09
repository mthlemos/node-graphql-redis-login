import { codegen } from '@graphql-codegen/core';
import { getCachedDocumentNodeFromSchema } from '@graphql-codegen/plugin-helpers';
import fs from 'fs';

import { genSchema } from '../utils/genSchema';
import * as typescript from '@graphql-codegen/typescript';
import * as typescriptResolvers from '@graphql-codegen/typescript-resolvers';
import path from 'path';

(async () => {
    const config: typescript.TypeScriptPluginConfig & typescriptResolvers.TypeScriptResolversPluginConfig = {
        useTypeImports: true
    };
    const outputFile = '../generated/graphql.ts';
    const schema = genSchema();
    const schemaAsDocumentNode = getCachedDocumentNodeFromSchema(schema);

    const output = await codegen({
        schema: schemaAsDocumentNode,
        schemaAst: schema,
        documents: [],
        config,
        // used by a plugin internally, although the 'typescript' plugin currently
        // returns the string output, rather than writing to a file
        filename: outputFile,
        pluginMap: {
            typescript,
            typescriptResolvers
        },
        plugins: [
            {
                typescript: {}
            },
            {
                typecriptResolvers: {}
            }
        ]
    })
    await fs.writeFile(path.join(__dirname, outputFile), output, 'utf-8', () => { })
    console.log('✅ GraphQL codeGen output generated!')
})().catch(err => {
    console.error(err);
    process.exit(1);
});