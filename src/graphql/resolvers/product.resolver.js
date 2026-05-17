import Product from "../../models/Product.js";
import Category from "../../models/Category.js";
import {
    createCategorySchema,
    updateCategorySchema
} from "../../validations/category.validation.js";
import { idParamSchema } from "../../validations/common.validation.js";
import {
    createProductSchema,
    productListGraphQLSchema,
    updateProductSchema
} from "../../validations/product.validation.js";
import { parseGraphQLInput } from "../../utils/validateGraphql.js";

const checkAdmin = (user) => {
    if (!user || user.role !== "admin") {
        throw new Error("Admin access only");
    }
};

export const productResolvers = {
    Query: {
        categories: async () => {
            return await Category.find();
        },

        products: async (_, args) => {
            const {
                filter,
                pagination
            } = parseGraphQLInput(productListGraphQLSchema, args ?? {});

            const {
                search,
                category,
                minPrice,
                maxPrice
            } = filter;

            const {
                page = 1,
                limit = 10
            } = pagination;

            const query = {};

            if (category) {
                query.category = category;
            }

            if (minPrice !== undefined || maxPrice !== undefined) {
                query.price = {};

                if (minPrice !== undefined) query.price.$gte = minPrice;
                if (maxPrice !== undefined) query.price.$lte = maxPrice;
            }

            if (search) {
                query.name = {
                    $regex: search,
                    $options: "i"
                };
            }

            const skip = (page - 1) * limit;

            const products = await Product.find(query)
                .populate("category")
                .skip(skip)
                .limit(limit)
                .sort({ createdAt: -1 });

            const total = await Product.countDocuments(query);

            return {
                success: true,
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
                products
            };
        },

        product: async (_, { id }) => {
            const { id: productId } = parseGraphQLInput(
                idParamSchema,
                { id }
            );

            return await Product.findById(productId).populate("category");
        }
    },

    Mutation: {
        createCategory: async (_, args, { user }) => {
            checkAdmin(user);
            const data = parseGraphQLInput(createCategorySchema, args);

            return await Category.create(data);
        },

        updateCategory: async (_, { id, ...data }, { user }) => {
            checkAdmin(user);
            const { id: categoryId } = parseGraphQLInput(
                idParamSchema,
                { id }
            );
            const categoryData = parseGraphQLInput(
                updateCategorySchema,
                data
            );

            const category = await Category.findByIdAndUpdate(
                categoryId,
                categoryData,
                { new: true }
            );

            if (!category) {
                throw new Error("Category not found");
            }

            return category;
        },

        deleteCategory: async (_, { id }, { user }) => {
            checkAdmin(user);
            const { id: categoryId } = parseGraphQLInput(
                idParamSchema,
                { id }
            );

            const category = await Category.findByIdAndDelete(categoryId);

            if (!category) {
                throw new Error("Category not found");
            }

            return true;
        },

        createProduct: async (_, args, { user }) => {
            checkAdmin(user);
            const data = parseGraphQLInput(createProductSchema, args);

            const product = await Product.create(data);

            return await Product.findById(product._id).populate("category");
        },

        updateProduct: async (_, { id, ...data }, { user }) => {
            checkAdmin(user);
            const { id: productId } = parseGraphQLInput(
                idParamSchema,
                { id }
            );
            const productData = parseGraphQLInput(
                updateProductSchema,
                data
            );

            const product = await Product.findByIdAndUpdate(
                productId,
                productData,
                { new: true }
            ).populate("category");

            if (!product) {
                throw new Error("Product not found");
            }

            return product;
        },

        deleteProduct: async (_, { id }, { user }) => {
            checkAdmin(user);
            const { id: productId } = parseGraphQLInput(
                idParamSchema,
                { id }
            );

            const product = await Product.findByIdAndDelete(productId);

            if (!product) {
                throw new Error("Product not found");
            }

            return true;
        }
    }
};
