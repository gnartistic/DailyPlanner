const { AuthenticationError } = require( 'apollo-server-express' );
const { User, Task } = require( '../models' );
const { signToken } = require( '../utils/auth' );

const resolvers = {
    Query: {
        me: async ( parent, args, context ) =>
        {
            if( context.user ) {
                const userData = await User.findOne( { _id: context.user._id } )
                    .select( '-__v -password' )
                    .populate( 'tasks' );

                return userData;
            }

            throw new AuthenticationError( 'Not logged in' );
        },
        users: async () =>
        {
            return User.find()
                .select( '-__v -password' )
                .populate( 'tasks' );
        },
        user: async ( parent, { username } ) =>
        {
            return User.findOne( { username } )
                .select( '-__v -password' )
                .populate( 'tasks' );
        },
        tasks: async ( parent, { username } ) =>
        {
            const params = username ? { username } : {};
            return Task.find( params ).sort( { createdAt: -1 } );
        },
        task: async ( parent, { _id } ) =>
        {
            return Task.findOne( { _id } );
        }
    },

    Mutation: {
        addUser: async ( parent, args ) =>
        {
            const user = await User.create( args );
            const token = signToken( user );

            return { token, user };
        },
        login: async ( parent, { email, password } ) =>
        {
            const user = await User.findOne( { email } );

            if( !user ) {
                throw new AuthenticationError( 'Incorrect credentials' );
            }

            const correctPw = await user.isCorrectPassword( password );

            if( !correctPw ) {
                throw new AuthenticationError( 'Incorrect credentials' );
            }

            const token = signToken( user );
            return { token, user };
        },
        addTask: async ( parent, args, context ) =>
        {
            if( context.user ) {
                const task = await Task.create( { ...args, username: context.user.username } );

                await User.findByIdAndUpdate(
                    { _id: context.user._id },
                    { $push: { tasks: task._id } },
                    { new: true }
                );

                return task;
            }

            throw new AuthenticationError( 'You need to be logged in!' );
        },
        deleteTask: async ( parent, args, context ) =>
        {
            if( context.user ) {
                const task = await Task.findById( { ...args, username: context.user.username } );

                await task.remove();

                await User.findByIdAndUpdate(
                    { _id: context.user._id },
                    { $pull: { tasks: task._id } },
                    { new: true }
                );

                return task
            }
        },
        updateTaskPriority: async ( parent, { _id, priority }, context ) =>
        {
            // if( !context.user ) {
            //     throw new AuthenticationError( 'You need to be logged in!' );
            // }

            const task = await Task.findById( _id );

            // if( !task ) {
            //     throw new Error( 'Task not found' );
            // }

            // // Check if the task belongs to the logged-in user
            // if( task.username !== context.user.username ) {
            //     throw new AuthenticationError( "You don't have permission to update this task" );
            // }

            // Update the priority field
            task.priority = priority;

            return await task.save();
        },

        updateTaskIsDone: async ( parent, { _id, isDone }, context ) =>
        {
            // if( !context.user ) {
            //     throw new AuthenticationError( 'You need to be logged in!' );
            // }

            const task = await Task.findById( _id );

            // if( !task ) {
            //     throw new Error( 'Task not found' );
            // }

            // // Check if the task belongs to the logged-in user
            // if( task.username !== context.user.username ) {
            //     throw new AuthenticationError( "You don't have permission to update this task" );
            // }

            // Update the priority field
            task.isDone = isDone;

            return await task.save();
        },

    }
};

module.exports = resolvers;