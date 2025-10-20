import { FastifyReply, FastifyRequest } from 'fastify'
import { Pokemon } from '../entities/Pokemon.js'
import { PokemonService } from '../services/PokemonService.js'

interface PokemonQuery {
    page?: number
    limit?: number
    search?: string
    type?: string
    favorite?: boolean | string // Query params come as strings
}

export class PokemonController {
    static getAllPokemons = async (
        request: FastifyRequest<{ Querystring: PokemonQuery }>,
        reply: FastifyReply,
    ) => {
        const em = request.server.em()
        const pokemonService = new PokemonService(em)

        try {
            const { page, limit, search, type, favorite } = request.query

            // Get userId from JWT if authenticated (optional)
            const userId = (request.user as any)?.userId

            const filters: any = {}
            if (page) filters.page = Number(page)
            if (limit) filters.limit = Number(limit)
            if (search) filters.search = search
            if (type) filters.type = type
            if (favorite !== undefined) filters.favorite = favorite === true || favorite === 'true'
            if (userId) filters.userId = userId

            const result = await pokemonService.getAllPokemons(filters)

            return result
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

        const pokemon = await em.findOne(
            Pokemon,
            { name: { $ilike: name } },
            { populate: ['pokemonAttacks.attack'] },
        )

        if (!pokemon) {
            return reply.code(404).send({ error: 'Pokemon not found' })
        }

        return pokemon
    }

    static getPokemonTypes = async (request: FastifyRequest, reply: FastifyReply) => {
        const em = request.server.em()
        const pokemonService = new PokemonService(em)

        try {
            const types = await pokemonService.getPokemonTypes()
            return { types }
        } catch (error) {
            request.log.error(error)
            return reply.code(500).send({ error: 'Internal server error' })
        }
    }
}
