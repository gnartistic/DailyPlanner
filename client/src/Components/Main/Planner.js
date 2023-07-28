import React, { useState, useEffect } from 'react';
import './index.scss'
import { useMutation } from '@apollo/client';
import { ADD_TASK } from '../../utils/mutations';
import { QUERY_TASKS, QUERY_ME } from '../../utils/queries';

const Planner = () =>
{
    const [ currentDate, setCurrentDate ] = useState( '' );
    const [ currentTime, setCurrentTime ] = useState( '' );
    const [ currentHour, setCurrentHour ] = useState( '' );

    var hour = new Date().getHours(); //Current Hours

    const setSuffix = () =>
    {
        if( hour > 23 ) {
            return 'AM'
        } else if( hour > 12 ) {
            return 'PM'
        } else if( hour < 1 ) {
            return 'AM'
        } else {
            return 'AM'
        }
    };

    var suffix = setSuffix();

    useEffect( () =>
    {
        var date = new Date().getDate(); //Current Date
        var month = new Date().getMonth() + 1; //Current Month
        var year = new Date().getFullYear(); //Current Year
        var hour = new Date().getHours(); //Current Hours
        var min = new Date().getMinutes(); //Current Minutes
        var sec = new Date().getSeconds();

        const minutesFormat = () =>
        {
            if( min < 10 ) {
                return '0' + min;
            } else if( min == 20 || min == 30 || min == 40 || min == 50 || min == 10 ) {
                return min;
            } else {
                return min;
            }
        }
        const hours12 = () =>
        {
            return ( hour + 24 ) % 12 || 12;
        }

        setCurrentDate(
            month + '/' + date + '/' + year
        );

        setCurrentTime(
            hours12( hour ) + ':' + minutesFormat( min ) + suffix
        )
        setCurrentHour(
            hours12( hour )
        )
    }, [ suffix, currentHour, currentTime ] );

    const hours = [ { id: 1, hour: '7', min: ':00AM' }, { id: 2, hour: '8', min: ':00AM' }, { id: 3, hour: '9', min: ':00AM' }, { id: 4, hour: '10', min: ':00AM' }, { id: 5, hour: '11', min: ':00AM' }, { id: 6, hour: '12', min: ':00PM' }, { id: 7, hour: '1', min: ':00PM' }, { id: 8, hour: '2', min: ':00PM' }, { id: 9, hour: '3', min: ':00PM' }, { id: 10, hour: '4', min: ':00PM' }, { id: 11, hour: '5', min: ':00PM' }, { id: 12, hour: '6', min: ':00PM' }, { id: 13, hour: '7', min: ':00PM' }, { id: 14, hour: '8', min: ':00PM' } ];

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

    const timeSlots = hours.map( ( hours ) =>

        <div key={hours.id}>
            <form className='timeSlots' onSubmit={handleFormSubmit}>
                <h3 className='time'>{hours.hour}{hours.min}</h3>
                <textarea style={{ backgroundColor: hours.hour == currentHour ? '#37537d' : '#1f3047' }} className='taskEdit'
                    placeholder="Nothing to do..."
                    value={taskText}
                    onChange={handleChange} />
                <button className='saveButton' type="submit">Save</button>
            </form>
        </div>
    );

    return (
        <>
            <div className='planner'>
                <h1 className='date'>{currentDate}</h1>
                <h2 className='currTime'>{currentTime}</h2>
                <div className='timeSlotContainer'>
                    {timeSlots}
                </div>
            </div >
        </>
    )
}

export default Planner