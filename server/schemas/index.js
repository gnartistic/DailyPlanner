// Import the GraphQL type definitions from a local file './typeDefs'
const typeDefs = require('./typeDefs');

// Import the GraphQL resolvers from a local file './resolvers'
const resolvers = require('./resolvers');

// Export an object containing the imported type definitions and resolvers
module.exports = {
  typeDefs, // The GraphQL type definitions that define the schema for the API
  resolvers, // The functions that resolve GraphQL queries and mutations to return data
};
