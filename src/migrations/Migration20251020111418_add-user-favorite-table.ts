import { Migration } from '@mikro-orm/migrations'

export class Migration20251020111418_addUserFavoriteTable extends Migration {
    async up(): Promise<void> {
        this.addSql(
            'create table "user_favorite" ("id" varchar(255) not null, "user_id" varchar(255) not null, "pokemon_id" varchar(255) not null, "created_at" timestamptz(0) not null, constraint "user_favorite_pkey" primary key ("id"));',
        )

        this.addSql(
            'alter table "user_favorite" add constraint "user_favorite_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade;',
        )
        this.addSql(
            'alter table "user_favorite" add constraint "user_favorite_pokemon_id_foreign" foreign key ("pokemon_id") references "pokemon" ("id") on update cascade;',
        )
    }

    async down(): Promise<void> {
        this.addSql('drop table if exists "user_favorite" cascade;')
    }
}
