import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
} from "typeorm";
import { Profile } from "./Profile";
import { ObjectType, Field } from "type-graphql";

@Entity("users")
@ObjectType()
export class User extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column({ name: "first_name" })
  fn: string;

  @Field()
  @Column({ name: "last_name" })
  ln: string;

  @Field()
  @Column({ name: "createdAt", default: new Date(), type: "timestamp" })
  d: Date;

  @Field()
  @Column({ nullable: true, default: "nana" })
  desc: string;

  @OneToOne(() => Profile, (profile) => profile.author)
  mama: Profile;
}
