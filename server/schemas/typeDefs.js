const { gql } = require( 'apollo-server-express' );

const typeDefs = gql`
type User {
    _id: ID
    username: String
    firstName: String
    lastName: String
    email: String
    tasks: [Task]
}

type Task {
    _id: ID
    taskText: String
    createdAt: String
    username: String
    priority: Boolean
}

type Auth {
    token: ID!
    user: User
}

type Query {
    me: User
    users: [User]
    user(username: String!): User
    tasks(username: String): [Task]
    task(_id: ID!): Task
}

type Mutation {
    login(email: String!, password: String!): Auth
    addUser(username: String!, firstName: String!, lastName: String!, email: String!, password: String!): Auth
    addTask(taskText: String!, priority: Boolean!): Task
    deleteTask(_id: ID!): Task
}
`;

module.exports = typeDefs;