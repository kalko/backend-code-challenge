import { MikroORM } from '@mikro-orm/core'
import { FastifyInstance } from 'fastify'
import fp from 'fastify-plugin'
import { config } from '../config/env.js'

const databasePluginFn = async (app: FastifyInstance) => {
    const orm = await MikroORM.init(config.database)

    app.decorate('orm', orm)
    app.decorate('em', () => orm.em.fork())

    app.addHook('onClose', async () => {
        await orm.close()
    })
}

export const databasePlugin = fp(databasePluginFn)
