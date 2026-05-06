import User from "../../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const generateToken = (id) => {
    return jwt.sign(
        { id },
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_EXPIRES_IN
        }
    );
};

export const userResolvers = {
    Query: {
        me: async (_, __, { user }) => {
            if (!user) return null;

            return await User.findById(user._id);
        }
    },

    Mutation: {
        register: async (_, args) => {
            const { name, email, password } = args;

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
            const { email, password } = args;

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
        }
    }
};