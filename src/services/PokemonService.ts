import { EntityManager } from '@mikro-orm/core'
import { Pokemon } from '../entities/Pokemon.js'

export class PokemonService {
    constructor(private em: EntityManager) {}

    async getAllPokemons(): Promise<Pokemon[]> {
        return await this.em.find(Pokemon, {})
    }

    async getPokemonById(id: string): Promise<Pokemon | null> {
        return await this.em.findOne(Pokemon, { id })
    }
}
