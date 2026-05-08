import Product from "../../models/Product.js";
import Category from "../../models/Category.js";

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

            return await Category.create(args);
        },

        updateCategory: async (_, { id, ...data }, { user }) => {
            checkAdmin(user);

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

            return await Product.create(args);
        },

        updateProduct: async (_, { id, ...data }, { user }) => {
            checkAdmin(user);

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