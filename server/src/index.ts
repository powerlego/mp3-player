import { ApolloServer } from "@apollo/server";
import { readFileSync } from "fs";
import { startStandaloneServer } from "@apollo/server/standalone";
import dotenv from "dotenv";
import { GraphQLScalarType, Kind } from "graphql";
import { Resolvers, ResolversParentTypes } from "./generated/graphql";
import pg from "pg";
const { Pool } = pg;
import * as users from "./user_model.js";
dotenv.config();

const pool = new Pool();

// Note: this uses a path relative to the project's
// root directory, which is the current working directory
// if the server is executed using `npm run`.
const typeDefs = readFileSync("./schema.graphql", { encoding: "utf-8" });

const dateScalar = new GraphQLScalarType({
    name: "Date",
    description: "Date custom scalar type",
    serialize(value) {
        if (value instanceof Date) {
            return value.getTime(); // Convert outgoing Date to integer for JSON
        }
        throw Error("GraphQL Date Scalar serializer expected a `Date` object");
    },
    parseValue(value) {
        if (typeof value === "number") {
            return new Date(value); // Convert incoming integer to Date
        }
        throw new Error("GraphQL Date Scalar parser expected a `number`");
    },
    parseLiteral(ast) {
        if (ast.kind === Kind.INT) {
            // Convert hard-coded AST string to integer and then to Date
            return new Date(parseInt(ast.value, 10));
        }
        // Invalid hard-coded value (not an integer)
        return null;
    },
});

const resolvers: Resolvers = {
    Date: dateScalar,
    Query: {
        users: () => {
            return users.getUsers(pool);
        },
        user: (args) => {
            return users.getUser(pool, args.id);
        },
    },

    Mutation: {
        createUser: (_: any, args: { username: string }) => {
            return users.createUser(pool, args.username);
        },
        updateUserUsername: (_: any, args: { id: string; username: string }) => {
            return users.updateUserUsername(pool, args.id, args.username);
        },
    },
};

const server = new ApolloServer({
    typeDefs,
    resolvers,
});

const port = parseInt(process.env.PORT || "4000", 10);

const { url } = await startStandaloneServer(server, {
    listen: { port },
});

console.log(`🚀  Server ready at: ${url}`);
