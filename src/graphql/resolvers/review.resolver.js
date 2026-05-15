import Product from "../../models/Product.js";
import Review from "../../models/Review.js";

const requireAuth = (user) => {
    if (!user) {
        throw new Error("Authentication required");
    }
};

const validateReview = (rating, comment) => {
    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
        throw new Error("Rating must be an integer between 1 and 5");
    }

    if (!comment || comment.trim().length < 3) {
        throw new Error("Comment must be at least 3 characters");
    }
};

export const reviewResolvers = {
    Query: {
        productReviews: async (_, { productId }) => {
            return await Review.find({ product: productId })
                .populate("user", "name email role")
                .populate("product");
        }
    },

    Mutation: {
        createReview: async (_, { productId, rating, comment }, { user }) => {
            requireAuth(user);
            validateReview(rating, comment);

            const product = await Product.findById(productId);

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
                rating,
                comment
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
