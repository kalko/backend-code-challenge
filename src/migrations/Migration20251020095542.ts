import { Migration } from '@mikro-orm/migrations'

export class Migration20251020095542 extends Migration {
    async up(): Promise<void> {
        this.addSql(
            'create table "pokemon" ("id" varchar(255) not null, "name" varchar(255) not null, "classification" varchar(255) not null, "weight_minimum" varchar(255) not null, "weight_maximum" varchar(255) not null, "height_minimum" varchar(255) not null, "height_maximum" varchar(255) not null, "flee_rate" int not null, "evolution_requirement_name" varchar(255) null, "evolution_requirement_amount" int null, "max_cp" int not null, "max_hp" int not null, constraint "pokemon_pkey" primary key ("id"))',
        )
    }
}
