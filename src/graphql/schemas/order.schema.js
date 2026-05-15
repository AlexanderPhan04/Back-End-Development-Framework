export const orderTypeDefs = `#graphql
    type OrderItem {
        product: Product
        name: String
        price: Float
        quantity: Int
    }

    type Order {
        _id: ID!
        user: User
        items: [OrderItem]
        totalPrice: Float!
        status: String!
        createdAt: String
        updatedAt: String
    }

    type Query {
        orders: [Order]
        order(id: ID!): Order
    }

    type Mutation {
        createOrder: Order
        updateOrderStatus(
            id: ID!
            status: String!
        ): Order
    }
`;
