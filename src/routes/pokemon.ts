import { FastifyInstance } from 'fastify'
import { PokemonController } from '../controllers/PokemonController.js'
import { getPokemonByIdSchema, getPokemonByNameSchema, getPokemonsSchema } from '../schemas/pokemon.schema.js'

export const pokemonRoutes = async (app: FastifyInstance) => {
    // Public routes
    app.get('/pokemons', { schema: getPokemonsSchema }, PokemonController.getAllPokemons)
    app.get('/pokemons/:id', { schema: getPokemonByIdSchema }, PokemonController.getPokemonById)
    app.get('/pokemons/by-name/:name', { schema: getPokemonByNameSchema }, PokemonController.getPokemonByName)
}
