import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@as-integrations/express5";
import jwt from "jsonwebtoken";

import User from "../models/User.js";

import { userTypeDefs } from "./schemas/user.schema.js";
import { userResolvers } from "./resolvers/user.resolver.js";

const getUserFromToken = async (req) => {
    const authHeader = req.headers.authorization || "";

    if (!authHeader.startsWith("Bearer ")) {
        return null;
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        return await User.findById(decoded.id).select("-password");
    } catch {
        return null;
    }
};

export const startApolloServer = async (app) => {
    const server = new ApolloServer({
        typeDefs: [userTypeDefs],
        resolvers: [userResolvers]
    });

    await server.start();

    app.use(
        "/graphql",
        expressMiddleware(server, {
            context: async ({ req }) => {
                const user = await getUserFromToken(req);

                return {
                    user
                };
            }
        })
    );
};