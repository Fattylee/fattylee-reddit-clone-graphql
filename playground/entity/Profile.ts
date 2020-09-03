import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from "typeorm";
import { User } from "./User";

@Entity("profiles")
export class Profile {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column("int2")
  age: number;

  @OneToOne(() => User, (user) => user.mama)
  @JoinColumn()
  author: User;
}
