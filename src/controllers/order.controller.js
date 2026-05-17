import Cart from "../models/Cart.js";
import Order from "../models/Order.js";

export const createOrder = async (req, res) => {
    const cart = await Cart.findOne({
        user: req.user._id
    }).populate("items.product");

    if (!cart || cart.items.length === 0) {
        return res.status(400).json({
            status: 400,
            success: false,
            message: "Cart is empty"
        });
    }

    const items = cart.items.map((item) => ({
        product: item.product._id,
        name: item.product.name,
        price: item.product.price,
        quantity: item.quantity
    }));

    const totalPrice = items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    const order = await Order.create({
        user: req.user._id,
        items,
        totalPrice
    });

    cart.items = [];
    await cart.save();

    res.status(201).json({
        success: true,
        order
    });
};

export const getOrders = async (req, res) => {
    const orders = await Order.find({
        user: req.user._id
    }).sort({ createdAt: -1 });

    res.json({
        success: true,
        orders
    });
};

export const getOrderById = async (req, res) => {
    const order = await Order.findById(req.params.id)
        .populate("user", "name email")
        .populate("items.product");

    if (!order) {
        return res.status(404).json({
            status: 404,
            success: false,
            message: "Order not found"
        });
    }

    if (
        order.user._id.toString() !== req.user._id.toString() &&
        req.user.role !== "admin"
    ) {
        return res.status(403).json({
            status: 403,
            success: false,
            message: "Not allowed to view this order"
        });
    }

    res.json({
        success: true,
        order
    });
};

export const updateOrderStatus = async (req, res) => {
    const { status } = req.body;

    const allowedStatus = ["pending", "processing", "shipped", "delivered"];

    if (!allowedStatus.includes(status)) {
        return res.status(400).json({
            status: 400,
            success: false,
            message: "Invalid order status"
        });
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
        return res.status(404).json({
            status: 404,
            success: false,
            message: "Order not found"
        });
    }

    order.status = status;

    await order.save();

    res.json({
        success: true,
        order
    });
};
