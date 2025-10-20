import { Entity, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core'
import { Pokemon } from './Pokemon.js'
import { User } from './User.js'

@Entity()
export class UserFavorite {
    @PrimaryKey()
    id!: string

    @ManyToOne(() => User)
    user!: User

    @ManyToOne(() => Pokemon)
    pokemon!: Pokemon

    @Property()
    createdAt: Date = new Date()
}
