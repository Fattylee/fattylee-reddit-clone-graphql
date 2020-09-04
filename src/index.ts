import "reflect-metadata";
import {
  createConnection,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  EntityManager,
} from "typeorm";
import express, { Request, Response } from "express";
import { ApolloServer } from "apollo-server-express";
import {
  buildSchema,
  Field,
  ObjectType,
  Resolver,
  Query,
  Int,
  Mutation,
  Arg,
  InputType,
  Ctx,
} from "type-graphql";
import bcrypt from "bcryptjs";
import Redis from "ioredis";
import session from "express-session";
import connectRedis from "connect-redis";
import cors from "cors";

@Entity("users")
@ObjectType()
class User {
  @PrimaryGeneratedColumn()
  @Field(() => Int)
  id: number;

  @Column({ unique: true, type: "text" })
  @Field()
  email: string;

  @Column("text")
  password?: string;
}

@ObjectType()
class FieldError {
  @Field()
  field: string;
  @Field()
  message: string;
}

@ObjectType()
class UserResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];
  @Field(() => User, { nullable: true })
  user?: User;
}

@InputType()
class RegisterInput {
  @Field()
  email: string;
  @Field()
  password: string;
}

@Resolver()
class UserResolver {
  @Mutation(() => UserResponse)
  async login(
    // @Args() { email, password }: { email: string; password: string },
    @Arg("email") email: string,
    @Arg("password") password: string,
    @Ctx("cm") cm: EntityManager,
    @Ctx("req") req: Request
  ): Promise<UserResponse> {
    const user = await cm.findOne(User, { where: { email } });
    if (!user)
      return { errors: [{ field: "email", message: "email does not exist" }] };
    const valid = await bcrypt.compare(password, user.password!);
    if (!valid)
      return {
        errors: [{ field: "password", message: "invalid password, try again" }],
      };
    req.session!.userId = user.id;
    console.log(req.session);
    return {
      user,
    };
  }

  @Mutation(() => UserResponse)
  async register(
    @Arg("data") { password, email }: RegisterInput,
    // @Ctx("req") req: Request,
    @Ctx("cm") cm: EntityManager
    // @Ctx() res: { req: Request; cm: EntityManager }
  ): Promise<UserResponse> {
    const errors: { field: "email"; message: string }[] = [];
    if (email.length < 1)
      errors.push({ field: "email", message: "email cannot be empty" });
    if (!email.includes("@"))
      errors.push({ field: "email", message: "enter a valid email" });
    const hash = await bcrypt.hash(password, 12);
    const user = cm.create(User, { email, password: hash });
    if (errors.length) return { errors };
    try {
      await cm.save(user);
    } catch (error) {
      if (error.code === "23505") {
        errors.push({ field: "email", message: "email already taken" });
        return {
          errors,
        };
      }
    }
    return { user };
  }

  @Mutation(() => Boolean)
  logout(
    @Ctx("res") res: Response,
    @Ctx("req") req: Request
  ): Promise<boolean> {
    return new Promise((resolve, rej) => {
      return req.session!.destroy((err) => {
        if (err) return rej(false);
        res.clearCookie("qiq");
        return resolve(true);
      });
    });
  }

  @Query(() => User, { nullable: true })
  async me(
    @Ctx() { cm, req }: { req: Request; cm: EntityManager }
  ): Promise<User | undefined> {
    const id = req.session!.userId;
    if (!id) {
      return undefined;
    }
    return cm.findOne(User, { where: { id } });
  }
}

const bootstrap = async () => {
  const conn = await createConnection({
    name: "lax",
    type: "postgres",
    database: "soloreddit",
    username: "fattylee",
    password: "fattylee",
    entities: [User],
    port: 5433,
    synchronize: true,
    // dropSchema: true,
  });

  const data = await conn.manager.findAndCount(User, { where: {} });
  console.log(data);

  const RedisStore = connectRedis(session);
  const app = express();
  app.use(
    session({
      secret: "ksmqksmqismi",
      name: "qiq",
      resave: false, // not to save cookie always
      saveUninitialized: false, // set cookie when initialized only
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365 * 10, // 10 years expiration time
        sameSite: "lax", // prevent cxsf attack
        secure: app.get("env") === "production", //allow request from https in prod only
        httpOnly: true, // to prevent client-side js from accessing cookie
      },
      store: new RedisStore({ client: new Redis() }),
    })
  );
  // to restrict XMLHttpRequest to certatin domain
  app.use(cors({ credentials: true, origin: "http://localhost:3000/" }));

  const apolloServer = new ApolloServer({
    schema: await buildSchema({ resolvers: [UserResolver], validate: false }),
    context: ({ req, res }) => ({ req, res, cm: conn.manager }),
  });

  apolloServer.applyMiddleware({ app });
  const port = 4300;
  app.listen(port, () => console.log("Server up on port", port));
};

bootstrap().catch(console.error);
