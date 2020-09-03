import path from "path";
import { User } from "./entities/User";
import { MikroORM } from "@mikro-orm/core";

export default {
  migrations: {
    path: path.join(__dirname, "migrations"),
    pattern: /^[\w-]+\d+\.[tj]s$/,
  },
  type: "postgresql",
  user: "fattylee",
  password: "fattylee",
  port: 5433,
  debug: true,
  dbName: "fatreddit",
  entities: [User],
} as Parameters<typeof MikroORM.init>[0];
