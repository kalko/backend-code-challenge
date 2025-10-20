import { EntityManager } from '@mikro-orm/core'
import { Pokemon } from '../entities/Pokemon.js'
import { UserFavorite } from '../entities/UserFavorite.js'

export interface PokemonFilters {
    page?: number
    limit?: number
    search?: string
    type?: string
    favorite?: boolean
    userId?: string
}

export interface PaginatedResponse<T> {
    data: T[]
    pagination: {
        page: number
        limit: number
        total: number
        totalPages: number
    }
}

export class PokemonService {
    constructor(private em: EntityManager) {}

    async getAllPokemons(filters: PokemonFilters = {}): Promise<PaginatedResponse<Pokemon>> {
        const { page = 1, limit = 20, search, type, favorite, userId } = filters

        const where: any = {}

        // Filter by name (case-insensitive)
        if (search) {
            where.name = { $ilike: `%${search}%` }
        }

        // Filter by type using JSON contains
        if (type) {
            where.types = { $contains: [type] }
        }

        // Filter by favorite (requires join with UserFavorite)
        if (favorite && userId) {
            const favoritePokemons = await this.em.find(
                UserFavorite,
                { user: userId },
                { populate: ['pokemon'] },
            )
            const favoritePokemonIds = favoritePokemons.map((fav) => fav.pokemon.id)

            if (favoritePokemonIds.length > 0) {
                where.id = { $in: favoritePokemonIds }
            } else {
                return {
                    data: [],
                    pagination: {
                        page,
                        limit,
                        total: 0,
                        totalPages: 0,
                    },
                }
            }
        }

        const total = await this.em.count(Pokemon, where)

        const data = await this.em.find(Pokemon, where, {
            limit,
            offset: (page - 1) * limit,
            orderBy: { id: 'ASC' },
            populate: ['pokemonAttacks.attack'],
        })

        return {
            data,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        }
    }

    async getPokemonById(id: string): Promise<Pokemon | null> {
        return await this.em.findOne(Pokemon, { id }, { populate: ['pokemonAttacks.attack'] })
    }

    async getPokemonTypes(): Promise<string[]> {
        // Get all unique types from the database
        const pokemons = await this.em.find(Pokemon, {}, { fields: ['types'] })
        const typesSet = new Set<string>()

        pokemons.forEach((pokemon) => {
            pokemon.types.forEach((type) => typesSet.add(type))
        })

        return Array.from(typesSet).sort()
    }
}
