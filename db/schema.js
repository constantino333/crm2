const { gql } = require('apollo-server');

//Schema
const typeDefs = gql`
    type Cliente {
        name: String
        email: String
    }

    input UserInput{
        name: String!
        lastname: String!
        email: String!
        password: String!
    }

    input ProductInput{
        name: String!
        stock: Int!
        price: Float!
        image: String!
    }

    input AuthenticateInput{
        email: String!
        password: String!
    }

    type User{
        id: ID
        name: String
        lastname: String
        email: String
        created: String
    }

    type Token {
        token: String
    }

    type Product {
        id: ID
        name: String
        price: Float
        stock: Int
        image: String
        created: String
        user: ID
    }

    type Query {
        getUser: User
        obtenerUsuario: User
        getProductUser: [Product]
    }

    type Mutation {
        # Usuarios
        newUser(input: UserInput) : User
        authenticateUser(input: AuthenticateInput): Token

        # Products
        newProduct(input: ProductInput) : Product
        deleteProduct( id: ID! ) : String
    }
`;

module.exports = typeDefs;