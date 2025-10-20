import fastifyJwt from '@fastify/jwt'
import fastifySwagger from '@fastify/swagger'
import fastifySwaggerUi from '@fastify/swagger-ui'
import { MikroORM } from '@mikro-orm/core'
import fastify, { FastifyInstance, FastifyRequest } from 'fastify'
import { Pokemon } from './entities/Pokemon.js'
import { User } from './entities/User.js'
import config from './mikro-orm.config.js'
import { loginSchema } from './schemas/auth.schema.js'

export const buildApp = async (): Promise<FastifyInstance> => {
    const app = fastify({
        logger: {
            level: process.env.LOG_LEVEL || 'info',
        },
    })

    const orm = await MikroORM.init(config)

    app.decorate('orm', orm)
    app.decorate('em', () => orm.em.fork())

    // add JWT capabilities
    await app.register(fastifyJwt, {
        secret: process.env.JWT_SECRET || 'random-secret-key',
    })

    // add authenticate method
    app.decorate('authenticate', async (request: FastifyRequest, reply: any) => {
        try {
            await request.jwtVerify()
        } catch (err) {
            throw { statusCode: 401, message: 'Unauthorized' }
        }
    })

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

    app.get('/pokemons', async (request) => {
        const em = (request.server as any).em()
        const pokemons = await em.find(Pokemon, {})
        return pokemons
    })

    // Login route to get JWT token
    app.post('/auth/login', { schema: loginSchema }, async (request, reply: any) => {
        const { userId } = request.body as { userId: string }

        const em = (request.server as any).em()
        let user = await em.findOne(User, { id: userId })

        // Create user if doesn't exist
        if (!user) {
            user = em.create(User, {
                id: userId,
                username: `user_${userId}`,
                email: `user_${userId}@example.com`,
            })
            await em.flush()
        }

        const token = app.jwt.sign({ userId: user.id, username: user.username })
        return { token, user: { id: user.id, username: user.username } }
    })

    // Protected route test
    app.get(
        '/protected/pokemons',
        {
            schema: {
                tags: ['Pokemon'],
                summary: 'Get all Pokemon (protected route)',
                description: 'Requires authentication token',
                security: [{ Bearer: [] }],
                response: {
                    200: {
                        type: 'array',
                        items: {
                            type: 'object',
                            properties: {
                                id: { type: 'string' },
                                name: { type: 'string' },
                                classification: { type: 'string' },
                            },
                        },
                    },
                    401: {
                        type: 'object',
                        properties: {
                            message: { type: 'string' },
                        },
                    },
                },
            },
            preHandler: app.authenticate,
        },
        async (request) => {
            const em = (request.server as any).em()
            const pokemons = await em.find(Pokemon, {})
            return pokemons
        },
    )

    return app
}
