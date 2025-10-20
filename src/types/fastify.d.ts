import '@fastify/jwt'
import { EntityManager, MikroORM } from '@mikro-orm/core'

declare module 'fastify' {
    interface FastifyInstance {
        orm: MikroORM
        em: () => EntityManager
    }
}

declare module '@fastify/jwt' {
    interface FastifyJWT {
        payload: {
            userId: string
            username: string
        }
        user: {
            userId: string
            username: string
        }
    }
}
