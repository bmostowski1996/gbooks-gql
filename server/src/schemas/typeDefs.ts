// Student's note: Our type defs need to specify what our queries and mutations return too!

const typeDefs = `
    type Book {
        _id: ID!
        authors: [String]
        description: String
        bookId: String
        image: String
        link: String
        title: String
    }
    
    type User {
        _id: ID!
        username: String
        email: String
        password: String
        savedBooks: [Book]
    }

    type Auth {
        token: ID!
        user: User
    }  

    input UserInput {
        username: String!
        email: String!
        password: String!
    }  

    input BookInput {
        authors: [String]
        description: String!
        image: String
        link: String
        bookId: String!
        title: String!
    }

    type Query {
        users: [User]!
        user(userId: ID!): User
        me: User
    }

    type Mutation {
        addUser(input: UserInput!): Auth
        login(email: String!, password: String!): Auth
        saveBook(input: BookInput!): User
        deleteBook(bookId: String!): User
    }
`;

export default typeDefs;