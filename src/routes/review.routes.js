import express from "express";

import {
    createReview,
    getProductReviews
} from "../controllers/review.controller.js";

import { protect } from "../middlewares/auth.middleware.js";
import {
    validate,
    validateParams
} from "../middlewares/validate.middleware.js";
import { idParamSchema } from "../validations/common.validation.js";
import { createReviewSchema } from "../validations/review.validation.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Reviews
 *   description: Product review APIs
 */

/**
 * @swagger
 * /api/products/{id}/reviews:
 *   post:
 *     summary: Create a product review
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - rating
 *               - comment
 *             properties:
 *               rating:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *                 example: 5
 *               comment:
 *                 type: string
 *                 example: Great product
 *     responses:
 *       201:
 *         description: Review created successfully
 *       400:
 *         description: Validation error or product already reviewed
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Product not found
 */
router.post(
    "/:id/reviews",
    protect,
    validateParams(idParamSchema),
    validate(createReviewSchema),
    createReview
);

/**
 * @swagger
 * /api/products/{id}/reviews:
 *   get:
 *     summary: Get product reviews
 *     tags: [Reviews]
 *     security: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     responses:
 *       200:
 *         description: List of product reviews
 */
router.get(
    "/:id/reviews",
    validateParams(idParamSchema),
    getProductReviews
);

export default router;
