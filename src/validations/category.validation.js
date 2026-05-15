import { z } from "zod";

export const createCategorySchema = z.object({
    name: z.string().min(2),
    description: z.string().optional()
});

export const updateCategorySchema = z.object({
    name: z.string().min(2).optional(),
    description: z.string().optional()
}).refine(
    (data) => data.name || data.description !== undefined,
    {
        message: "At least one field is required",
        path: ["category"]
    }
);
