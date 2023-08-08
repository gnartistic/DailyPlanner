// Import React and useState from React library
import React from 'react';

// TaskForm component for entering task information
const TaskForm = ( { addTask, characterCount, taskText, handleChange, handleFormSubmit } ) =>
{
    return (
        // Form for entering a new task
        <form className='task' onSubmit={handleFormSubmit}>
            {/* Textarea input for task description */}
            <textarea
                className='task-input'
                value={taskText}
                onChange={handleChange}
                maxLength={280}
                placeholder='Enter your task...'
            />
            {/* Display character count */}
            <p className='characterCount'>{characterCount} / 280 characters</p>
            {/* Button container for task submission */}
            <div className='button-container'>
                <button className='save-button' type='submit'>
                    Add
                </button>
            </div>
        </form>
    );
};

// Export the TaskForm component for use in other parts of the app
export default TaskForm;

