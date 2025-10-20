import '@fastify/jwt'
import 'fastify'
import { FastifyReply, FastifyRequest } from 'fastify'

declare module 'fastify' {
    interface FastifyInstance {
        authenticate: (request: FastifyRequest, reply: FastifyReply) => Promise<void>
    }
}

declare module '@fastify/jwt' {
    interface FastifyJWT {
        payload: { userId: string; username: string }
        user: { userId: string; username: string }
    }
}
