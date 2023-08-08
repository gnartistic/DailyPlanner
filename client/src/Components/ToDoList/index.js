// Import necessary components and libraries
import React, { useState, useEffect, useMemo } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { ADD_TASK, DELETE_TASK, UPDATE_TASK_IS_DONE, UPDATE_TASK_IS_PRIORITY } from '../../utils/mutations';
import { QUERY_TASKS } from '../../utils/queries';
import Auth from '../../utils/auth';
import { useNavigate } from 'react-router-dom';
import TaskForm from './TaskForm'; // Import the TaskForm component
import TaskList from './TaskList'; // Import the TaskList component
import './index.scss'; // Import styles

// Parent component for the ToDoList
const ToDoList = () =>
{
    // State variables for different aspects of the app
    const [ taskText, setText ] = useState( '' );
    const [ characterCount, setCharacterCount ] = useState( 0 );
    const [ tasks, setTasks ] = useState( [] );
    const [ completedTasksCount, setCompletedTasksCount ] = useState( 0 );
    const [ completedTasks, setCompletedTasks ] = useState( [] );
    const [ priorityTasks, setPriorityTasks ] = useState( [] );
    const [ allTasksDeleted, setAllTasksDeleted ] = useState( false );


    // Get navigation function for redirecting users
    const navigate = useNavigate();

    // Check if user is logged in
    const loggedIn = Auth.loggedIn();

    // Fetch tasks using a GraphQL query
    const { loading, data } = useQuery( QUERY_TASKS );

    const [ updateTaskIsDone ] = useMutation( UPDATE_TASK_IS_DONE );
    const [ updateTaskIsPriority ] = useMutation( UPDATE_TASK_IS_PRIORITY );

    // Extract tasks from the query result using memoization
    const tasksFromQuery = useMemo( () => data?.tasks || [], [ data ] );

    useEffect( () =>
    {
        // Check if user is logged in and redirect if not
        if( !loggedIn ) {
            navigate( '/' );
        }

        // Combine tasks from state and query, and update completed tasks
        const combinedTasks = tasks.concat( tasksFromQuery );
        setCompletedTasks( combinedTasks.filter( task => task.isDone ) );

        // Calculate the initial completedTasksCount based on the combined tasks
        const initialCompletedTasksCount = combinedTasks.filter( task => task.isDone ).length;
        setCompletedTasksCount( initialCompletedTasksCount );

    }, [ loggedIn, navigate, tasks, tasksFromQuery ] );

    useEffect( () =>
    {
        if( allTasksDeleted ) {
            navigate( '/Main' ); // Replace with the route you want to navigate to
        }
    }, [ allTasksDeleted, navigate ] );

     // Define mutations for adding, deleting, and updating tasks
    const [ addTask ] = useMutation( ADD_TASK, {
        onCompleted ( { addTask } )
        {
            setTasks( existingTasks => [ ...existingTasks, addTask ] );

            // Update completedTasks array
            if( addTask.isDone ) {
                setCompletedTasks( existingCompletedTasks => [ ...existingCompletedTasks, addTask ] );
                setCompletedTasksCount( prevCount => prevCount + 1 ); // Update the count here
            }
        },
    } );

    const [ deleteTask ] = useMutation( DELETE_TASK, {
        update ( cache, { data: { deleteTask } } )
        {
            // Update tasks and completedTasks arrays
            setTasks( existingTasks => existingTasks.filter( task => task._id !== deleteTask._id ) );
            setCompletedTasks( existingCompletedTasks => existingCompletedTasks.filter( task => task._id !== deleteTask._id ) );

            cache.modify( {
                fields: {
                    tasks ( existingTasks = [], { readField } )
                    {
                        return existingTasks.filter(
                            taskRef => deleteTask._id !== readField( '_id', taskRef )
                        );
                    },
                },
            } );
        },
    } );

    // Function to handle checkbox changes for tasks
    const handleCheckboxChange = async ( taskId, isDone, isPriority ) =>
    {
        try {
            // Update task's status using a mutation
            await updateTaskIsDone( {
                variables: { _id: taskId, isDone: !isDone },
            } );

            // Update the completed tasks array based on the change
            if( isDone ) {
                setCompletedTasks( prevTasks => prevTasks.filter( task => task._id !== taskId ) );
                setCompletedTasksCount( prevCount => prevCount - 1 ); // Decrement count
            } else {
                setCompletedTasks( prevTasks => [ ...prevTasks, taskId ] );
                setCompletedTasksCount( prevCount => prevCount + 1 ); // Increment count
            }
        } catch( error ) {
            console.error( error );
        }
    };

    // Function to handle deleting a task
    const handleDeleteTask = async ( taskId, isDone ) =>
    {
        try {
            await deleteTask( {
                variables: { _id: taskId },
            } );

            // Update the completed tasks array and completedTasksCount
            if( isDone ) {
                setCompletedTasks( prevTasks => prevTasks.filter( task => task._id !== taskId ) );
                setCompletedTasksCount( prevCount => prevCount - 1 ); // Decrease count
            }

            // Check if all tasks have been deleted
            if (tasks.length === 1 && isDone && completedTasksCount === 1) {
    setAllTasksDeleted(true);
}
        } catch( error ) {
            console.error( error );
        }
    };

    const handleAddTask = async () => {
    try {
        // Perform the task addition logic using addTask mutation
        const { data } = await addTask({
            variables: { taskText, isDone: true }, // Adjust this as needed
        });

        // Clear the task text input and character count
        setText('');
        setCharacterCount(0);

        // Update the completedTasksCount only if the task added is marked as done
        if (data.addTask.isDone) {
            setCompletedTasksCount(prevCount => prevCount + 1); // Increment count
        }
    } catch (error) {
        console.error(error);
    }
};


    // Function to handle text input changes
    const handleChange = event =>
    {
        if( event.target.value.length <= 280 ) {
            setText( event.target.value );
            setCharacterCount( event.target.value.length );
        }
    };


    // Render the ToDoList component
    return (
        <>
            {loggedIn && (
                <div className='tasks'>
                    <h1>To-Do List</h1>
                    <p>Completed tasks: {completedTasksCount} / {tasks.length + tasksFromQuery.length}</p>

                    {/* Render the TaskForm component */}
                    <TaskForm
                        taskText={taskText}
                        characterCount={characterCount}
                        handleChange={handleChange}
                        handleFormSubmit={handleAddTask}
                    />

                    {/* Render the TaskList component */}
                    <TaskList
                        tasks={tasks.concat( tasksFromQuery )}
                        handleCheckboxChange={handleCheckboxChange}
                        handleDeleteTask={handleDeleteTask}
                    />
                </div>
            )}
        </>
    );
};

export default ToDoList;