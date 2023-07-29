// Import required modules from the 'mongoose' library
const { Schema, model } = require( 'mongoose' );

// Import the 'dateFormat' function from the '../utils/dateFormat' file
const dateFormat = require( '../utils/dateFormat' );

// Define the schema for the 'Task' collection in the database
const taskSchema = new Schema(
    {
        // Define the 'taskText' field with String type, required, and with length constraints
        taskText: {
            type: String,
            required: 'You need to add some context to your task!',
            minlength: 1,
            maxlength: 280
        },

        // Define the 'createdAt' field with Date type, default value as current timestamp, and a custom getter using 'dateFormat' function
        createdAt: {
            type: Date,
            default: Date.now,
            get: timestamp => dateFormat( timestamp )
        },

        // Define the 'username' field with String type, which is required
        username: {
            type: String,
            required: true
        },

        // Define the 'priority' field with Boolean type, default value as false
        priority: {
            type: Boolean,
            default: false
        },

        // Define the 'isDone' field with Boolean type, default value as false
        isDone: {
            type: Boolean,
            default: false
        }
    },

    // Add a configuration object with toJSON option and getters set to true
    // This allows the schema to apply getters (e.g., dateFormat) when converting to JSON format
    {
        toJSON: {
            getters: true
        }
    }
);

// Create a 'Task' model using the taskSchema and mongoose.model function
const Task = model( 'Task', taskSchema );

// Export the 'Task' model, making it accessible to other parts of the application
module.exports = Task;
