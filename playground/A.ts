import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  JoinTable,
  ManyToMany,
} from "typeorm";
import { B } from "./B";

@Entity()
export class A extends BaseEntity {
  @PrimaryGeneratedColumn() id: number;

  @Column() name: string;
  // @Column() them: string;
  // @OneToMany(() => B, (b) => b.forA)
  // list: B[];

  @ManyToMany(() => B, (b) => b.lots)
  @JoinTable()
  few: B[];
}
