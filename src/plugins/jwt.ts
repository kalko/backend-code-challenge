import fastifyJwt from '@fastify/jwt'
import { FastifyInstance } from 'fastify'
import fp from 'fastify-plugin'
import { config } from '../config/env.js'

const jwtPluginFn = async (app: FastifyInstance) => {
    await app.register(fastifyJwt, {
        secret: config.jwt.secret,
    })

    app.decorate('authenticate', async function (request: any, reply: any) {
        try {
            await request.jwtVerify()
        } catch (err) {
            throw { statusCode: 401, message: 'Unauthorized' }
        }
    })
}

export const jwtPlugin = fp(jwtPluginFn)
