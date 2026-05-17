import Cart from "../../models/Cart.js";
import Product from "../../models/Product.js";
import { cartItemSchema } from "../../validations/cart.validation.js";
import { productIdParamSchema } from "../../validations/common.validation.js";
import { parseGraphQLInput } from "../../utils/validateGraphql.js";

const requireAuth = (user) => {
    if (!user) {
        throw new Error("Authentication required");
    }
};

const getOrCreateCart = async (userId) => {
    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
        cart = await Cart.create({
            user: userId,
            items: []
        });
    }

    return cart;
};

const populateCart = async (cartId) => {
    return await Cart.findById(cartId).populate("items.product");
};

export const cartResolvers = {
    Query: {
        cart: async (_, __, { user }) => {
            requireAuth(user);

            const cart = await getOrCreateCart(user._id);

            return await populateCart(cart._id);
        }
    },

    Mutation: {
        addToCart: async (_, { productId, quantity }, { user }) => {
            requireAuth(user);
            const data = parseGraphQLInput(cartItemSchema, {
                productId,
                quantity
            });

            const product = await Product.findById(data.productId);

            if (!product) {
                throw new Error("Product not found");
            }

            const cart = await getOrCreateCart(user._id);

            const existingItem = cart.items.find(
                item => item.product.toString() === data.productId
            );

            if (existingItem) {
                existingItem.quantity += data.quantity;
            } else {
                cart.items.push({
                    product: data.productId,
                    quantity: data.quantity
                });
            }

            await cart.save();

            return await populateCart(cart._id);
        },

        updateCartItem: async (_, { productId, quantity }, { user }) => {
            requireAuth(user);
            const data = parseGraphQLInput(cartItemSchema, {
                productId,
                quantity
            });

            const cart = await Cart.findOne({ user: user._id });

            if (!cart) {
                throw new Error("Cart not found");
            }

            const item = cart.items.find(
                item => item.product.toString() === data.productId
            );

            if (!item) {
                throw new Error("Item not found in cart");
            }

            item.quantity = data.quantity;

            await cart.save();

            return await populateCart(cart._id);
        },

        removeFromCart: async (_, { productId }, { user }) => {
            requireAuth(user);
            const data = parseGraphQLInput(
                productIdParamSchema,
                { productId }
            );

            const cart = await Cart.findOne({ user: user._id });

            if (!cart) {
                throw new Error("Cart not found");
            }

            cart.items = cart.items.filter(
                item => item.product.toString() !== data.productId
            );

            await cart.save();

            return await populateCart(cart._id);
        },

        clearCart: async (_, __, { user }) => {
            requireAuth(user);

            const cart = await getOrCreateCart(user._id);

            cart.items = [];

            await cart.save();

            return await populateCart(cart._id);
        }
    }
};
