import { MikroORM } from "@mikro-orm/core";

const orm = MikroORM.init({
  type: "postgresql",
  user: "fattylee",
  password: "fattylee",
  debug: true,
  dbName: "fatreddit",
  // entities:
});
