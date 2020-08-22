import { Entity, PrimaryKey, Property } from "@mikro-orm/core";

@Entity()
export class User {
  @PrimaryKey()
  id!: number;

  @Property({ type: "text" })
  first_name: string;

  @Property({ type: "text" })
  last_name: string;

  @Property({ unique: true })
  email: string;

  @Property({ onUpdate: () => new Date() })
  updatedAt: string;

  @Property()
  created_at = new Date();
}
