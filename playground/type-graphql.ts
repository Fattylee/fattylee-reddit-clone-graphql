import "reflect-metadata";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import {
  buildSchema,
  Field,
  Resolver,
  Query,
  ObjectType,
  Root,
  Int,
  Mutation,
  Arg,
  InputType,
  ID,
  formatArgumentValidationError,
} from "type-graphql";
import { Min } from "class-validator";
// import { buildSchema } from "graphql";

const app = express();

@ObjectType()
class User {
  @Field(() => Int, { nullable: true })
  id: number = 89;

  @Field(() => Int, { name: "super" })
  infered(@Root() parent: User) {
    return parent.id + 10;
  }
}

@ObjectType()
class Post {
  @Field(() => ID)
  id: number;

  @Field()
  title: string;

  @Field()
  description: string;

  @Field(() => User)
  author: User;
}

@InputType()
class UserInput {
  @Field()
  @Min(5)
  firstName: string;

  @Field()
  lastName: string;
}

@Resolver()
class HelloResolver {
  // @Field({ defaultValue: "cool" })
  @Query(() => String, {
    name: "seeMe",
    // defaultValue: "zerooo",
    description: "this is so, so that none can complain",
    // nullable: true,
    // deprecationReason: "out of use",
  })
  hello() {
    return true;
  }

  @Query(() => User)
  user() {
    return { id: 90 };
  }

  @Mutation(() => User)
  createUser(@Arg("data") data: UserInput) {
    console.log(data);
    return { id: 23 };
  }
}

@Resolver()
class PostReslver {
  @Mutation(() => Post)
  createPost() {
    return {
      id: "122js",
      title: "title one",
      description: "discription one",
      author: {
        id: 23,
        // super: 29,
      },
    };
  }
}

const bootstrap = async () => {
  const schema = await buildSchema({
    // nullableByDefault: true,
    resolvers: [HelloResolver, PostReslver],
    // validate: false,
  });
  const apolloServer = new ApolloServer({
    schema,
    formatError: formatArgumentValidationError,
  });
  apolloServer.setGraphQLPath("/look");
  apolloServer.applyMiddleware({ app });
  const port = 5500;
  app.listen(port, () => {
    console.log("Server is up on port", port);
  });
};

bootstrap().catch(console.error);
