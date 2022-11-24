const express = require('express');
// import ApolloServer
const { ApolloServer } = require('apollo-server-express');

// import the typeDefs and resolvers
const { typeDefs, resolvers } = require('./schemas');
const db = require('./config/connection');

// const path = require('path');

// const routes = require('./routes');

const PORT = process.env.PORT || 3001;
// create a new Apollo server and pass in the schema data
const server = new ApolloServer({
  typeDefs,
  resolvers
});

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Create a new instance of an Apollo server with the GraphQL schema
const startApolloServer = async (typeDefs, resolvers) => {
await server.start();
// integrate the Apollo server with the Express application as middleware
server.applyMiddleware({ app });

db.once('open', () => {
    app.listen(PORT, () => {
      console.log(`🌍 API server running on port ${PORT}`);
      // log where we can go to test our GQL API
      console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`);
    })
  })  
};

// Call the async function to start the server
startApolloServer(typeDefs, resolvers);

// if we're in production, serve client/build as static assets
// if (process.env.NODE_ENV === 'production') {
//   app.use(express.static(path.join(__dirname, '../client/build')));
// }

// app.use(routes);