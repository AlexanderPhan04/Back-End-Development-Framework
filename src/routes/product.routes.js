import express from "express";
import { upload } from "../middlewares/upload.middleware.js";

import {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
} from "../controllers/product.controller.js";

import { protect } from "../middlewares/auth.middleware.js";
import { admin } from "../middlewares/admin.middleware.js";
import {
    validate,
    validateParams,
    validateQuery
} from "../middlewares/validate.middleware.js";
import { idParamSchema } from "../validations/common.validation.js";

import {
    createProductSchema,
    productQuerySchema,
    updateProductSchema
} from "../validations/product.validation.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Product APIs
 */

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Get products with filters and pagination
 *     tags: [Products]
 *     security: []
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter by category ID
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *         description: Minimum product price
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *         description: Maximum product price
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by product name
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of products per page
 *     responses:
 *       200:
 *         description: Paginated product list
 */
router.get("/", validateQuery(productQuerySchema), getProducts);

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Get product detail
 *     tags: [Products]
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
 *         description: Product detail
 *       404:
 *         description: Product not found
 */
router.get("/:id", validateParams(idParamSchema), getProductById);

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Create a product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - description
 *               - price
 *               - stock
 *               - category
 *             properties:
 *               name:
 *                 type: string
 *                 example: MacBook Pro M3
 *               description:
 *                 type: string
 *                 example: Apple MacBook Pro
 *               price:
 *                 type: number
 *                 example: 39990000
 *               stock:
 *                 type: integer
 *                 example: 10
 *               category:
 *                 type: string
 *                 example: 663b0dfafdf97d07acdb4e15
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       201:
 *         description: Product created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access only
 */
router.post(
    "/",
    protect,
    admin,
    upload.array("images", 5),
    validate(createProductSchema),
    createProduct
);

/**
 * @swagger
 * /api/products/{id}:
 *   put:
 *     summary: Update a product
 *     tags: [Products]
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
 *             properties:
 *               name:
 *                 type: string
 *                 example: iPhone 15 Pro Max
 *               description:
 *                 type: string
 *                 example: Apple flagship phone
 *               price:
 *                 type: number
 *                 example: 32990000
 *               stock:
 *                 type: integer
 *                 example: 15
 *               category:
 *                 type: string
 *                 example: 663b0dfafdf97d07acdb4e15
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Product updated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access only
 *       404:
 *         description: Product not found
 */
router.put(
    "/:id",
    protect,
    admin,
    validateParams(idParamSchema),
    validate(updateProductSchema),
    updateProduct
);

/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Delete a product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access only
 *       404:
 *         description: Product not found
 */
router.delete(
    "/:id",
    protect,
    admin,
    validateParams(idParamSchema),
    deleteProduct
);

export default router;
