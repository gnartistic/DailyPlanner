// Import the 'mongoose' library for working with MongoDB
const mongoose = require( 'mongoose' );

// Connect to the MongoDB database using the provided URI, or fallback to a local URI if not provided
mongoose.connect(
    process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/focus-list',
    {
        // Specify options for the MongoDB connection
        useNewUrlParser: true,        // Use the new URL parser
        useUnifiedTopology: true,     // Use the new unified topology engine
    }
);

// Export the database connection to be used in other parts of the application
module.exports = mongoose.connection;
