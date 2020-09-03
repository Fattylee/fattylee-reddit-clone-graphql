import { Int, ObjectType, Field, Root } from "type-graphql";
import { Animal } from "./Animal";
import { Pet } from "./Pet";

@ObjectType()
export class Cat extends Animal {
  @Field({ nullable: true }) name?: string;

  @Field(() => Int) age: number;

  @Field(() => String, { nullable: true })
  append?(@Root() parent: Cat): string | null {
    console.log(parent, "=".repeat(100));
    return `${parent.name} -- append`;
  }

  @Field(() => Int, { nullable: true })
  sum?(): number | null {
    return this.id + 20;
  }
}
