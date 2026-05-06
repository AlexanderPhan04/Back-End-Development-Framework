import express from "express";

import {
    createReview,
    getProductReviews
} from "../controllers/review.controller.js";

import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/:id/reviews", protect, createReview);

router.get("/:id/reviews", getProductReviews);

export default router;