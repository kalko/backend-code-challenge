import { Collection, Entity, OneToMany, PrimaryKey, Property } from '@mikro-orm/core'
import { PokemonAttack } from './PokemonAttack.js'

@Entity()
export class Attack {
    @PrimaryKey({ autoincrement: true })
    id!: number

    @Property()
    name!: string

    @Property()
    type!: string

    @Property()
    damage!: number

    @Property()
    category!: 'fast' | 'special'

    @OneToMany(() => PokemonAttack, (pokemonAttack) => pokemonAttack.attack)
    pokemonAttacks = new Collection<PokemonAttack>(this)
}
