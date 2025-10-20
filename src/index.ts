import * as dotenv from 'dotenv'
import fastify from 'fastify'
dotenv.config()

const port = parseInt(process.env.PORT || '3000')
const host = process.env.HOST || '0.0.0.0'

const app = fastify({
    logger: {
        level: process.env.LOG_LEVEL || 'info',
    },
})

app.get('/health', async () => {
    return { status: 'ok', timestamp: new Date().toISOString() }
})

app.get('/', async () => {
    return 'Hello!'
})

await app.listen({ port, host })
console.log(`Server ready at http://${host}:${port}`)
