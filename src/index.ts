import "reflect-metadata";
import express from 'express';
import { ApolloServer } from 'apollo-server-express'
import {createConnection} from "typeorm";
import { buildSchema } from "type-graphql";
import { UserResolver } from "./resolvers/UserResolver";


(async () => {
    const server = new ApolloServer({
        schema: await buildSchema({
            resolvers: [UserResolver]
        }),
        context: ({req, res}) => ({req,res})
    });

    await createConnection();
    const app = express();
    server.applyMiddleware({app});

    app.listen(4000, () => console.log('HI!'))
})()