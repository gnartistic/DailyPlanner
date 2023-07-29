import { gql } from '@apollo/client';

export const QUERY_TASKS = gql`
query tasks($username: String) {
    tasks(username: $username) {
    _id
    taskText
    createdAt
    username
    priority
    isDone
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
    priority
    isDone
    }
}
`;

export const QUERY_USER = gql`
query user($username: String!) {
    user(username: $username) {
    _id
    username
    email
    Tasks {
        _id
        taskText
        createdAt
        priority
        isDone
        }
    }
}
`;

export const QUERY_ME = gql`
{
    me {
        _id
        firstName
        lastName
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

export const QUERY_ME_BASIC = gql`
{
    me {
        _id
        username
        email
    }
}
`;
