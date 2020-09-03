import { ObjectType, Field } from "type-graphql";

@ObjectType()
export class Pet {
  @Field() petName: string;
}
