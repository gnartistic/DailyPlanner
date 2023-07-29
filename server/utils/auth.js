// Import the 'jsonwebtoken' package to handle JSON Web Tokens (JWT)
const jwt = require( 'jsonwebtoken' );

// Define the secret key used to sign and verify JWTs
const secret = 'mysecretsshhhhh';

// Define the expiration time for JWTs (2 hours in this case)
const expiration = '2h';

// Export an object containing two functions as properties: 'authMiddleware' and 'signToken'
module.exports = {
    // 'authMiddleware' function to handle authentication middleware
    authMiddleware: function( { req } )
    {
        // Allow the token to be sent via req.body, req.query, or headers
        let token = req.body.token || req.query.token || req.headers.authorization;

        // Extract the actual token value from the 'Authorization' header if present
        if( req.headers.authorization ) {
            token = token.split( ' ' ).pop().trim();
        }

        // If no token is found, just return the 'req' object as is (no authentication)
        if( !token ) {
            return req;
        }

        try {
            // Verify the JWT using the secret key and extract the 'data' payload (username, email, _id)
            const { data } = jwt.verify( token, secret, { maxAge: expiration } );
            // Attach the extracted 'data' payload to the 'req' object as 'user' property for further use
            req.user = data;
        } catch {
            console.log( 'Invalid token' ); // Log an error message if the token is invalid or expired
        }

        // Return the 'req' object, either with attached 'user' property or as it was initially
        return req;
    },

    // 'signToken' function to create a new JWT with provided user information
    signToken: function( { username, email, _id } )
    {
        // Create a payload containing the user information (username, email, _id)
        const payload = { username, email, _id };

        // Sign the payload using the secret key to generate a new JWT with an expiration time
        // The resulting JWT can be used by the client for future authenticated requests
        return jwt.sign( { data: payload }, secret, { expiresIn: expiration } );
    },
};
