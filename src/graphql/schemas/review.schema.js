export const reviewTypeDefs = `#graphql
    type Review {
        _id: ID!
        user: User
        product: Product
        rating: Int!
        comment: String!
        createdAt: String
        updatedAt: String
    }

    type Query {
        productReviews(productId: ID!): [Review]
    }

    type Mutation {
        createReview(
            productId: ID!
            rating: Int!
            comment: String!
        ): Review
    }
`;
