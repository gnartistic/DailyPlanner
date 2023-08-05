import React, { useState, useEffect, useMemo } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { ADD_TASK, DELETE_TASK, UPDATE_TASK_IS_DONE, UPDATE_TASK_IS_PRIORITY } from '../../utils/mutations';
import { QUERY_TASKS } from '../../utils/queries';
import Auth from '../../utils/auth';
import { useNavigate } from 'react-router-dom'; // Import Navigate
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck } from '@fortawesome/free-solid-svg-icons';


import './index.scss'

const ToDoList = () =>
{
    const [ taskText, setText ] = useState( '' );
    const [ characterCount, setCharacterCount ] = useState( 0 );
    const [ tasks, setTasks ] = useState( [] ); // Local state for tasks
    const [ completedTasksCount, setCompletedTasksCount ] = useState( 0 );
    const [ completedTasks, setCompletedTasks ] = useState( [] );
    const [ priorityTasks, setPriorityTasks ] = useState( [] );



    const navigate = useNavigate();
    const loggedIn = Auth.loggedIn();

    // If user is not logged in, navigate to the home page
    useEffect( () =>
    {
        if( !loggedIn ) {
            navigate( '/' );
        }
    }, [ loggedIn, navigate ] );

    const { loading, data } = useQuery( QUERY_TASKS );

    const tasksFromQuery = useMemo( () => data?.tasks || [], [ data ] );// Tasks fetched from the query

    useEffect( () =>
    {
        const combinedTasks = tasks.concat( tasksFromQuery );
        setCompletedTasks( combinedTasks.filter( task => task.isDone ) );
    }, [ tasks, tasksFromQuery ] );

    useEffect( () =>
    {
        setCompletedTasksCount( completedTasks.length );
    }, [ completedTasks ] );

    const [ addTask ] = useMutation( ADD_TASK, {
        onCompleted ( { addTask } )
        {
            // Update local state to include the newly added task
            setTasks( [ ...tasks, addTask ] );
        },
    } );

    const [ deleteTask ] = useMutation( DELETE_TASK, {
        update ( cache, { data: { deleteTask } } )
        {
            // Remove the deleted task from the cache
            cache.modify( {
                fields: {
                    tasks ( existingTasks = [], { readField } )
                    {
                        return existingTasks.filter(
                            ( taskRef ) => deleteTask._id !== readField( '_id', taskRef )
                        );
                    },
                },
            } );
        },
    } );

    const [ updateTaskIsDone ] = useMutation( UPDATE_TASK_IS_DONE ); // Add the updateTaskIsDone mutation

    const [ updateTaskIsPriority ] = useMutation( UPDATE_TASK_IS_PRIORITY );

    const handleCheckboxChange = async ( taskId, isDone, isPriority ) =>
    {
        try {
            console.log( `Changing task ${ taskId } status to ${ !isDone }` );
            await updateTaskIsDone( {
                variables: { _id: taskId, isDone: !isDone },
            } );
            console.log( `Task ${ taskId } status updated successfully.` );


            // Update completedTasks array
            if( !isDone ) {
                setCompletedTasks( prevTasks => prevTasks.filter( task => task._id !== taskId ) );
            } else {
                setCompletedTasks( prevTasks => [ ...prevTasks, taskId ] );
            }

            setCompletedTasksCount( completedTasks.length );
        } catch( error ) {
            console.error( error );
        }
    };


    const handleDeleteTask = async ( taskId, isDone ) =>
    {
        try {
            await deleteTask( {
                variables: { _id: taskId, isDone: !isDone },
            } );
        } catch( error ) {
            console.error( error );
        }
    };

    const handleChange = ( event ) =>
    {
        if( event.target.value.length <= 280 ) {
            setText( event.target.value );
            setCharacterCount( event.target.value.length );
        }
    };

    const handleFormSubmit = async ( event ) =>
    {
        event.preventDefault();

        try {
            await addTask( {
                variables: { taskText },
            } );

            setText( '' );
            setCharacterCount( 0 );
        } catch( e ) {
            console.error( e );
        }
    };

    return (
        <>
            {loggedIn && (
                <div className='tasks'>
                    <h1>To-Do List</h1>
                    <p>Completed tasks: {completedTasksCount} / {tasks.length + tasksFromQuery.length}</p>

                    <form className='task' onSubmit={handleFormSubmit}>
                        <textarea
                            className='task-input'
                            value={taskText}
                            onChange={handleChange}
                            maxLength={280}
                            placeholder='Enter your task...'
                        />
                        <p className='characterCount'>{characterCount} / 280 characters</p>
                        <div className='button-container'>
                            <button className='save-button' type='submit'>
                                Add
                            </button>
                        </div>
                    </form>
                    <div>
                        {loading ? (
                            <div>Loading...</div>
                        ) : (
                            <div className='task-list'>
                                {tasks.concat( tasksFromQuery ).map( ( task ) => (
                                    <div key={task._id} className='task'>
                                        <label className='custom-checkbox'>
                                            <input
                                                type='checkbox'
                                                checked={task.isDone}
                                                onChange={() => handleCheckboxChange( task._id, task.isDone, task.isPriority )}
                                            />
                                            <span className='checkmark'>
                                                <FontAwesomeIcon icon={faCheck} className='icon' />
                                            </span>
                                        </label>
                                        <p className='task-text'>{task.taskText}</p>
                                        <div className='button-container'>
                                            <button
                                                className='delete-button'
                                                onClick={() => handleDeleteTask( task._id, task.isDone )}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>


                                ) )}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
};

export default ToDoList;
