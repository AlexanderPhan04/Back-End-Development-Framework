import Product from "../../models/Product.js";
import Review from "../../models/Review.js";
import { productIdParamSchema } from "../../validations/common.validation.js";
import { createReviewSchema } from "../../validations/review.validation.js";
import { parseGraphQLInput } from "../../utils/validateGraphql.js";

const requireAuth = (user) => {
    if (!user) {
        throw new Error("Authentication required");
    }
};

export const reviewResolvers = {
    Query: {
        productReviews: async (_, { productId }) => {
            const data = parseGraphQLInput(
                productIdParamSchema,
                { productId }
            );

            return await Review.find({ product: data.productId })
                .populate("user", "name email role")
                .populate("product");
        }
    },

    Mutation: {
        createReview: async (_, { productId, rating, comment }, { user }) => {
            requireAuth(user);
            const productData = parseGraphQLInput(
                productIdParamSchema,
                { productId }
            );
            const reviewData = parseGraphQLInput(createReviewSchema, {
                rating,
                comment
            });

            const product = await Product.findById(productData.productId);

            if (!product) {
                throw new Error("Product not found");
            }

            const existingReview = await Review.findOne({
                user: user._id,
                product: product._id
            });

            if (existingReview) {
                throw new Error("You already reviewed this product");
            }

            const review = await Review.create({
                user: user._id,
                product: product._id,
                rating: reviewData.rating,
                comment: reviewData.comment
            });

            const reviews = await Review.find({
                product: product._id
            });

            product.numReviews = reviews.length;
            product.rating =
                reviews.reduce((acc, item) => acc + item.rating, 0) /
                reviews.length;

            await product.save();

            return await Review.findById(review._id)
                .populate("user", "name email role")
                .populate("product");
        }
    }
};
