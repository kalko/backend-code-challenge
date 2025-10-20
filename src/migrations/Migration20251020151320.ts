import { Migration } from '@mikro-orm/migrations'

export class Migration20251020151320 extends Migration {
    async up(): Promise<void> {
        this.addSql(`
      ALTER TABLE pokemon 
      ADD COLUMN resistant jsonb NOT NULL DEFAULT '[]',
      ADD COLUMN weaknesses jsonb NOT NULL DEFAULT '[]',
      ADD COLUMN evolutions jsonb DEFAULT NULL;
    `)

        this.addSql(`
      CREATE TABLE attack (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        type VARCHAR(255) NOT NULL,
        damage INTEGER NOT NULL,
        category VARCHAR(50) NOT NULL CHECK (category IN ('fast', 'special'))
      );
    `)

        this.addSql(`
      CREATE TABLE pokemon_attack (
        id SERIAL PRIMARY KEY,
        pokemon_id VARCHAR(255) NOT NULL REFERENCES pokemon(id) ON DELETE CASCADE,
        attack_id INTEGER NOT NULL REFERENCES attack(id) ON DELETE CASCADE,
        UNIQUE(pokemon_id, attack_id)
      );
    `)
    }

    async down(): Promise<void> {
        this.addSql(`DROP TABLE IF EXISTS pokemon_attack;`)
        this.addSql(`DROP TABLE IF EXISTS attack;`)
        this.addSql(`
      ALTER TABLE pokemon 
      DROP COLUMN IF EXISTS resistant,
      DROP COLUMN IF EXISTS weaknesses,
      DROP COLUMN IF EXISTS evolutions;
    `)
    }
}
