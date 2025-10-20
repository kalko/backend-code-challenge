import { EntityManager } from '@mikro-orm/core'
import { Seeder } from '@mikro-orm/seeder'
import * as fs from 'fs'
import * as path from 'path'
import { Attack } from '../entities/Attack.js'
import { Pokemon } from '../entities/Pokemon.js'
import { PokemonAttack } from '../entities/PokemonAttack.js'

export class DatabaseSeeder extends Seeder {
    async run(em: EntityManager): Promise<void> {
        const existingCount = await em.count(Pokemon)
        if (existingCount > 0) {
            console.log(`Database already seeded. Skipping seeding process.`)
            return
        }

        const pokemonDataPath = path.join(process.cwd(), 'pokemons.json')
        const pokemonData = JSON.parse(fs.readFileSync(pokemonDataPath, 'utf-8'))

        console.log(`Seeding ${pokemonData.length} rows`)

        // Map to store unique attacks to avoid duplicates
        const attackMap = new Map<string, Attack>()

        for (const pokemonJson of pokemonData) {
            const pokemon = em.create(Pokemon, {
                id: pokemonJson.id,
                name: pokemonJson.name,
                classification: pokemonJson.classification,
                types: pokemonJson.types || [],
                resistant: pokemonJson.resistant || [],
                weaknesses: pokemonJson.weaknesses || [],
                weightMinimum: pokemonJson.weight?.minimum || '0kg',
                weightMaximum: pokemonJson.weight?.maximum || '0kg',
                heightMinimum: pokemonJson.height?.minimum || '0m',
                heightMaximum: pokemonJson.height?.maximum || '0m',
                fleeRate: pokemonJson.fleeRate || 0,
                evolutionRequirementName: pokemonJson.evolutionRequirements?.name || null,
                evolutionRequirementAmount: pokemonJson.evolutionRequirements?.amount || null,
                evolutions: pokemonJson.evolutions || null,
                maxCP: pokemonJson.maxCP || 0,
                maxHP: pokemonJson.maxHP || 0,
            })

            // Process attacks
            if (pokemonJson.attacks) {
                // Process fast attacks
                if (pokemonJson.attacks.fast) {
                    for (const attackData of pokemonJson.attacks.fast) {
                        const attackKey = `${attackData.name}-${attackData.type}-${attackData.damage}-fast`

                        let attack = attackMap.get(attackKey)
                        if (!attack) {
                            attack = em.create(Attack, {
                                name: attackData.name,
                                type: attackData.type,
                                damage: attackData.damage,
                                category: 'fast',
                            })
                            attackMap.set(attackKey, attack)
                        }

                        em.create(PokemonAttack, {
                            pokemon,
                            attack,
                        })
                    }
                }

                // Process special attacks
                if (pokemonJson.attacks.special) {
                    for (const attackData of pokemonJson.attacks.special) {
                        const attackKey = `${attackData.name}-${attackData.type}-${attackData.damage}-special`

                        let attack = attackMap.get(attackKey)
                        if (!attack) {
                            attack = em.create(Attack, {
                                name: attackData.name,
                                type: attackData.type,
                                damage: attackData.damage,
                                category: 'special',
                            })
                            attackMap.set(attackKey, attack)
                        }

                        // Create explicit junction entity (consistent with UserFavorite)
                        em.create(PokemonAttack, {
                            pokemon,
                            attack,
                        })
                    }
                }
            }
        }

        await em.flush()
        console.log('Seeding done')
    }
}
