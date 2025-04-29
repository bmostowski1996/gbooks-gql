import { gql } from '@apollo/client';

export const MUTATION_LOGIN = gql`
    mutation login($email: String!, $password: String!) {
        login(email: $email, password: $password) {
            token
            user {
                _id
                username
                email
                password
                savedBooks {
                    _id
                    title
                }
            }
        }
    }
`;

export const MUTATION_ADD_USER = gql`
    mutation addUser($input: UserInput!) {
        addUser(input: $input) {
            token 
            user {
                _id
                username
                email
                password
                savedBooks {
                    _id
                    title
                }
            }
        }
    }
`;

export const MUTATION_SAVE_BOOK = gql`
    mutation saveBook($input: BookInput!) {
        saveBook(input: $input) {
            _id
            username
            email
            password
            savedBooks {
                _id
                title
            }
        }
    }
`;

export const MUTATION_DELETE_BOOK = gql`
    mutation deleteBook($bookId: String!) {
        deleteBook(bookId: $bookId) {
            _id
            username
            email
            savedBooks {
                bookId
                title
                authors
                description
                image
                link
            }
        }
    }
`;
