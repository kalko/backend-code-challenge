import { Entity, PrimaryKey, Property } from '@mikro-orm/core'

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

    @Property()
    maxCP!: number

    @Property()
    maxHP!: number
}
