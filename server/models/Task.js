const { Schema, model } = require( 'mongoose' );
const dateFormat = require( '../utils/dateFormat' );

const taskSchema = new Schema(
    {
        taskText: {
            type: String,
            required: 'You need to add some context to your task!',
            minlength: 1,
            maxlength: 280
        },
        createdAt: {
            type: Date,
            default: Date.now,
            get: timestamp => dateFormat( timestamp )
        },
        username: {
            type: String,
            required: true
        },
        priority: {
            type: Boolean,
            default: false
        },
        isDone: {
            type: Boolean,
            default: false
        }
    },
    {
        toJSON: {
            getters: true
        }
    }
);

const Task = model( 'Task', taskSchema );

module.exports = Task;