import { FastifyInstance } from 'fastify'

export const swaggerPlugin = async (app: FastifyInstance) => {
    await app.register(require('@fastify/swagger'), {
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
            tags: [
                { name: 'Health', description: 'Health check endpoints' },
                { name: 'Authentication', description: 'Authentication endpoints' },
                { name: 'Pokemons', description: 'Pokemon endpoints' },
                { name: 'Favorites', description: 'User favorites endpoints' },
            ],
            securityDefinitions: {
                Bearer: {
                    type: 'apiKey',
                    name: 'Authorization',
                    in: 'header',
                    description: 'Format: Bearer <token>',
                },
            },
        },
    })

    await app.register(require('@fastify/swagger-ui'), {
        routePrefix: '/docs',
        uiConfig: {
            docExpansion: 'list',
            deepLinking: false,
        },
    })
}
