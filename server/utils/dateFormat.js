// Function to add appropriate suffix to the date (e.g., 'st', 'nd', 'rd', 'th')
const addDateSuffix = ( date ) =>
{
    let dateStr = date.toString();

    // Get the last character of the date string
    const lastChar = dateStr.charAt( dateStr.length - 1 );

    // Add the appropriate suffix based on the last character of the date
    if( lastChar === '1' && dateStr !== '11' ) {
        dateStr = `${ dateStr }st`;
    } else if( lastChar === '2' && dateStr !== '12' ) {
        dateStr = `${ dateStr }nd`;
    } else if( lastChar === '3' && dateStr !== '13' ) {
        dateStr = `${ dateStr }rd`;
    } else {
        dateStr = `${ dateStr }th`;
    }

    return dateStr;
};

// Function to format a timestamp into a human-readable date string
module.exports = (
    timestamp,
    { monthLength = 'short', dateSuffix = true } = {}
) =>
{
    // Create an object to map month numbers to month names
    const months = {
        0: monthLength === 'short' ? 'Jan' : 'January',
        1: monthLength === 'short' ? 'Feb' : 'February',
        // ... (continue defining all months)
    };

    // Create a new Date object from the provided timestamp
    const dateObj = new Date( timestamp );

    // Get the formatted month name based on the month number from the date object
    const formattedMonth = months[ dateObj.getMonth() ];

    // Get the day of the month and optionally add a suffix using the 'addDateSuffix' function
    const dayOfMonth = dateSuffix ? addDateSuffix( dateObj.getDate() ) : dateObj.getDate();

    // Get the year from the date object
    const year = dateObj.getFullYear();

    // Get the hour from the date object and convert it to 12-hour format
    let hour = dateObj.getHours() > 12 ? Math.floor( dateObj.getHours() - 12 ) : dateObj.getHours();

    // If the hour is 0 (12:00 am), change it to 12
    if( hour === 0 ) {
        hour = 12;
    }

    // Get the minutes from the date object and format it with leading zero if necessary
    const minutes = ( dateObj.getMinutes() < 10 ? '0' : '' ) + dateObj.getMinutes();

    // Set 'am' or 'pm' based on the hour of the date object
    const periodOfDay = dateObj.getHours() >= 12 ? 'pm' : 'am';

    // Create the final formatted timestamp string
    const formattedTimeStamp = `${ formattedMonth } ${ dayOfMonth }, ${ year } at ${ hour }:${ minutes } ${ periodOfDay }`;

    return formattedTimeStamp;
};
