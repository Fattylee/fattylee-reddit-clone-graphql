import { Resolver, Query, Arg, Int } from "type-graphql";
import { User } from "src/entities/User";

@Resolver()
export class HelloResolver {
  @Query(() => String, { nullable: true })
  hello(): null | string {
    // return 21;
    // return null;
    return "helloooooooooooooooooo, world";
  }

  @Query(() => Int)
  abu(
    @Arg("id", () => Int) num1: number,
    @Arg("bab", () => Int) num2: number
  ): number {
    return num1 + num2;
  }

  @Query(() => User, { nullable: true })
  users() {
    return null;
  }
}
