import { FastifyInstance } from 'fastify'
import { buildApp } from '../app'
import { setupDatabase, teardownDatabase } from './setup'

describe('Auth and favorites API', () => {
    let app: FastifyInstance
    let authToken: string

    beforeAll(async () => {
        await setupDatabase()
        app = await buildApp()
        await app.ready()
    }, 30000)

    afterAll(async () => {
        await app.close()
        await teardownDatabase()
    })

    describe('POST /auth/login', () => {
        it('should login and return JWT token', async () => {
            const response = await app.inject({
                method: 'POST',
                url: '/auth/login',
                payload: {
                    userId: 'test-user-123',
                },
            })

            expect(response.statusCode).toBe(200)
            const body = JSON.parse(response.body)
            expect(body.token).toBeDefined()
            expect(typeof body.token).toBe('string')

            // Save token for other tests
            authToken = body.token
        })

        it('should require userId', async () => {
            const response = await app.inject({
                method: 'POST',
                url: '/auth/login',
                payload: {},
            })

            expect(response.statusCode).toBe(400)
        })
    })

    describe('Favorites Endpoints', () => {
        beforeAll(async () => {
            // Get auth token
            const loginResponse = await app.inject({
                method: 'POST',
                url: '/auth/login',
                payload: {
                    userId: 'test-user-favorites',
                },
            })
            authToken = JSON.parse(loginResponse.body).token
        })

        describe('POST /favorites/:pokemonId', () => {
            it('should add pokemon to favorites', async () => {
                const response = await app.inject({
                    method: 'POST',
                    url: '/favorites/010',
                    headers: {
                        authorization: `Bearer ${authToken}`,
                    },
                })

                expect(response.statusCode).toBe(201)
                const body = JSON.parse(response.body)
                expect(body.message).toBe('Pokemon added to favorites')
            })

            it('should require authentication', async () => {
                const response = await app.inject({
                    method: 'POST',
                    url: '/favorites/010',
                })

                expect(response.statusCode).toBe(401)
            })

            it('should return 404 for non-existent pokemon', async () => {
                const response = await app.inject({
                    method: 'POST',
                    url: '/favorites/999',
                    headers: {
                        authorization: `Bearer ${authToken}`,
                    },
                })

                expect(response.statusCode).toBe(404)
            })
        })

        describe('GET /favorites', () => {
            it('should return list of favorite pokemons', async () => {
                const response = await app.inject({
                    method: 'GET',
                    url: '/favorites',
                    headers: {
                        authorization: `Bearer ${authToken}`,
                    },
                })

                expect(response.statusCode).toBe(200)
                const body = JSON.parse(response.body)
                expect(body).toBeInstanceOf(Array)
            })

            it('should require authentication', async () => {
                const response = await app.inject({
                    method: 'GET',
                    url: '/favorites',
                })

                expect(response.statusCode).toBe(401)
            })
        })

        describe('DELETE /favorites/:pokemonId', () => {
            it('should remove pokemon from favorites', async () => {
                // First add a favorite
                await app.inject({
                    method: 'POST',
                    url: '/favorites/010',
                    headers: {
                        authorization: `Bearer ${authToken}`,
                    },
                })

                // Then remove it
                const response = await app.inject({
                    method: 'DELETE',
                    url: '/favorites/010',
                    headers: {
                        authorization: `Bearer ${authToken}`,
                    },
                })

                expect(response.statusCode).toBe(200)
                const body = JSON.parse(response.body)
                expect(body.message).toBe('Pokemon removed from favorites')
            })

            it('should require authentication', async () => {
                const response = await app.inject({
                    method: 'DELETE',
                    url: '/favorites/010',
                })

                expect(response.statusCode).toBe(401)
            })
        })

        describe('GET /pokemons with favorite filter', () => {
            it('should filter pokemons by favorites when authenticated', async () => {
                // Add some favorites
                await app.inject({
                    method: 'POST',
                    url: '/favorites/010',
                    headers: {
                        authorization: `Bearer ${authToken}`,
                    },
                })

                // Query with favorite filter
                const response = await app.inject({
                    method: 'GET',
                    url: '/pokemons?favorite=true',
                    headers: {
                        authorization: `Bearer ${authToken}`,
                    },
                })

                expect(response.statusCode).toBe(200)
                const body = JSON.parse(response.body)
                expect(body.data).toBeInstanceOf(Array)
                // Should contain Caterpie
                const caterpie = body.data.find((p: any) => p.id === '010')
                expect(caterpie).toBeDefined()
            })

            it('should ignore favorite filter when not authenticated', async () => {
                const response = await app.inject({
                    method: 'GET',
                    url: '/pokemons?favorite=true',
                })

                expect(response.statusCode).toBe(200)
                const body = JSON.parse(response.body)
                // Should return all pokemons, not filtered
                expect(body.pagination.total).toBeGreaterThan(10)
            })
        })
    })
})
