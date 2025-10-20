import { EntityManager } from '@mikro-orm/core'
import { User } from '../entities/User.js'

export class UserService {
    constructor(private em: EntityManager) {}

    getOrCreateUser = async (userId: string): Promise<User> => {
        let user = await this.em.findOne(User, { id: userId })

        if (!user) {
            user = this.em.create(User, {
                id: userId,
                username: `user_${userId}`,
                email: `${userId}@example.com`,
            })
            await this.em.flush()
        }

        return user
    }
}
