import { z } from "zod";

const productPayload = {
    name: z.string().min(2),
    description: z.string().min(5),
    price: z.coerce.number().min(0),
    stock: z.coerce.number().int().min(0),
    category: z.string().min(1),
    images: z.array(z.string().url()).optional()
};

export const createProductSchema = z.object(productPayload);

export const updateProductSchema = z.object({
    name: productPayload.name.optional(),
    description: productPayload.description.optional(),
    price: productPayload.price.optional(),
    stock: productPayload.stock.optional(),
    category: productPayload.category.optional(),
    images: productPayload.images
}).refine(
    (data) => Object.keys(data).length > 0,
    {
        message: "At least one field is required",
        path: ["product"]
    }
);
