import "reflect-metadata";
import {
  createConnection,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  EntityManager,
} from "typeorm";
import express, { Request } from "express";
import { ApolloServer, UserInputError } from "apollo-server-express";
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

  @Query(() => UserResponse)
  me(): Promise<UserResponse> {
    return Promise.resolve({
      user: {
        id: 12,
        email: "abs",
        password: "njnjbh",
      },
    });
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

  const newUser = conn.manager.create(User, { email: "abc", password: "lup" });
  const data = await conn.manager.findAndCount(User, { where: {} });
  console.log(data);

  const app = express();
  const apolloServer = new ApolloServer({
    schema: await buildSchema({ resolvers: [UserResolver], validate: false }),
    context: ({ req }) => ({ req, cm: conn.manager }),
  });

  apolloServer.applyMiddleware({ app });
  const port = 4300;
  app.listen(port, () => console.log("Server up on port", port));
};

bootstrap().catch(console.error);
