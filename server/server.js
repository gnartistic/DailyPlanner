// Import necessary modules and packages
const express = require( 'express' ); // Import the Express framework for handling HTTP requests and responses
const { ApolloServer } = require( 'apollo-server-express' ); // Import the Apollo Server to create a GraphQL server
const path = require( 'path' ); // Import the 'path' module to handle file paths

// Import local modules and configurations
const { typeDefs, resolvers } = require( './schemas' ); // Import the GraphQL type definitions and resolvers from local file
const { authMiddleware } = require( './utils/auth' ); // Import the authentication middleware from local file
const db = require( './config/connection' ); // Import the database connection from local file

// Set up the server's listening port (default to 3001 if no environment variable is provided)
const PORT = process.env.PORT || 3001;

// Create a new instance of Apollo Server with the GraphQL schema and authentication middleware
const server = new ApolloServer( {
    typeDefs,
    resolvers,
    context: authMiddleware, // Attach the authentication middleware to the server's context
} );

// Create a new Express application
const app = express();

// Parse incoming requests with URL-encoded and JSON data
app.use( express.urlencoded( { extended: false } ) );
app.use( express.json() );

// The next commented lines are for serving static assets when running in production.
// This would serve a React web application in the 'client/build' directory.
// However, they are currently disabled (commented out).

// if (process.env.NODE_ENV === 'production') {
//     app.use(express.static(path.join(__dirname, '../client/build')));
// }

// app.get('*', (req, res) => {
//     res.sendFile(path.join(__dirname, '../client/build/index.html'));
// });

// Asynchronously start the Apollo server
const startApolloServer = async ( typeDefs, resolvers ) =>
{
    await server.start(); // Start the Apollo server

    // Apply the Apollo server middleware to the Express app
    server.applyMiddleware( { app } );

    // When the database connection is open, start listening for incoming requests on the specified port
    db.once( 'open', () =>
    {
        app.listen( PORT, () =>
        {
            console.log( `API server running on port ${ PORT }!` );
            console.log( `Use GraphQL at http://localhost:${ PORT }${ server.graphqlPath }` );
        } );
    } );
};

// Call the async function to start the server with the defined type definitions and resolvers
startApolloServer( typeDefs, resolvers );
