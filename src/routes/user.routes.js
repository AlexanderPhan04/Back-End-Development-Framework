import express from "express";

import User from "../models/User.js";

import { protect } from "../middlewares/auth.middleware.js";

import { admin } from "../middlewares/admin.middleware.js";

const router = express.Router();

router.get("/", protect, admin, async (req, res) => {
    const users = await User.find().select("-password");

    res.json({
        success: true,
        users
    });
});

export default router;