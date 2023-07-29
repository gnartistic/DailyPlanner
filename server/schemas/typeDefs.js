// Import the 'gql' function from 'apollo-server-express' package
const { gql } = require( 'apollo-server-express' );

// Define the GraphQL type definitions using the 'gql' template literal tag
const typeDefs = gql`
    # 'User' type: Represents a user with various fields
        type User {
        _id: ID
        username: String
        firstName: String
        lastName: String
        email: String
        tasks: [Task] # An array of 'Task' objects associated with the user
    }

    # 'Task' type: Represents a task with various fields
        type Task {
        _id: ID
        taskText: String
        createdAt: String
        username: String
        priority: Boolean
        isDone: Boolean
        }

    # 'Auth' type: Represents authentication response with a token and user details
        type Auth {
        token: ID! # A unique identifier for the token
        user: User  # The associated 'User' object
        }

    # 'Query' type: Defines all the available queries in the API
        type Query {
        me: User                      # Fetches the details of the logged-in user
        users: [User]                 # Fetches a list of all users
        user(username: String!): User # Fetches the details of a user by their username
        tasks(username: String): [Task] # Fetches a list of tasks for a specific user (filtered by  username if provided)

        task(_id: ID!): Task          # Fetches the details of a task by its unique '_id'
        }

    # 'Mutation' type: Defines all the available mutations in the API
        type Mutation {
        login(email: String!, password: String!): Auth # Authenticates a user based on email and password
        addUser(username: String!, firstName: String!, lastName: String!, email: String!, password: String!): Auth # Adds a new user to the database
        addTask(taskText: String!): Task # Adds a new task to the database
        deleteTask(_id: ID!): Task       # Deletes a task from the database
        updateTaskPriority(_id: ID!, priority: Boolean!): Task # Updates the priority of a task in the database
        updateTaskIsDone(_id: ID!, isDone: Boolean!): Task     # Updates the 'isDone' field of a task in the database
        updateTaskText(_id: ID!, taskText: String!): Task      # Updates the 'taskText' field of a task in the database
    }
`;

// Export the defined type definitions to be used by the Apollo Server
module.exports = typeDefs;
