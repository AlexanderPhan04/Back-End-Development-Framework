import { z } from "zod";

export const objectIdSchema = z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, "Invalid MongoDB ObjectId");

export const idParamSchema = z.object({
    id: objectIdSchema
});

export const productIdParamSchema = z.object({
    productId: objectIdSchema
});
