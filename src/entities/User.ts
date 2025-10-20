import { Entity, PrimaryKey, Property } from '@mikro-orm/core'

@Entity()
export class User {
    @PrimaryKey()
    id!: string

    @Property()
    username!: string

    @Property()
    email!: string
}
