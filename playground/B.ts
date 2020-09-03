import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  BaseEntity,
  ManyToMany,
} from "typeorm";
import { A } from "./A";

@Entity()
export class B extends BaseEntity {
  @PrimaryGeneratedColumn() id: number;

  @Column() name: string;
  // @Column() name: string;
  // @ManyToOne(() => A, (a) => a.list)
  // forA: A;

  @ManyToMany(() => A, (a) => a.few)
  lots: A[];
}
