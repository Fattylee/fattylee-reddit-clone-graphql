const { GraphQLServer } = require("graphql-yoga");

const typeDefs = `
   type Query {
     "next world"
    hello:String!
    user(id:ID):User
  
    "user is a kind of butt in d ass!"
    users(data:UserInputType):[User!]!
  }

  type User {
    id:ID!
    firstName:String!
    lastName:String!
    age:Int
  }

  input UserInputType {
    id:ID!
    name:String
    age:Int
  }

`;

const resolvers = {
  Query: {
    hello() {
      return "Hello, world";
    },
    user() {
      return {
        id: "288",
        firstName: "ndjwnj",
        lastName: "next",
        // age: 12,
        bab: 23,
      };
    },
    users() {
      return [
        {
          id: "288",
          firstName: "ndjwnj",
          lastName: "next",
          age: 12,
          bab: 23,
        },
      ];
    },
  },
};

const main = async () => {
  const server = new GraphQLServer({ resolvers, typeDefs });
  server.start(
    { playground: "/yes", port: 4500 },
    ({ port, playground, getEndpoint }) => {
      console.log("Server running on port", port, playground, getEndpoint);
    }
  );
};

main();
