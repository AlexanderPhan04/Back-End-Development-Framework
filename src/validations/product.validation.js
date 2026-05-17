import { z } from "zod";
import { objectIdSchema } from "./common.validation.js";

const productPayload = {
    name: z.string().min(2),
    description: z.string().min(5),
    price: z.coerce.number().min(0),
    stock: z.coerce.number().int().min(0),
    category: objectIdSchema,
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
    (data) => Object.values(data).some(value => value !== undefined),
    {
        message: "At least one field is required",
        path: ["product"]
    }
);

const productFilterShape = {
    search: z.string().trim().min(1).optional(),
    category: objectIdSchema.optional(),
    minPrice: z.coerce.number().min(0).optional(),
    maxPrice: z.coerce.number().min(0).optional()
};

const priceRangeIsValid = (data) => {
    return (
        data.minPrice === undefined ||
        data.maxPrice === undefined ||
        data.minPrice <= data.maxPrice
    );
};

export const productFilterSchema = z.object(productFilterShape).refine(
    priceRangeIsValid,
    {
        message: "maxPrice must be greater than or equal to minPrice",
        path: ["maxPrice"]
    }
);

export const paginationSchema = z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(10)
});

export const productQuerySchema = z.object({
    ...productFilterShape,
    page: paginationSchema.shape.page,
    limit: paginationSchema.shape.limit
}).refine(
    priceRangeIsValid,
    {
        message: "maxPrice must be greater than or equal to minPrice",
        path: ["maxPrice"]
    }
);

export const productListGraphQLSchema = z.object({
    filter: z.preprocess(
        value => value ?? {},
        productFilterSchema
    ),
    pagination: z.preprocess(
        value => value ?? {},
        paginationSchema
    )
});
