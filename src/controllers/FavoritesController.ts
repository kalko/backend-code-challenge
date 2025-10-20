import { FastifyReply, FastifyRequest } from 'fastify'
import { FavoriteService } from '../services/FavoriteService.js'

export class FavoritesController {
    static getFavorites = async (request: FastifyRequest, reply: FastifyReply) => {
        try {
            const userId = (request.user as any).userId

            const em = request.server.em()
            const favoriteService = new FavoriteService(em)

            const favorites = await favoriteService.getUserFavorites(userId)

            return reply.send({
                userId,
                favorites: favorites.map((fav) => ({
                    id: fav.id,
                    pokemon: {
                        id: fav.pokemon.id,
                        name: fav.pokemon.name,
                        classification: fav.pokemon.classification,
                    },
                    createdAt: fav.createdAt,
                })),
            })
        } catch (error: any) {
            request.log.error(error)
            const statusCode = error.statusCode || 500
            return reply.status(statusCode).send({ error: error.message || 'Failed to get favorites' })
        }
    }

    static addFavorite = async (request: FastifyRequest, reply: FastifyReply) => {
        try {
            const userId = (request.user as any).userId
            const { pokemonId } = request.params as { pokemonId: string }

            const em = request.server.em()
            const favoriteService = new FavoriteService(em)

            const result = await favoriteService.addFavorite(userId, pokemonId)

            return reply.send({
                message: 'Pokemon added to favorites',
                favorite: {
                    id: result.id,
                    pokemon: result.pokemon.name,
                },
            })
        } catch (error: any) {
            request.log.error(error)
            const statusCode = error.statusCode || 500
            return reply.status(statusCode).send({ error: error.message || 'Failed to add favorite' })
        }
    }

    static removeFavorite = async (request: FastifyRequest, reply: FastifyReply) => {
        try {
            const userId = (request.user as any).userId
            const { pokemonId } = request.params as { pokemonId: string }

            const em = request.server.em()
            const favoriteService = new FavoriteService(em)

            await favoriteService.removeFavorite(userId, pokemonId)

            return reply.send({ message: 'Pokemon removed from favorites' })
        } catch (error: any) {
            request.log.error(error)
            const statusCode = error.statusCode || 500
            return reply.status(statusCode).send({ error: error.message || 'Failed to remove favorite' })
        }
    }
}
