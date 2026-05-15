import { z } from "zod";

export const cartItemSchema = z.object({
    productId: z.string().min(1),
    quantity: z.coerce.number().int().min(1)
});
