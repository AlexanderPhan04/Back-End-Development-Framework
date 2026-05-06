import express from "express";

import {
    createOrder,
    getOrders,
    getOrderById,
    updateOrderStatus
} from "../controllers/order.controller.js";

import { protect } from "../middlewares/auth.middleware.js";
import { admin } from "../middlewares/admin.middleware.js";

const router = express.Router();

router.post("/", protect, createOrder);
router.get("/", protect, getOrders);
router.get("/:id", protect, getOrderById);
router.put("/:id/status", protect, admin, updateOrderStatus);

export default router;