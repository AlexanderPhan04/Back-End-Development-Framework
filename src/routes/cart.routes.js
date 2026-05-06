import express from "express";

import {
    getCart,
    addToCart,
    updateCartItem,
    removeCartItem,
    clearCart
} from "../controllers/cart.controller.js";

import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/", protect, getCart);

router.post("/add", protect, addToCart);

router.put("/update", protect, updateCartItem);

router.delete("/remove/:productId", protect, removeCartItem);

router.delete("/clear", protect, clearCart);

export default router;