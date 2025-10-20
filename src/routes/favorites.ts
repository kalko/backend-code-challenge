import { FastifyInstance } from 'fastify'
import { FavoritesController } from '../controllers/FavoritesController.js'
import { addFavoriteSchema, getFavoritesSchema, removeFavoriteSchema } from '../schemas/favorites.schema.js'

export const favoritesRoutes = async (app: FastifyInstance) => {
    // Protected routes

    app.post(
        '/favorites/:pokemonId',
        {
            schema: addFavoriteSchema,
            preHandler: app.authenticate,
        },
        FavoritesController.addFavorite,
    )

    app.delete(
        '/favorites/:pokemonId',
        {
            schema: removeFavoriteSchema,
            preHandler: app.authenticate,
        },
        FavoritesController.removeFavorite,
    )

    app.get(
        '/favorites',
        {
            schema: getFavoritesSchema,
            preHandler: app.authenticate,
        },
        FavoritesController.getFavorites,
    )
}
