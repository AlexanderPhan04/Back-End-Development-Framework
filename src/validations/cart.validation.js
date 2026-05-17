import { z } from "zod";
import { objectIdSchema } from "./common.validation.js";

export const cartItemSchema = z.object({
    productId: objectIdSchema,
    quantity: z.coerce.number().int().min(1)
});
