import * as dotenv from 'dotenv';
// Initialize dotenv
dotenv.config();
import express from 'express';
import { createServer } from '@graphql-yoga/node';
import { genSchema } from './utils/genSchema';
import { AppDataSource } from './data-source';

const app = express();

// Start typeorm
AppDataSource.initialize()
    .then(() => {
        console.log("Data Source has been initialized!")
    })
    .catch((err) => {
        console.error("Error during Data Source initialization", err)
    })

const schema = genSchema();

const graphQLServer = createServer({
    schema
});

app.use('/graphql', graphQLServer);

app.listen(4000, () => {
    console.log("🚀 App started at http://localhost:4000/");
});