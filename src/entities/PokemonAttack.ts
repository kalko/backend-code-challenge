import { Entity, ManyToOne, PrimaryKey } from '@mikro-orm/core'
import { Attack } from './Attack.js'
import { Pokemon } from './Pokemon.js'

@Entity()
export class PokemonAttack {
    @PrimaryKey({ autoincrement: true })
    id!: number

    @ManyToOne(() => Pokemon)
    pokemon!: Pokemon

    @ManyToOne(() => Attack)
    attack!: Attack
}
