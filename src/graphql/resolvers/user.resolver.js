import User from "../../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {
    loginSchema,
    registerSchema,
    updateProfileSchema
} from "../../validations/auth.validation.js";
import { parseGraphQLInput } from "../../utils/validateGraphql.js";

const generateToken = (id) => {
    return jwt.sign(
        { id },
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_EXPIRES_IN
        }
    );
};

const requireAuth = (user) => {
    if (!user) {
        throw new Error("Authentication required");
    }

    return user;
};

const requireAdmin = (user) => {
    requireAuth(user);

    if (user.role !== "admin") {
        throw new Error("Admin access only");
    }
};

export const userResolvers = {
    Query: {
        me: async (_, __, { user }) => {
            if (!user) return null;

            return await User.findById(user._id);
        },

        users: async (_, __, { user }) => {
            requireAdmin(user);

            return await User.find().select("-password");
        }
    },

    Mutation: {
        register: async (_, args) => {
            const {
                name,
                email,
                password
            } = parseGraphQLInput(registerSchema, args);

            const existingUser = await User.findOne({ email });

            if (existingUser) {
                throw new Error("User already exists");
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            const user = await User.create({
                name,
                email,
                password: hashedPassword
            });

            const token = generateToken(user._id);

            return {
                success: true,
                token,
                user
            };
        },

        login: async (_, args) => {
            const {
                email,
                password
            } = parseGraphQLInput(loginSchema, args);

            const user = await User.findOne({ email });

            if (!user) {
                throw new Error("Invalid credentials");
            }

            const isMatch = await bcrypt.compare(
                password,
                user.password
            );

            if (!isMatch) {
                throw new Error("Invalid credentials");
            }

            const token = generateToken(user._id);

            return {
                success: true,
                token,
                user
            };
        },

        updateProfile: async (_, args, { user }) => {
            requireAuth(user);

            const {
                name,
                email,
                password
            } = parseGraphQLInput(updateProfileSchema, args);

            const currentUser = await User.findById(user._id);

            if (!currentUser) {
                throw new Error("User not found");
            }

            if (email && email !== currentUser.email) {
                const existingUser = await User.findOne({ email });

                if (existingUser) {
                    throw new Error("Email already exists");
                }

                currentUser.email = email;
            }

            if (name) {
                currentUser.name = name;
            }

            if (password) {
                currentUser.password = await bcrypt.hash(password, 10);
            }

            return await currentUser.save();
        }
    }
};
