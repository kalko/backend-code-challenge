import { FastifyInstance } from 'fastify'

const healthSchema = {
    tags: ['System'],
    summary: 'Health check',
    description: 'Check API health status',
    response: {
        200: {
            type: 'object',
            properties: {
                status: { type: 'string', example: 'ok' },
                timestamp: { type: 'string', example: '2025-10-20T10:00:00.000Z' },
                version: { type: 'string', example: '1.0.0' },
            },
        },
    },
}

const healthRoutes = async (app: FastifyInstance) => {
    app.get('/health', { schema: healthSchema }, async () => {
        return {
            status: 'ok',
            timestamp: new Date().toISOString(),
            version: process.env.npm_package_version || '1.0.0',
        }
    })
}

export default healthRoutes
