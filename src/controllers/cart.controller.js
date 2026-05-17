import Cart from "../models/Cart.js";

export const getCart = async (req, res) => {
    let cart = await Cart.findOne({
        user: req.user._id
    }).populate("items.product");

    if (!cart) {
        cart = await Cart.create({
            user: req.user._id,
            items: []
        });
    }

    res.json({
        success: true,
        cart
    });
};

export const addToCart = async (req, res) => {
    const { productId, quantity } = req.body;

    let cart = await Cart.findOne({
        user: req.user._id
    });

    if (!cart) {
        cart = await Cart.create({
            user: req.user._id,
            items: []
        });
    }

    const existingItem = cart.items.find(
        item => item.product.toString() === productId
    );

    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.items.push({
            product: productId,
            quantity
        });
    }

    await cart.save();

    const updatedCart = await Cart.findById(cart._id)
        .populate("items.product");

    res.json({
        success: true,
        cart: updatedCart
    });
};

export const updateCartItem = async (req, res) => {
    const { productId, quantity } = req.body;

    const cart = await Cart.findOne({
        user: req.user._id
    });

    if (!cart) {
        return res.status(404).json({
            status: 404,
            success: false,
            message: "Cart not found"
        });
    }

    const item = cart.items.find(
        item => item.product.toString() === productId
    );

    if (!item) {
        return res.status(404).json({
            status: 404,
            success: false,
            message: "Item not found in cart"
        });
    }

    item.quantity = quantity;

    await cart.save();

    res.json({
        success: true,
        cart
    });
};

export const removeCartItem = async (req, res) => {
    const { productId } = req.params;

    const cart = await Cart.findOne({
        user: req.user._id
    });

    if (!cart) {
        return res.status(404).json({
            status: 404,
            success: false,
            message: "Cart not found"
        });
    }

    cart.items = cart.items.filter(
        item => item.product.toString() !== productId
    );

    await cart.save();

    res.json({
        success: true,
        cart
    });
};

export const clearCart = async (req, res) => {
    const cart = await Cart.findOne({
        user: req.user._id
    });

    if (!cart) {
        return res.status(404).json({
            status: 404,
            success: false,
            message: "Cart not found"
        });
    }

    cart.items = [];

    await cart.save();

    res.json({
        success: true,
        message: "Cart cleared"
    });
};
