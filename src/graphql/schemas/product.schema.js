export const productTypeDefs = `#graphql
    type Category {
        _id: ID!
        name: String!
        description: String
    }

    type Product {
        _id: ID!
        name: String!
        description: String!
        price: Float!
        stock: Int!
        category: Category
        images: [String]
        rating: Float
        numReviews: Int
    }

    input ProductFilterInput {
        search: String
        category: ID
        minPrice: Float
        maxPrice: Float
    }

    input PaginationInput {
        page: Int
        limit: Int
    }

    type ProductListResponse {
        success: Boolean!
        page: Int!
        limit: Int!
        total: Int!
        totalPages: Int!
        products: [Product]
    }

    type Query {
        categories: [Category]
        products(
            filter: ProductFilterInput
            pagination: PaginationInput
        ): ProductListResponse

        product(id: ID!): Product
    }

    type Mutation {
        createCategory(
            name: String!
            description: String
        ): Category

        updateCategory(
            id: ID!
            name: String
            description: String
        ): Category

        deleteCategory(id: ID!): Boolean

        createProduct(
            name: String!
            description: String!
            price: Float!
            stock: Int!
            category: ID!
            images: [String]
        ): Product

        updateProduct(
            id: ID!
            name: String
            description: String
            price: Float
            stock: Int
            category: ID
            images: [String]
        ): Product

        deleteProduct(id: ID!): Boolean
    }
`;