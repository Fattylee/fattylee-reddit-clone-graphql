import { Entity, PrimaryKey, Property } from "@mikro-orm/core";
import { ObjectType, Field, ID } from "type-graphql";

@ObjectType({ description: "this na User model" })
@Entity()
export class User {
  @PrimaryKey()
  @Field((_) => ID, { description: "tis is my id field" })
  id!: number;

  @Field()
  @Property({ type: "text" })
  first_name: string;

  @Field()
  @Property({ type: "text" })
  last_name: string;

  @Property({ unique: true })
  @Field(() => String)
  email: string;

  @Property()
  createdAt = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt = new Date();
}
