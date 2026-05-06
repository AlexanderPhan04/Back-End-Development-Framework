export const userTypeDefs = `#graphql
    type User {
        _id: ID!
        name: String!
        email: String!
        role: String!
    }

    type AuthResponse {
        success: Boolean!
        token: String
        user: User
    }

    type Query {
        me: User
    }

    type Mutation {
        register(
            name: String!
            email: String!
            password: String!
        ): AuthResponse

        login(
            email: String!
            password: String!
        ): AuthResponse
    }
`;