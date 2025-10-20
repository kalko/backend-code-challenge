import { FastifyInstance } from 'fastify'
import { AuthController } from '../controllers/AuthController.js'
import { loginSchema } from '../schemas/auth.schema.js'

export const authRoutes = async (app: FastifyInstance) => {
    // Public auth route
    app.post('/auth/login', { schema: loginSchema }, AuthController.login)
}
