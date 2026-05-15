import express from "express";

import User from "../models/User.js";

import { protect } from "../middlewares/auth.middleware.js";

import { admin } from "../middlewares/admin.middleware.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management APIs
 */

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of users
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access only
 */
router.get("/", protect, admin, async (req, res) => {
    const users = await User.find().select("-password");

    res.json({
        success: true,
        users
    });
});

export default router;
