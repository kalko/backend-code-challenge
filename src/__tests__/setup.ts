import { MikroORM } from '@mikro-orm/core'
import { config } from '../config/env.js'
import { DatabaseSeeder } from '../seeders/DatabaseSeeder.js'

let orm: MikroORM | null = null
let isSeeded = false

export const setupDatabase = async () => {
    if (isSeeded) return

    console.log('Setting up test database...')

    // Initialize ORM for test database
    orm = await MikroORM.init(config.database)

    // Drop and recreate schema (this creates all tables from entities)
    const generator = orm.getSchemaGenerator()
    await generator.dropSchema()
    await generator.createSchema()
    console.log('Schema created')

    // Seed database directly
    const seeder = new DatabaseSeeder()
    await seeder.run(orm.em.fork())
    console.log('Database seeded')

    isSeeded = true
}

export const teardownDatabase = async () => {
    if (orm) {
        await orm.close(true)
        orm = null
        isSeeded = false
    }
}
