import { z } from "zod";

export const registerSchema = z.object({
    name: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(6)
});

export const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6)
});

export const updateProfileSchema = z.object({
    name: z.string().min(2).optional(),
    email: z.string().email().optional(),
    password: z.string().min(6).optional()
}).refine(
    (data) => Object.values(data).some(value => value !== undefined),
    {
        message: "At least one field is required",
        path: ["profile"]
    }
);
