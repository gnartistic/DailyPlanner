import React, { useState, useEffect } from 'react';
import './index.scss'

const Planner = () =>
{
    const [ currentDate, setCurrentDate ] = useState( '' );
    const [ currentTime, setCurrentTime ] = useState( '' );

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
            return 'PM'
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

        const formatMilitaryTime = () =>
        {

            if( hour > 23 ) { //if over 24 hours reset back to morning
                if( hour == 24 ) {//if midnight make it 12am
                    hour = 12;
                } else { //after midnight is morning so subtract 24
                    hour -= 24;
                }
            } else if( hour > 11 ) { //anything over noon subtract 12 to get back to normal format
                if( hour == 12 ) { //if 12 make it 12pm
                    hour = 12;
                } else { //anything after 12 just subtract 12 to get to normal single digits
                    hour -= 12;
                }
            } else if( hour < 1 ) { //if its below 1 it would be night time
                if( hour == 0 ) { //0 hour is 12am so set it
                    hour = 12;
                } else { //anything else is pm of previous night so add 12 cause negative and add pm
                    hour += 12;
                }
            }

            return hour
        }

        setCurrentDate(
            month + '/' + date + '/' + year
        );

        setCurrentTime(
            formatMilitaryTime( hour ) + ':' + min + suffix
        )
    }, [] );

        const dayHours = [ '6:00am', '6:30am', '7:00am', '7:30am', '8:00am', '8:30am', '9:00am', '9:30am', '10:00am', '10:30am', '11:00am', '11:30am', '12:00pm', '12:30pm', '1:00pm', '1:30pm', '2:00pm', '2:30pm', '3:00pm', '3:30pm', '4:00pm', '4:30pm', '5:00pm', '5:30pm', '6:00pm', '6:30pm', '7:00pm', '7:30pm', '8:00pm', '8:30pm' ];

        const timeSlots = dayHours.map( ( hours ) =>
        
            <div className='timeSlots'>
                <h3 className='time'>{hours}</h3>
                <textarea className='taskEdit' />
                <button className='saveButton'>Save</button>
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