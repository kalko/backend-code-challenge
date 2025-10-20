import { FastifyReply, FastifyRequest } from 'fastify'
import { User } from '../entities/User.js'

export class AuthController {
    static login = async (request: FastifyRequest<{ Body: { userId: string } }>, reply: FastifyReply) => {
        try {
            const em = request.server.em()
            const userRepo = em.getRepository(User)

            let user = await userRepo.findOne({ id: request.body.userId })

            if (!user) {
                user = userRepo.create({
                    id: request.body.userId,
                    username: `user_${request.body.userId}`,
                    email: `${request.body.userId}@example.com`,
                })
                await em.persistAndFlush(user)
            }

            const token = request.server.jwt.sign({
                userId: user.id,
                username: user.username,
            })

            return reply.send({
                token,
                user: {
                    id: user.id,
                    username: user.username,
                },
            })
        } catch (error) {
            request.log.error(error)
            return reply.status(500).send({ error: 'Internal server error during login' })
        }
    }
}
