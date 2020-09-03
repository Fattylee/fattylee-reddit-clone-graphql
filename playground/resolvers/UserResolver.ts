import { Query, Resolver, Mutation, Arg, InputType, Field } from "type-graphql";
import { User } from "../entity/User";

@InputType()
class NewUserInput {
  @Field()
  fn: string;
  @Field()
  ln: string;
  @Field((_) => String, { name: "description" })
  desc: string;
}

@Resolver()
export class UserResolver {
  @Query(() => [User], { nullable: true })
  async me(): Promise<User[] | null> {
    // const users = await User.find();
    return User.find();
  }

  @Mutation(() => User)
  newUser(@Arg("data") data: NewUserInput) {
    const newUser = User.create({ ...data, desc: data.desc });
    return newUser.save();
  }
}
