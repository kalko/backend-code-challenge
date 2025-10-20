import { Collection, Entity, OneToMany, PrimaryKey, Property } from '@mikro-orm/core'
import { PokemonAttack } from './PokemonAttack.js'

export interface Evolution {
    id: number
    name: string
}

@Entity()
export class Pokemon {
    @PrimaryKey()
    id!: string

    @Property()
    name!: string

    @Property()
    classification!: string

    @Property({ type: 'json' })
    types!: string[]

    @Property({ type: 'json' })
    resistant!: string[]

    @Property({ type: 'json' })
    weaknesses!: string[]

    @Property()
    weightMinimum!: string

    @Property()
    weightMaximum!: string

    @Property()
    heightMinimum!: string

    @Property()
    heightMaximum!: string

    @Property()
    fleeRate!: number

    @Property({ nullable: true })
    evolutionRequirementName?: string

    @Property({ nullable: true })
    evolutionRequirementAmount?: number

    @Property({ type: 'json', nullable: true })
    evolutions?: Evolution[]

    @OneToMany(() => PokemonAttack, (pokemonAttack) => pokemonAttack.pokemon)
    pokemonAttacks = new Collection<PokemonAttack>(this)

    @Property()
    maxCP!: number

    @Property()
    maxHP!: number

    toJSON() {
        const obj = {
            id: this.id,
            name: this.name,
            classification: this.classification,
            types: this.types,
            resistant: this.resistant,
            weaknesses: this.weaknesses,
            weightMinimum: this.weightMinimum,
            weightMaximum: this.weightMaximum,
            heightMinimum: this.heightMinimum,
            heightMaximum: this.heightMaximum,
            fleeRate: this.fleeRate,
            evolutionRequirementName: this.evolutionRequirementName,
            evolutionRequirementAmount: this.evolutionRequirementAmount,
            evolutions: this.evolutions,
            maxCP: this.maxCP,
            maxHP: this.maxHP,
            attacks: this.pokemonAttacks.isInitialized()
                ? this.pokemonAttacks.getItems().map((pa) => pa.attack)
                : [],
        }
        return obj
    }
}
