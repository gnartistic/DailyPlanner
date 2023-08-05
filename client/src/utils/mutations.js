import { gql } from '@apollo/client';

export const LOGIN_USER = gql`
mutation login($email: String!, $password: String!) {
        login(email: $email, password: $password) {
    token
    user {
        _id
        email
        firstName
        lastName
        }
    }
}
`;

export const ADD_USER = gql`
mutation addUser($username: String!, $firstName: String!, $lastName: String!, $email: String!, $password: String!) {
    addUser(username: $username, firstName: $firstName, lastName: $lastName, email: $email, password: $password) {
    token
    user {
        _id
        username
        email
        firstName
        lastName
        }
    }
}
`;

export const ADD_TASK = gql`
mutation addTask($taskText: String!) {
    addTask(taskText: $taskText) {
        _id
        taskText
        createdAt
        username
        priority
    }
}
`;


export const DELETE_TASK = gql`
mutation deleteTask($_id: ID!) {
    deleteTask(_id: $_id) {
        _id
    }
}`;

export const UPDATE_TASK_IS_DONE = gql`
mutation updateTaskIsDone( $_id: ID!, $isDone: Boolean! ) {
    updateTaskIsDone(_id: $_id, isDone: $isDone) {
        _id
        taskText
        createdAt
        username
        priority
        isDone
    }
}
`

export const UPDATE_TASK_IS_PRIORITY = gql`
mutation updateTaskIsPriority( $_id: ID!, $isPriority: Boolean! ) {
    updateTaskIsPriority(_id: $_id, isPriority: $isPriority) {
        _id
        taskText
        createdAt
        username
        priority
        isDone
    }
}
`
