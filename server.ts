import "reflect-metadata";
import express from "express";
import { /*gql,*/ ApolloServer } from "apollo-server-express";
import { buildSchema, Resolver, Query } from "type-graphql";
const app = express();

// const typeDefs = gql`
//   type Query {
//     hello: String!
//   }
// `;

// const resolvers = {
//   Query: {
//     hello() {
//       return `Hello, world`;
//     },
//   },
// };

@Resolver()
class HelloResolver {
  @Query(() => String, { nullable: true })
  hello() {
    return "Nice to have here!";
  }
}

const main = async () => {
  const apolloServer = new ApolloServer({
    schema: await buildSchema({ validate: false, resolvers: [HelloResolver] }),
  });

  apolloServer.applyMiddleware({ app });
  app.listen(3200, () => {
    console.log("Server up on 3200");
  });
};

main().catch(console.error);
