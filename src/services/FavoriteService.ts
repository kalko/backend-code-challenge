import { EntityManager } from '@mikro-orm/core'
import { Pokemon } from '../entities/Pokemon.js'
import { User } from '../entities/User.js'
import { UserFavorite } from '../entities/UserFavorite.js'

export class FavoriteService {
    constructor(private em: EntityManager) {}

    addFavorite = async (userId: string, pokemonId: string) => {
        const user = await this.em.findOne(User, { id: userId })
        if (!user) {
            throw { statusCode: 404, message: 'User not found' }
        }

        const pokemon = await this.em.findOne(Pokemon, { id: pokemonId })
        if (!pokemon) {
            throw { statusCode: 404, message: 'Pokemon not found' }
        }

        const existing = await this.em.findOne(UserFavorite, { user, pokemon })
        if (existing) {
            throw { statusCode: 400, message: 'Pokemon already in favorites' }
        }

        const favorite = this.em.create(UserFavorite, {
            id: `${userId}_${pokemonId}`,
            user,
            pokemon,
            createdAt: new Date(),
        })

        await this.em.flush()

        return { id: favorite.id, pokemon }
    }

    removeFavorite = async (userId: string, pokemonId: string) => {
        const user = await this.em.findOne(User, { id: userId })
        if (!user) {
            throw { statusCode: 404, message: 'User not found' }
        }

        const pokemon = await this.em.findOne(Pokemon, { id: pokemonId })
        if (!pokemon) {
            throw { statusCode: 404, message: 'Pokemon not found' }
        }

        const favorite = await this.em.findOne(UserFavorite, { user, pokemon })
        if (!favorite) {
            throw { statusCode: 404, message: 'Pokemon not in favorites' }
        }

        await this.em.removeAndFlush(favorite)
    }

    getUserFavorites = async (userId: string) => {
        return await this.em.find(UserFavorite, { user: userId }, { populate: ['pokemon'] })
    }
}
