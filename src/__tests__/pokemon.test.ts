import { FastifyInstance } from 'fastify'
import { buildApp } from '../app'
import { setupDatabase, teardownDatabase } from './setup'

describe('Pokemon API Endpoints', () => {
    let app: FastifyInstance

    beforeAll(async () => {
        await setupDatabase()
        app = await buildApp()
        await app.ready()
    }, 30000)

    afterAll(async () => {
        await app.close()
        await teardownDatabase()
    })

    describe('GET /health', () => {
        it('should return health status', async () => {
            const response = await app.inject({
                method: 'GET',
                url: '/health',
            })

            expect(response.statusCode).toBe(200)
            const body = JSON.parse(response.body)
            expect(body.status).toBe('ok')
            expect(body.timestamp).toBeDefined()
        })
    })

    describe('GET /pokemons', () => {
        it('should return paginated list of pokemons', async () => {
            const response = await app.inject({
                method: 'GET',
                url: '/pokemons?page=1&limit=5',
            })

            expect(response.statusCode).toBe(200)
            const body = JSON.parse(response.body)
            expect(body.data).toBeInstanceOf(Array)
            expect(body.data.length).toBeLessThanOrEqual(5)
            expect(body.pagination).toHaveProperty('page', 1)
            expect(body.pagination).toHaveProperty('limit', 5)
            expect(body.pagination).toHaveProperty('total')
            expect(body.pagination).toHaveProperty('totalPages')
        })

        it('should search pokemons by name', async () => {
            const response = await app.inject({
                method: 'GET',
                url: '/pokemons?search=char',
            })

            expect(response.statusCode).toBe(200)
            const body = JSON.parse(response.body)
            expect(body.data).toBeInstanceOf(Array)
            body.data.forEach((pokemon: any) => {
                expect(pokemon.name.toLowerCase()).toContain('char')
            })
        })

        it('should filter pokemons by type', async () => {
            const response = await app.inject({
                method: 'GET',
                url: '/pokemons?type=Electric',
            })

            expect(response.statusCode).toBe(200)
            const body = JSON.parse(response.body)
            expect(body.data).toBeInstanceOf(Array)
            body.data.forEach((pokemon: any) => {
                expect(pokemon.types).toContain('Electric')
            })
        })
    })

    describe('GET /pokemons/:id', () => {
        it('should return pokemon by id', async () => {
            const response = await app.inject({
                method: 'GET',
                url: '/pokemons/010',
            })

            expect(response.statusCode).toBe(200)
            const body = JSON.parse(response.body)
            expect(body.id).toBe('010')
            expect(body.name).toBe('Caterpie')
            expect(body.types).toBeInstanceOf(Array)
            expect(body.attacks).toBeInstanceOf(Array)
        })

        it('should return 404 for non-existent pokemon', async () => {
            const response = await app.inject({
                method: 'GET',
                url: '/pokemons/999',
            })

            expect(response.statusCode).toBe(404)
            const body = JSON.parse(response.body)
            expect(body.error).toBe('Pokemon not found')
        })
    })

    describe('GET /pokemons/by-name/:name', () => {
        it('should return pokemon by name (case-insensitive)', async () => {
            const response = await app.inject({
                method: 'GET',
                url: '/pokemons/by-name/caterpie',
            })

            expect(response.statusCode).toBe(200)
            const body = JSON.parse(response.body)
            expect(body.name).toBe('Caterpie')
        })

        it('should work with uppercase', async () => {
            const response = await app.inject({
                method: 'GET',
                url: '/pokemons/by-name/CATERPIE',
            })

            expect(response.statusCode).toBe(200)
            const body = JSON.parse(response.body)
            expect(body.name).toBe('Caterpie')
        })

        it('should return 404 for asdf', async () => {
            const response = await app.inject({
                method: 'GET',
                url: '/pokemons/by-name/asdf',
            })

            expect(response.statusCode).toBe(404)
        })
    })

    describe('GET /pokemon-types', () => {
        it('should return list of unique pokemon types', async () => {
            const response = await app.inject({
                method: 'GET',
                url: '/pokemon-types',
            })

            expect(response.statusCode).toBe(200)
            const body = JSON.parse(response.body)
            expect(body.types).toBeInstanceOf(Array)
            expect(body.types.length).toBeGreaterThan(0)
            expect(body.types).toContain('Electric')
            expect(body.types).toContain('Fire')
            expect(body.types).toContain('Water')
            // Should be sorted
            const sorted = [...body.types].sort()
            expect(body.types).toEqual(sorted)
        })
    })
})
