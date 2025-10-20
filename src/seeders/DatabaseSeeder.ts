import { EntityManager } from '@mikro-orm/core'
import { Seeder } from '@mikro-orm/seeder'
import * as fs from 'fs'
import * as path from 'path'
import { Pokemon } from '../entities/Pokemon.js'

export class DatabaseSeeder extends Seeder {
    async run(em: EntityManager): Promise<void> {
        const pokemonDataPath = path.join(process.cwd(), 'pokemons.json')
        const pokemonData = JSON.parse(fs.readFileSync(pokemonDataPath, 'utf-8'))

        console.log(`Seeding ${pokemonData.length} rows`)

        for (const pokemonJson of pokemonData) {
            // Extract the required fields for our simplified Pokemon entity
            const pokemon = em.create(Pokemon, {
                id: pokemonJson.id,
                name: pokemonJson.name,
                classification: pokemonJson.classification,
                types: pokemonJson.types || [],
                weightMinimum: pokemonJson.weight?.minimum || '0kg',
                weightMaximum: pokemonJson.weight?.maximum || '0kg',
                heightMinimum: pokemonJson.height?.minimum || '0m',
                heightMaximum: pokemonJson.height?.maximum || '0m',
                fleeRate: pokemonJson.fleeRate || 0,
                evolutionRequirementName: pokemonJson.evolutionRequirements?.name || null,
                evolutionRequirementAmount: pokemonJson.evolutionRequirements?.amount || null,
                maxCP: pokemonJson.maxCP || 0,
                maxHP: pokemonJson.maxHP || 0,
            })
        }

        await em.flush()
        console.log('Seeding done')
    }
}
