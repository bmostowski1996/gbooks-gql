import { gql } from '@apollo/client';

export const QUERY_USERS = gql`
  query users {
    users {
      _id
      username
      email
    }
  }
`;

export const QUERY_SINGLE_USER = gql`
    query user($userId: ID!) {
        user(userId: $userId) {
            _id
            username
            email
        }
    }
`;

export const QUERY_ME = gql`
    query me {
        me {
            _id
            username
            email
            savedBooks {
              _id
              title
              description
              bookId
              authors
              image
              link
            }
        }
    }
`;