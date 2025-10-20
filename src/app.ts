import fastify, { FastifyInstance } from 'fastify'
import { databasePlugin } from './plugins/database.js'
import { jwtPlugin } from './plugins/jwt.js'
// import { swaggerPlugin } from './plugins/swagger.js'
import fastifySwagger from '@fastify/swagger'
import fastifySwaggerUi from '@fastify/swagger-ui'
import { authRoutes } from './routes/auth.js'
import { favoritesRoutes } from './routes/favorites.js'
import { pokemonRoutes } from './routes/pokemon.js'

export const buildApp = async (): Promise<FastifyInstance> => {
    const app = fastify({
        logger: {
            level: process.env.LOG_LEVEL || 'info',
        },
    })

    // Register plugins
    await app.register(databasePlugin)
    await app.register(jwtPlugin)

    // await app.register(swaggerPlugin)

    await app.register(fastifySwagger, {
        swagger: {
            info: {
                title: 'Pokemon API',
                description: 'REST API for Pokemons',
                version: '1.0.0',
            },
            host: 'localhost:3333',
            schemes: ['http'],
            consumes: ['application/json'],
            produces: ['application/json'],
            securityDefinitions: {
                Bearer: {
                    type: 'apiKey',
                    name: 'Authorization',
                    in: 'header',
                    description: 'Enter your Bearer token in the format: Bearer <token>',
                },
            },
        },
    })

    await app.register(fastifySwaggerUi, {
        routePrefix: '/docs',
        uiConfig: {
            docExpansion: 'list',
            deepLinking: false,
        },
    })

    app.get('/health', async () => {
        return { status: 'ok', timestamp: new Date().toISOString() }
    })

    // Register routes
    await app.register(pokemonRoutes)
    await app.register(authRoutes)
    await app.register(favoritesRoutes)

    return app
}
