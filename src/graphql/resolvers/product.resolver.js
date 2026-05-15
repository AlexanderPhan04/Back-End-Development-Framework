import Product from "../../models/Product.js";
import Category from "../../models/Category.js";

const checkAdmin = (user) => {
    if (!user || user.role !== "admin") {
        throw new Error("Admin access only");
    }
};

const hasProvidedField = (data) => {
    return Object.values(data).some(value => value !== undefined);
};

const validateCategoryInput = (data, partial = false) => {
    if (!partial && !data.name) {
        throw new Error("Category name is required");
    }

    if (data.name !== undefined && data.name.trim().length < 2) {
        throw new Error("Category name must be at least 2 characters");
    }
};

const validateProductInput = (data, partial = false) => {
    if (!partial) {
        const requiredFields = [
            "name",
            "description",
            "price",
            "stock",
            "category"
        ];

        const missingField = requiredFields.find(
            field => data[field] === undefined || data[field] === null
        );

        if (missingField) {
            throw new Error(`${missingField} is required`);
        }
    }

    if (data.name !== undefined && data.name.trim().length < 2) {
        throw new Error("Product name must be at least 2 characters");
    }

    if (
        data.description !== undefined &&
        data.description.trim().length < 5
    ) {
        throw new Error("Product description must be at least 5 characters");
    }

    if (data.price !== undefined && data.price < 0) {
        throw new Error("Product price must be greater than or equal to 0");
    }

    if (
        data.stock !== undefined &&
        (!Number.isInteger(data.stock) || data.stock < 0)
    ) {
        throw new Error("Product stock must be a non-negative integer");
    }
};

export const productResolvers = {
    Query: {
        categories: async () => {
            return await Category.find();
        },

        products: async (_, { filter = {}, pagination = {} }) => {
            const {
                search,
                category,
                minPrice,
                maxPrice
            } = filter || {};

            const {
                page = 1,
                limit = 10
            } = pagination || {};

            const query = {};

            if (category) {
                query.category = category;
            }

            if (minPrice || maxPrice) {
                query.price = {};

                if (minPrice) query.price.$gte = minPrice;
                if (maxPrice) query.price.$lte = maxPrice;
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
            return await Product.findById(id).populate("category");
        }
    },

    Mutation: {
        createCategory: async (_, args, { user }) => {
            checkAdmin(user);
            validateCategoryInput(args);

            return await Category.create(args);
        },

        updateCategory: async (_, { id, ...data }, { user }) => {
            checkAdmin(user);

            if (!hasProvidedField(data)) {
                throw new Error("At least one field is required");
            }

            validateCategoryInput(data, true);

            return await Category.findByIdAndUpdate(
                id,
                data,
                { new: true }
            );
        },

        deleteCategory: async (_, { id }, { user }) => {
            checkAdmin(user);

            await Category.findByIdAndDelete(id);

            return true;
        },

        createProduct: async (_, args, { user }) => {
            checkAdmin(user);
            validateProductInput(args);

            return await Product.create(args);
        },

        updateProduct: async (_, { id, ...data }, { user }) => {
            checkAdmin(user);

            if (!hasProvidedField(data)) {
                throw new Error("At least one field is required");
            }

            validateProductInput(data, true);

            return await Product.findByIdAndUpdate(
                id,
                data,
                { new: true }
            ).populate("category");
        },

        deleteProduct: async (_, { id }, { user }) => {
            checkAdmin(user);

            await Product.findByIdAndDelete(id);

            return true;
        }
    }
};
