const {
  GraphQLID,
  GraphQLList,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
  GraphQLNonNull,
} = require("graphql");

const { graphqlHTTP } = require("express-graphql");
const { GraphQLServer } = require("graphql-yoga");
const express = require("express");
const app = express();

const Query = new GraphQLObjectType({
  name: "QueryType",
  fields: () => ({
    hello: {
      type: GraphQLNonNull(GraphQLString),
      resolve() {
        return "hello, from graphql";
      },
    },
  }),
});

const schema = new GraphQLSchema({
  description: "this is my schema definition",
  query: Query,
});

// app.use("/yes", graphqlHTTP({ schema, graphiql: true }));
// const port = 4500;
// app.listen(port, console.log("Server up on port", port));

const main = async () => {
  const server = new GraphQLServer({ schema });
  server.start(
    { playground: "/yes", port: 4500 },
    ({ port, playground, getEndpoint }) => {
      console.log("Server running on port", port, playground, getEndpoint);
    }
  );
};

main();
