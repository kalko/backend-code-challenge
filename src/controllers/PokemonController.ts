import { FastifyReply, FastifyRequest } from 'fastify'
import { Pokemon } from '../entities/Pokemon.js'
import { PokemonService } from '../services/PokemonService.js'

export class PokemonController {
    static getAllPokemons = async (request: FastifyRequest, reply: FastifyReply) => {
        const em = request.server.em()
        const pokemonService = new PokemonService(em)

        try {
            const pokemons = await pokemonService.getAllPokemons()
            return pokemons
        } catch (error) {
            request.log.error(error)
            return reply.code(500).send({ error: 'Internal server error' })
        }
    }

    static getPokemonById = async (request: FastifyRequest, reply: FastifyReply) => {
        const { id } = request.params as { id: string }
        const em = request.server.em()
        const pokemonService = new PokemonService(em)

        try {
            const pokemon = await pokemonService.getPokemonById(id)
            if (!pokemon) {
                return reply.code(404).send({ error: 'Pokemon not found' })
            }
            return pokemon
        } catch (error) {
            request.log.error(error)
            return reply.code(500).send({ error: 'Internal server error' })
        }
    }

    static getPokemonByName = async (request: FastifyRequest, reply: FastifyReply) => {
        const { name } = request.params as { name: string }
        const em = request.server.em()

        const pokemon = await em.findOne(Pokemon, { name: { $ilike: name } })

        if (!pokemon) {
            return reply.code(404).send({ error: 'Pokemon not found' })
        }

        return pokemon
    }
}
