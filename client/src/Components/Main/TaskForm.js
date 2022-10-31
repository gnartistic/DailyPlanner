import React, { useState } from 'react';
import './index.scss'
import { useMutation } from '@apollo/client';
import { ADD_TASK } from '../../utils/mutations';
import { QUERY_TASKS, QUERY_ME } from '../../utils/queries';

const TaskForm = () =>
{
    const [ taskText, setText ] = useState( '' );
    const [ characterCount, setCharacterCount ] = useState( 0 );

    const [ addTask, { error } ] = useMutation( ADD_TASK, {
        update ( cache, { data: { addTask } } )
        {

            // could potentially not exist yet, so wrap in a try/catch
            try {
                // update me array's cache
                const { me } = cache.readQuery( { query: QUERY_ME } );
                cache.writeQuery( {
                    query: QUERY_ME,
                    data: { me: { ...me, tasks: [ ...me.tasks, addTask ] } },
                } );
            } catch( e ) {
                console.warn( "First task insertion by user!" )
            }

            // update task array's cache
            const { tasks } = cache.readQuery( { query: QUERY_TASKS } );
            cache.writeQuery( {
                query: QUERY_TASKS,
                data: { tasks: [ addTask, ...tasks ] },
            } );
        }
    } );

    // update state based on form input changes
    const handleChange = ( event ) =>
    {
        if( event.target.value.length <= 280 ) {
            setText( event.target.value );
            setCharacterCount( event.target.value.length );
        }
    };

    // submit form
    const handleFormSubmit = async ( event ) =>
    {
        event.preventDefault();

        try {
            await addTask( {
                variables: { taskText },
            } );

            // clear form value
            setText( '' );
            setCharacterCount( 0 );
        } catch( e ) {
            console.error( e );
        }
    };

    return (
        <div className='taskForm'>
            <p
                className={'characterCount'}
            >
                Character Count: {characterCount}/280
            </p>
            <form
                className="flex-row justify-center justify-space-between-md align-stretch"
                onSubmit={handleFormSubmit}
            >
                <textarea
                    placeholder="Here's a new task..."
                    value={taskText}
                    className="form-input"
                    onChange={handleChange}
                ></textarea>
                <button className="button" type="submit">
                    Submit
                </button>
                {error && <p className='errorText'>Something went wrong...</p>}
            </form>
        </div>
    );
};

export default TaskForm;
