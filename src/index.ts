import { buildApp } from './app.js'

const start = async (): Promise<void> => {
    try {
        console.log('Starting Pokemon API server...')

        const app = await buildApp()
        const port = parseInt(process.env.PORT || '3333')
        const host = process.env.HOST || '0.0.0.0'

        await app.listen({ port, host })

        console.log(`Server ready at http://${host}:${port}`)
        console.log(`API documentation available at http://${host}:${port}/docs`)
        console.log(`Health check available at http://${host}:${port}/health`)
        console.log(`Pokemons API available at http://${host}:${port}/pokemons`)
    } catch (error) {
        console.error('Error starting server:', error)
        process.exit(1)
    }
}

start()
