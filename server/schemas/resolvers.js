// Import the 'AuthenticationError' class from the 'apollo-server-express' package
const { AuthenticationError } = require( 'apollo-server-express' );

// Import the 'User' and 'Task' models from the '../models' file
const { User, Task } = require( '../models' );

// Import the 'signToken' function from the '../utils/auth' file
const { signToken } = require( '../utils/auth' );

// Create an object called 'resolvers' that contains resolver functions for different GraphQL queries and mutations
const resolvers = {
    // Resolver functions for GraphQL queries (Query)
    Query: {
        // 'me' resolver: Fetches the details of the logged-in user
        me: async ( parent, args, context ) =>
        {
            // Check if the user is authenticated (logged in)
            if( context.user ) {
                // If authenticated, find the user by their ID, excluding '__v' and 'password' fields, and populate their 'tasks' field
                const userData = await User.findOne( { _id: context.user._id } ).select( '-__v -password' ).populate( 'tasks' );

                // Return the user data
                return userData;
            }

            // If not authenticated, throw an 'AuthenticationError'
            throw new AuthenticationError( 'Not logged in' );
        },

        // 'users' resolver: Fetches a list of all users
        users: async () =>
        {
            // Find all users, excluding '__v' and 'password' fields, and populate their 'tasks' field
            return User.find().select( '-__v -password' ).populate( 'tasks' );
        },

        // 'user' resolver: Fetches the details of a user by their username
        user: async ( parent, { username } ) =>
        {
            // Find a user by their username, excluding '__v' and 'password' fields, and populate their 'tasks' field
            return User.findOne( { username } ).select( '-__v -password' ).populate( 'tasks' );
        },

        // 'tasks' resolver: Fetches a list of tasks for a specific user (filtered by username if provided)
        tasks: async ( parent, { username } ) =>
        {
            // If 'username' is provided, create a 'params' object with 'username' field for filtering tasks by username
            // Otherwise, an empty object means fetch all tasks
            const params = username ? { username } : {};

            // Find tasks based on the 'params' object and sort them by 'createdAt' field in descending order
            return Task.find( params ).sort( { createdAt: -1 } );
        },

        // 'task' resolver: Fetches the details of a task by its unique '_id'
        task: async ( parent, { _id } ) =>
        {
            // Find a task by its '_id'
            return Task.findOne( { _id } );
        }
    },

    // Resolver functions for GraphQL mutations (Mutation)
    Mutation: {
        // 'addUser' resolver: Adds a new user to the database
        addUser: async ( parent, args ) =>
        {
            // Create a new user using the provided arguments
            const user = await User.create( args );

            // Generate a token for the newly created user using the 'signToken' function from the 'utils/auth' file
            const token = signToken( user );

            // Return an object containing the generated token and the user information
            return { token, user };
        },

        // 'login' resolver: Authenticates a user based on email and password
        login: async ( parent, { email, password } ) =>
        {
            // Find a user by their email
            const user = await User.findOne( { email } );

            // If the user does not exist or the provided password is incorrect, throw an 'AuthenticationError'
            if( !user || !( await user.isCorrectPassword( password ) ) ) {
                throw new AuthenticationError( 'Incorrect credentials' );
            }

            // Generate a token for the authenticated user using the 'signToken' function
            const token = signToken( user );

            // Return an object containing the generated token and the user information
            return { token, user };
        },

        // 'addTask' resolver: Adds a new task to the database
        addTask: async ( parent, args, context ) =>
        {
            // Check if the user is authenticated (logged in)
            if( context.user ) {
                // Create a new task with the provided arguments and set its 'username' field to the username of the logged-in user
                const task = await Task.create( { ...args, username: context.user.username } );

                // Return the newly created task
                return task;
            }

            // If not authenticated, throw an 'AuthenticationError'
            throw new AuthenticationError( 'You need to be logged in!' );
        },

        // 'deleteTask' resolver: Deletes a task from the database
        deleteTask: async ( parent, args, context ) =>
        {
            // Check if the user is authenticated (logged in)
            if( context.user ) {
                // Find the task to be deleted by its '_id' and the username of the logged-in user
                const task = await Task.findById( { ...args, username: context.user.username } );

                // If the task exists, remove it from the database
                if( task ) {
                    await task.remove();

                    // Remove the task's ID from the 'tasks' array of the logged-in user
                    await User.findByIdAndUpdate( { _id: context.user._id }, { $pull: { tasks: task._id } }, { new: true } );
                }

                // Return the deleted task (or null if the task does not exist)
                return task;
            }
        },

        // 'updateTaskPriority' resolver: Updates the priority of a task in the database
        updateTaskPriority: async ( parent, { _id, priority }, context ) =>
        {
            // Check if the user is authenticated (logged in)
            if( !context.user ) {
                throw new AuthenticationError( 'You need to be logged in!' );
            }

            // Find the task to be updated by its '_id'
            const task = await Task.findById( _id );

            // If the task does not exist, throw an error
            if( !task ) {
                throw new Error( 'Task not found' );
            }

            // Check if the task belongs to the logged-in user
            if( task.username !== context.user.username ) {
                throw new AuthenticationError( "You don't have permission to update this task" );
            }

            // Update the 'priority' field of the task
            task.priority = priority;

            // Save the updated task in the database
            return await task.save();
        },

        // 'updateTaskIsDone' resolver: Updates the 'isDone' field of a task in the database
        updateTaskIsDone: async ( parent, { _id, isDone }, context ) =>
        {
            // Check if the user is authenticated (logged in)
            if( !context.user ) {
                // If the user is not logged in, throw an 'AuthenticationError'
                throw new AuthenticationError( 'You need to be logged in!' );
            }

            // Find the task to be updated by its '_id'
            const task = await Task.findById( _id );

            // Check if the task exists
            if( !task ) {
                // If the task is not found, throw an error
                throw new Error( 'Task not found' );
            }

            // Check if the task belongs to the logged-in user
            if( task.username !== context.user.username ) {
                // If the task doesn't belong to the user, throw an 'AuthenticationError'
                throw new AuthenticationError( "You don't have permission to update this task" );
            }

            // Update the 'isDone' field of the task with the provided value
            task.isDone = isDone;

            // Save the updated task in the database
            return await task.save();
        },

        // 'updateTaskText' resolver: Updates the 'taskText' field of a task in the database
        updateTaskText: async ( parent, { _id, taskText }, context ) =>
        {
            // Check if the user is authenticated (logged in)
            if( !context.user ) {
                // If the user is not logged in, throw an 'AuthenticationError'
                throw new AuthenticationError( 'You need to be logged in!' );
            }

            // Find the task to be updated by its '_id'
            const task = await Task.findById( _id );

            // Check if the task exists
            if( !task ) {
                // If the task is not found, throw an error
                throw new Error( 'Task not found' );
            }

            // Check if the task belongs to the logged-in user
            if( task.username !== context.user.username ) {
                // If the task doesn't belong to the user, throw an 'AuthenticationError'
                throw new AuthenticationError( "You don't have permission to update this task" );
            }

            // Update the 'taskText' field of the task with the provided value
            task.taskText = taskText;

            // Save the updated task in the database
            return await task.save();
        }

    }
};

module.exports = resolvers;
