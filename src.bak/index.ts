import "reflect-metadata";
import { MikroORM } from "@mikro-orm/core";
import mikroConfig from "./mikro-orm.config";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { HelloResolver } from "./resolvers/hello";

const app = express();
const main = async () => {
  const orm = await MikroORM.init(mikroConfig);
  await orm.getMigrator().up();

  // const user = orm.em.create(User, {
  //   first_name: "abdillah",
  //   last_name: "abdulfattah",
  //   email: "abdullah@fatty",
  // });

  // await orm.em.persistAndFlush(user);
  // console.log(user);
  // console.log(orm.em);
  // const u = await orm.em.find(User, {});
  // console.log(u);

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver],
      validate: false,
    }),
    context: () => ({
      // em: orm.em,
    }),
  });
  apolloServer.applyMiddleware({ app });
  const port = 4500;
  app.listen(port, () => {
    console.log("Server is up on", port);
  });
};

main().catch(console.error);
