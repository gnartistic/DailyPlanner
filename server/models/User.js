// Import the necessary modules from the 'mongoose' and 'bcrypt' packages
const { Schema, model } = require( 'mongoose' );
const bcrypt = require( 'bcrypt' );

// Define the userSchema using the Schema constructor from mongoose
// The userSchema specifies the structure and rules for storing user data in the database
const userSchema = new Schema(
    {
        // Define the 'username' field with the type 'String'
        // This field is required (must be provided when creating a user)
        // It must be unique (no two users can have the same username)
        // Any leading or trailing spaces in the input will be removed (trimmed)
        username: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },

        // Define the 'email' field with the type 'String'
        // This field is required (must be provided when creating a user)
        // It must be unique (no two users can have the same email)
        // The input will be checked against the provided regular expression to ensure it matches an email address format
        email: {
            type: String,
            required: true,
            unique: true,
            match: [ /.+@.+\..+/, 'Must match an email address!' ]
        },

        // Define the 'password' field with the type 'String'
        // This field is required (must be provided when creating a user)
        // The minimum length of the password must be 8 characters
        password: {
            type: String,
            required: true,
            minlength: 8
        },

        // Define the 'tasks' field as an array of ObjectIds referencing the 'Task' model
        // This allows us to establish a relationship between the user and their tasks
        tasks: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Task'
            }
        ],
    },

    // The second argument to the Schema constructor specifies options for the schema
    // In this case, we set 'virtuals: true' to ensure that virtual properties are included when converting the schema to JSON
    {
        toJSON: {
            virtuals: true
        }
    }
);

// Set up pre-save middleware to hash the user's password before saving it to the database
// The 'pre' method allows us to perform an action before saving the document to the database
// In this case, we use it to hash the password using 'bcrypt' before storing it in the 'password' field
userSchema.pre( 'save', async function( next )
{
    // Check if the user is new or if the password has been modified
    if( this.isNew || this.isModified( 'password' ) ) {
        // Define the number of salt rounds used to generate the hash
        const saltRounds = 10;

        // Use 'bcrypt.hash' to hash the password with the specified number of salt rounds
        // The result of the hash operation is assigned to the 'password' field of the user document
        this.password = await bcrypt.hash( this.password, saltRounds );
    }

    // Call 'next()' to continue with the save operation after the hashing is done
    next();
} );

// Define a custom method 'isCorrectPassword' on the userSchema
// This method will be available on user documents retrieved from the database
// It compares the incoming password with the hashed password stored in the 'password' field
// The method returns a Promise that resolves to true if the passwords match, or false otherwise
userSchema.methods.isCorrectPassword = async function( password )
{
    return bcrypt.compare( password, this.password );
};

// Create a 'User' model using the userSchema
// The 'User' model is associated with the 'users' collection in the database
const User = model( 'User', userSchema );

// Export the 'User' model to make it available for use in other parts of the application
module.exports = User;
