import { Migration } from '@mikro-orm/migrations';

export class Migration20200824142636 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "user" ("id" serial primary key, "first_name" text not null, "last_name" text not null, "email" varchar(255) not null, "updated_at" timestamptz(0) not null, "created_at" timestamptz(0) not null);');
    this.addSql('alter table "user" add constraint "user_email_unique" unique ("email");');
  }

}
