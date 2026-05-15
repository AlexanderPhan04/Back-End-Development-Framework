import express from "express";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@as-integrations/express5";
import jwt from "jsonwebtoken";

import User from "../models/User.js";

import { userTypeDefs } from "./schemas/user.schema.js";
import { userResolvers } from "./resolvers/user.resolver.js";
import { productTypeDefs } from "./schemas/product.schema.js";
import { productResolvers } from "./resolvers/product.resolver.js";
import { cartTypeDefs } from "./schemas/cart.schema.js";
import { cartResolvers } from "./resolvers/cart.resolver.js";
import { orderTypeDefs } from "./schemas/order.schema.js";
import { orderResolvers } from "./resolvers/order.resolver.js";
import { reviewTypeDefs } from "./schemas/review.schema.js";
import { reviewResolvers } from "./resolvers/review.resolver.js";

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
        typeDefs: [
            userTypeDefs,
            productTypeDefs,
            cartTypeDefs,
            orderTypeDefs,
            reviewTypeDefs
        ],
        resolvers: [
            userResolvers,
            productResolvers,
            cartResolvers,
            orderResolvers,
            reviewResolvers
        ]
    });

    await server.start();

    app.use(
        "/graphql",
        express.json(),
        expressMiddleware(server, {
            context: async ({ req }) => {

                const authHeader = req.headers.authorization;

                if (!authHeader?.startsWith("Bearer ")) {
                    return { user: null };
                }

                const token = authHeader.split(" ")[1];

                try {

                    const decoded = jwt.verify(
                        token,
                        process.env.JWT_SECRET
                    );

                    const user = await User.findById(decoded.id);

                    return { user };

                } catch (error) {

                    return { user: null };

                }
            }
        })
    );
};
