import { defineConfig } from '@mikro-orm/core'
import { PostgreSqlDriver } from '@mikro-orm/postgresql'
import { Pokemon } from './entities/Pokemon.js'
import { User } from './entities/User.js'
import { UserFavorite } from './entities/UserFavorite.js'

export default defineConfig({
    driver: PostgreSqlDriver,
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5434'),
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    dbName: process.env.DB_NAME || 'pokemon_db',
    entities: [Pokemon, User, UserFavorite],
    migrations: {
        path: './dist/migrations',
        pathTs: './src/migrations',
    },
    seeder: {
        path: './dist/seeders',
        pathTs: './src/seeders',
        defaultSeeder: 'DatabaseSeeder',
    },
    debug: process.env.NODE_ENV !== 'production',
})
