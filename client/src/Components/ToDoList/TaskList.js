// Import React and necessary icons from Font Awesome library
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';

// TaskList component for displaying the list of tasks
const TaskList = ( { tasks, handleCheckboxChange, handleDeleteTask } ) =>
{
    return (
        // Container for the list of tasks
        <div className='task-list'>
            {/* Map through each task and render its details */}
            {tasks.map( ( task ) => (
                <div key={task._id} className='task'>
                    {/* Custom checkbox for task completion */}
                    <label className='custom-checkbox'>
                        {/* Checkbox input for marking task as done */}
                        <input
                            type='checkbox'
                            checked={task.isDone}
                            onChange={() => handleCheckboxChange( task._id, task.isDone, task.isPriority )}
                        />
                        {/* Display checkmark icon */}
                        <span className='checkmark'>
                            <FontAwesomeIcon icon={faCheck} className='icon' />
                        </span>
                    </label>
                    {/* Display task text */}
                    <p className='task-text'>{task.taskText}</p>
                    {/* Container for the delete button */}
                    <div className='button-container'>
                        {/* Delete button for removing a task */}
                        <button className='delete-button' onClick={() => handleDeleteTask( task._id, task.isDone )}>
                            Delete
                        </button>
                    </div>
                </div>
            ) )}
        </div>
    );
};

// Export the TaskList component for use in other parts of the app
export default TaskList;

