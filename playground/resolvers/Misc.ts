import { Resolver, Query } from "type-graphql";
import { Cat } from "../entity/Cat";

@Resolver()
export class Misc {
  @Query(() => Cat, { nullable: true })
  fixMe(): Cat | null {
    return {
      id: 21,
      age: 123,
      name: "lost",
      // sum: 50,
    };
  }
}
