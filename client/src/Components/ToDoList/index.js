import React, { useState, useEffect } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { ADD_TASK, DELETE_TASK } from '../../utils/mutations';
import { QUERY_TASKS } from '../../utils/queries';
import Auth from '../../utils/auth';
import { useNavigate } from 'react-router-dom'; // Import Navigate


import './index.scss'

const ToDoList = () => {
    const [taskText, setText] = useState('');
    const [characterCount, setCharacterCount] = useState(0);
    const [ tasks, setTasks ] = useState( [] ); // Local state for tasks
    
    const navigate = useNavigate();
    const loggedIn = Auth.loggedIn();

    // If user is not logged in, navigate to the home page
    useEffect(() => {
        if (!loggedIn) {
            navigate('/');
        }
    }, [loggedIn, navigate]);


    const { loading, data } = useQuery(QUERY_TASKS);
    const tasksFromQuery = data?.tasks || []; // Tasks fetched from the query

    const [addTask] = useMutation(ADD_TASK, {
        onCompleted({ addTask }) {
            // Update local state to include the newly added task
            setTasks([...tasks, addTask]);
        },
    });

    const [deleteTask] = useMutation(DELETE_TASK, {
        update(cache, { data: { deleteTask } }) {
            // Remove the deleted task from the cache
            cache.modify({
                fields: {
                    tasks(existingTasks = [], { readField }) {
                        return existingTasks.filter(
                            (taskRef) => deleteTask._id !== readField('_id', taskRef)
                        );
                    },
                },
            });
        },
    });

    const handleDeleteTask = async (taskId) => {
        try {
            await deleteTask({
                variables: { _id: taskId },
            });
        } catch (error) {
            console.error(error);
        }
    };

    const handleChange = (event) => {
        if (event.target.value.length <= 280) {
            setText(event.target.value);
            setCharacterCount(event.target.value.length);
        }
    };

    const handleFormSubmit = async (event) => {
        event.preventDefault();

        try {
            await addTask({
                variables: { taskText },
            });

            setText('');
            setCharacterCount(0);
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <>
            {loggedIn && (
                <div className='tasks'>
                    <h1>To-Do List</h1>
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
                                {tasks.concat(tasksFromQuery).map((task) => (
                                    <div key={task._id} className='task'>
                                        <p className='task-text'>{task.taskText}</p>
                                        <div className='button-container'>
                                            <button
                                                className='delete-button'
                                                onClick={() => handleDeleteTask(task._id)}>
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
};

export default ToDoList;
