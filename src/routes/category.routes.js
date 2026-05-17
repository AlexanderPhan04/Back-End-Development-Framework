import express from "express";

import {
    getCategories,
    createCategory,
    updateCategory,
    deleteCategory
} from "../controllers/category.controller.js";

import { protect } from "../middlewares/auth.middleware.js";
import { admin } from "../middlewares/admin.middleware.js";
import {
    validate,
    validateParams
} from "../middlewares/validate.middleware.js";
import { idParamSchema } from "../validations/common.validation.js";

import {
    createCategorySchema,
    updateCategorySchema
} from "../validations/category.validation.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Categories
 *   description: Category APIs
 */

/**
 * @swagger
 * /api/categories:
 *   get:
 *     summary: Get all categories
 *     tags: [Categories]
 *     security: []
 *     responses:
 *       200:
 *         description: List of categories
 */
router.get("/", getCategories);

/**
 * @swagger
 * /api/categories:
 *   post:
 *     summary: Create a category
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: Laptop
 *               description:
 *                 type: string
 *                 example: Laptop products
 *     responses:
 *       201:
 *         description: Category created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access only
 */
router.post("/", protect, admin, validate(createCategorySchema), createCategory);

/**
 * @swagger
 * /api/categories/{id}:
 *   put:
 *     summary: Update a category
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Category ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Smartphone
 *               description:
 *                 type: string
 *                 example: Mobile phone products
 *     responses:
 *       200:
 *         description: Category updated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access only
 *       404:
 *         description: Category not found
 */
router.put(
    "/:id",
    protect,
    admin,
    validateParams(idParamSchema),
    validate(updateCategorySchema),
    updateCategory
);

/**
 * @swagger
 * /api/categories/{id}:
 *   delete:
 *     summary: Delete a category
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Category ID
 *     responses:
 *       200:
 *         description: Category deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access only
 *       404:
 *         description: Category not found
 */
router.delete(
    "/:id",
    protect,
    admin,
    validateParams(idParamSchema),
    deleteCategory
);

export default router;
