import { Migration } from '@mikro-orm/migrations'

export class Migration20251020142132_addTypesToPokemon extends Migration {
    async up(): Promise<void> {
        this.addSql('alter table "pokemon" add column "types" jsonb not null default \'[]\'::jsonb;')
    }

    async down(): Promise<void> {
        this.addSql('alter table "pokemon" drop column "types";')
    }
}
