import { Field, ID, ObjectType } from "type-graphql";

@ObjectType()
export class Animal {
  @Field(() => ID)
  id: number;
}
