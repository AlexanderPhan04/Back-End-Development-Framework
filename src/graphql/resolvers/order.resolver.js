import Cart from "../../models/Cart.js";
import Order from "../../models/Order.js";

const allowedStatus = ["pending", "processing", "shipped", "delivered"];

const requireAuth = (user) => {
    if (!user) {
        throw new Error("Authentication required");
    }
};

const requireAdmin = (user) => {
    requireAuth(user);

    if (user.role !== "admin") {
        throw new Error("Admin access only");
    }
};

const populateOrder = async (orderId) => {
    return await Order.findById(orderId)
        .populate("user", "name email role")
        .populate("items.product");
};

export const orderResolvers = {
    Query: {
        orders: async (_, __, { user }) => {
            requireAuth(user);

            const filter = user.role === "admin" ? {} : { user: user._id };

            return await Order.find(filter)
                .populate("user", "name email role")
                .populate("items.product")
                .sort({ createdAt: -1 });
        },

        order: async (_, { id }, { user }) => {
            requireAuth(user);

            const order = await populateOrder(id);

            if (!order) {
                throw new Error("Order not found");
            }

            if (
                order.user._id.toString() !== user._id.toString() &&
                user.role !== "admin"
            ) {
                throw new Error("Not allowed to view this order");
            }

            return order;
        }
    },

    Mutation: {
        createOrder: async (_, __, { user }) => {
            requireAuth(user);

            const cart = await Cart.findOne({
                user: user._id
            }).populate("items.product");

            if (!cart || cart.items.length === 0) {
                throw new Error("Cart is empty");
            }

            const items = cart.items.map((item) => {
                if (!item.product) {
                    throw new Error("Product not found in cart");
                }

                return {
                    product: item.product._id,
                    name: item.product.name,
                    price: item.product.price,
                    quantity: item.quantity
                };
            });

            const totalPrice = items.reduce(
                (sum, item) => sum + item.price * item.quantity,
                0
            );

            const order = await Order.create({
                user: user._id,
                items,
                totalPrice
            });

            cart.items = [];
            await cart.save();

            return await populateOrder(order._id);
        },

        updateOrderStatus: async (_, { id, status }, { user }) => {
            requireAdmin(user);

            if (!allowedStatus.includes(status)) {
                throw new Error("Invalid order status");
            }

            const order = await Order.findById(id);

            if (!order) {
                throw new Error("Order not found");
            }

            order.status = status;

            await order.save();

            return await populateOrder(order._id);
        }
    }
};
