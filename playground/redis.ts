import "reflect-metadata";
// const { createClient } = require("ioredis");
// const Redis = require("ioredis");
// const client = createClient();
import { createConnection, getRepository } from "typeorm";
import { User } from "./entity/User";
import { Profile } from "./entity/Profile";
import { A } from "./A";
import { B } from "./B";
import _redis from "ioredis";
import express from "express";
import session from "express-session";
import connectRedis from "connect-redis";
import { v4 } from "uuid";
import { gql, ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
// import { qgl } from "graphql";
import { Misc } from "./resolvers/Misc";
import { UserResolver } from "./resolvers/UserResolver";

const typeDefs = gql`
  type Post {
    name: String
  }
  type User {
    email: String
  }
  type Query {
    sort: String!
    merge: Result
  }
  union Result = User | Post
`;
const resolvers = {
  Result: {
    __resolveType(
      obj: { name: String; email: String },
      _context: any,
      _info: any
    ) {
      if (obj.name) return "Post";
      if (obj.email) return "User";
      return null;
    },
  },
  Query: {
    sort() {
      return "Abu sort";
    },
    merge() {
      return {
        name: "aba",
        email: "ans",
      };
    },
  },
};

// client.on("connect", (res) => {
//   console.log("connected", res);
// });
// client.set("name", "fattylee", (err, reply) => {
//   console.log(err, reply);
// });
// client.set("name", "lax", (err, reply) => {
//   console.log(err, reply);
// });

// client.get("name", (err, reply) => {
//   console.log(err, reply);
// });
// client.get("ame", print);
// console.log("last line!!!!");

// const client2 = new Redis();
// client2.get("name", (err, res) => {
//   console.log("=====", err, res);
// });

const main = async () => {
  const app = express();

  // app.use(
  //   session({
  //     resave: false,
  //     secret: "abu lulu",
  //     name: "lulu-quik",
  //     saveUninitialized: false,
  //     cookie: {
  //       maxAge: 10000,
  //     },
  //   })
  // );

  // Use the session middleware
  const RedisStore = connectRedis(session);
  // const redis= new RedisStore()
  const redis = new _redis();
  app.use(
    session({
      store: new RedisStore({ client: redis }),
      name: "human",
      secret: "keyboard cat",
      cookie: { maxAge: 6000 },
      resave: false,
      saveUninitialized: false,
    })
  );

  // Access the session as req.session
  app.get("/login", (req, res) => {
    console.log(req.session);
    console.log("=".repeat(20) + " path /login before " + "=".repeat(20));
    const userId = v4();
    req.session!.userId = userId;
    console.log(req.session);
    console.log("=".repeat(20) + " path /login after " + "=".repeat(20));
    res.send(`new userId set: ${userId}`);
  });

  app.get("/", function (req, res) {
    req.session!.cookie.maxAge = 1000 * 60; //60s
    console.log(req.session);
    console.log("=".repeat(20) + " path / " + "=".repeat(20));
    if (req.session!.views) {
      req.session!.views++;
      res.setHeader("Content-Type", "text/html");
      res.write("<p>views: " + req.session!.views + "</p>");
      res.write(
        "<p>expires in: " + req.session!.cookie.maxAge! / 1000 + "s</p>"
      );
      res.write(
        `<h3>this is the new expired time: ${
          req.session!.cookie.maxAge / 1000
        }'s</h3>`
      );
      res.end();
    } else {
      req.session!.views = 1;
      res.end("welcome to the session demo. refresh!");
    }
  });

  app.use("/", (_req, _res, next) => {
    // console.log("nice request");
    // console.log(_req.session);
    next();
  });

  app.get("/baba", (req, res) => {
    console.log(req.session);
    res.send("hello world");
  });

  app.get("/register", (_, res) => {
    console.log("mumu name");
    res.send("register user");
  });

  const apolloServer = new ApolloServer({
    context: ({ req }) => ({ req }),
    typeDefs,
    resolvers,
    // schema: [Animal, Cat],
    // schema: await buildSchema({ resolvers: [UserResolver, Misc] }),
  });

  apolloServer.applyMiddleware({ app });
  const port = 3200;

  app.listen(port, () => console.log(`Server up on port ${port}`));
  // const res = await redis.set("name", "myvalue", "ex", 1 * 20);
  const myName = await redis.get("name");
  console.log(myName);
  // console.log(res);

  const cn = await createConnection({
    type: "postgres",
    port: 5433,
    password: "fattylee",
    database: "typeorm",
    entities: [User, Profile, A, B],
    // logging: true,
    synchronize: true,
    // dropSchema: true,
  });

  // const newA = A.create([
  //   { them: "one" },
  //   { them: "two" },
  //   { them: "them three" },
  // ]);

  // const newB = B.create({ name: "second name", forA: await A.findOne(1) });
  // // const savedB = await newB.save();
  // // console.log(savedB);
  // const bb = await B.findAndCount({ relations: ["few"] });
  // const aas = A.create([{ name: "a 1" }, { name: "1a 2" }]);
  // await A.save(aas);
  // const bbs = B.create([{ name: "mine", lots: aas }, { name: "b 2" }]);
  // await B.save(bbs);

  // const [, , ...lastTwo] = await A.find();

  // const bb = await B.find({ relations: ["lots"] });
  // bb[3].lots = lastTwo;
  // await B.save(bb);
  // console.log(JSON.stringify(bb, null, 1));
  // console.log(JSON.stringify(lastTwo, null, 1));

  // const saved = await A.save(newA);
  // console.log(saved);
  // const aa = await A.findAndCount({ relations: ["list"] });
  // console.log(JSON.stringify(aa, null, 1));

  // const userRepository = cn.manager.getRepository(User);
  // const userRepository = getRepository(User);
  // const profileRepository = getRepository(Profile);

  // const user = await User.create({ fn: "next", ln: "lax" }).save();
  // const user = await userRepository.delete({ ln: "lax" });
  // const user = await cn.manager.create(User, { fn: "bob", ln: "mar" }).save();
  // const user = await cn.manager.create(User, { fn: "sweep", ln: "mar" });
  // await cn.manager.save(user);
  // await user.save();
  // const user = await userRepository.update({ ln: "mar" }, { ln: "war" });
  // const user = await userRepository.findOne(2, { order: { id: -1 } });
  // console.log(user);

  // const userNew = await userRepository
  //   .create({
  //     fn: "pank",
  //     ln: "creep",
  //     desc: "pang",
  //   })
  //   .save();
  // console.log(userNew);

  // const user = await userRepository.findOne(4);
  // console.log(user);
  // const profile = await profileRepository.create({ age: 11, user });
  // await profileRepository.save(profile);
  //   const users = await userRepository.find({
  //     // order: { ln: 1 },
  //     where: { desc: "deep" },
  //     relations: ["mama"],
  //   });

  //   const profiles = await profileRepository.find({ relations: ["author"] });

  //   console.log(profiles);
  //   console.table(users);
  //   console.log(users);
};

main().catch((err) => {
  console.log("Error:", err);
});
