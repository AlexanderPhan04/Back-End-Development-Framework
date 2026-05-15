export const cartTypeDefs = `#graphql
    type CartItem {
        product: Product
        quantity: Int!
    }

    type Cart {
        _id: ID!
        user: User
        items: [CartItem]
    }

    type Query {
        cart: Cart
    }

    type Mutation {
        addToCart(
            productId: ID!
            quantity: Int!
        ): Cart

        updateCartItem(
            productId: ID!
            quantity: Int!
        ): Cart

        removeFromCart(productId: ID!): Cart
        clearCart: Cart
    }
`;
