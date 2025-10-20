import { FastifyInstance } from 'fastify'
import { PokemonController } from '../controllers/PokemonController.js'
import {
    getPokemonByIdSchema,
    getPokemonByNameSchema,
    getPokemonsSchema,
    getPokemonTypesSchema,
} from '../schemas/pokemon.schema.js'

export const pokemonRoutes = async (app: FastifyInstance) => {
    // Optional authentication helper
    const optionalAuth = async (request: any, reply: any) => {
        try {
            await request.jwtVerify()
        } catch (err) {
            // Ignore authentication errors for optional auth
        }
    }

    // Public routes with optional authentication for favorite filter
    app.get(
        '/pokemons',
        { schema: getPokemonsSchema, onRequest: optionalAuth },
        PokemonController.getAllPokemons,
    )
    app.get('/pokemons/:id', { schema: getPokemonByIdSchema }, PokemonController.getPokemonById)
    app.get('/pokemons/by-name/:name', { schema: getPokemonByNameSchema }, PokemonController.getPokemonByName)
    app.get('/pokemon-types', { schema: getPokemonTypesSchema }, PokemonController.getPokemonTypes)
}
