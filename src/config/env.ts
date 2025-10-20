export const config = {
    server: {
        port: parseInt(process.env.PORT || '3333'),
        host: process.env.HOST || '0.0.0.0',
        logLevel: process.env.LOG_LEVEL || 'info',
    },
    jwt: {
        secret: process.env.JWT_SECRET || 'test',
    },
    database: {
        type: 'postgresql',
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '5434'),
        user: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASSWORD || 'postgres',
        dbName: process.env.DB_NAME || (process.env.NODE_ENV === 'test' ? 'pokemon_db_test' : 'pokemon_db'),
        entities: ['./dist/entities/**/*.js'],
        entitiesTs: ['./src/entities/**/*.ts'],
        migrations: {
            path: './dist/migrations',
            pathTs: './src/migrations',
        },
        seeder: {
            path: './dist/seeders',
            pathTs: './src/seeders',
            defaultSeeder: 'DatabaseSeeder',
        },
    } as any,
    swagger: {
        host: process.env.SWAGGER_HOST || 'localhost:3333',
    },
} as const
