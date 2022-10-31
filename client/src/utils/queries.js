import { gql } from '@apollo/client';

export const QUERY_TASKS = gql`
query tasks($username: String) {
    tasks(username: $username) {
    _id
    taskText
    createdAt
    username
    }
}
`;

export const QUERY_TASK = gql`
query task($id: ID!) {
    task(_id: $id) {
    _id
    taskText
    createdAt
    username
    }
}
`;

export const QUERY_USER = gql`
query user($username: String!) {
    user(username: $username) {
    _id
    username
    email
    tasks {
        _id
        taskText
        createdAt
        }
    }
}
`;

export const QUERY_ME = gql`
{
    me {
        _id
        username
        email
        friendCount
        tasks {
            _id
            taskText
            createdAt
        }
    }
}
`;

export const QUERY_ME_BASIC = gql`
{
    me {
        _id
        username
        email
    }
}
`;
