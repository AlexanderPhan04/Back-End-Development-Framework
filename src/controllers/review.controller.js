import Review from "../models/Review.js";
import Product from "../models/Product.js";

export const createReview = async (req, res) => {
    const { rating, comment } = req.body;

    const product = await Product.findById(req.params.id);

    if (!product) {
        return res.status(404).json({
            success: false,
            message: "Product not found"
        });
    }

    const existingReview = await Review.findOne({
        user: req.user._id,
        product: product._id
    });

    if (existingReview) {
        return res.status(400).json({
            success: false,
            message: "You already reviewed this product"
        });
    }

    const review = await Review.create({
        user: req.user._id,
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

    res.status(201).json({
        success: true,
        review
    });
};

export const getProductReviews = async (req, res) => {
    const reviews = await Review.find({
        product: req.params.id
    }).populate("user", "name");

    res.json({
        success: true,
        reviews
    });
};