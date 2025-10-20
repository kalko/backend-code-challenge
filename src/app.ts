import { MikroORM } from '@mikro-orm/core'
import fastify, { FastifyInstance } from 'fastify'
import { Pokemon } from './entities/Pokemon.js'
import config from './mikro-orm.config.js'

export const buildApp = async (): Promise<FastifyInstance> => {
    const app = fastify({
        logger: {
            level: process.env.LOG_LEVEL || 'info',
        },
    })

    const orm = await MikroORM.init(config)

    app.decorate('orm', orm)
    app.decorate('em', () => orm.em.fork())

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
            securityDefinitions: {
                Bearer: {
                    type: 'apiKey',
                    name: 'Authorization',
                    in: 'header',
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

    app.get('/health', async () => {
        return { status: 'ok', timestamp: new Date().toISOString() }
    })

    app.get('/pokemons', async (request) => {
        const em = (request.server as any).em()
        const pokemons = await em.find(Pokemon, {})
        return pokemons
    })

    return app
}
