const pokemonProperties = {
    id: { type: 'string' },
    name: { type: 'string' },
    classification: { type: 'string' },
    weightMinimum: { type: 'string' },
    weightMaximum: { type: 'string' },
    heightMinimum: { type: 'string' },
    heightMaximum: { type: 'string' },
    fleeRate: { type: 'number' },
    evolutionRequirementName: { type: 'string' },
    evolutionRequirementAmount: { type: 'number' },
    maxCP: { type: 'number' },
    maxHP: { type: 'number' },
}

export const getPokemonsSchema = {
    description: 'Get list of Pokemons.',
    tags: ['Pokemons'],
    querystring: {
        type: 'object',
        properties: {
            page: { type: 'number', default: 1, description: 'Page number (starts at 1)' },
            limit: { type: 'number', default: 20, description: 'Items per page' },
            search: { type: 'string', description: 'Search by Pokemon name' },
            favorite: {
                type: 'boolean',
                description: 'Filter by favorite Pokemons (requires authentication)',
            },
        },
    },
    response: {
        200: {
            type: 'object',
            properties: {
                data: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: pokemonProperties,
                    },
                },
                pagination: {
                    type: 'object',
                    properties: {
                        page: { type: 'number' },
                        limit: { type: 'number' },
                        total: { type: 'number' },
                        totalPages: { type: 'number' },
                    },
                },
            },
        },
    },
    security: [{ Bearer: [] }, {}],
}

export const getPokemonByIdSchema = {
    description: 'Get a Pokemon by ID',
    tags: ['Pokemons'],
    params: {
        type: 'object',
        properties: {
            id: { type: 'string', description: 'Pokemon ID' },
        },
        required: ['id'],
    },
    response: {
        200: {
            type: 'object',
            properties: pokemonProperties,
        },
        404: {
            type: 'object',
            properties: {
                error: { type: 'string' },
            },
        },
    },
}

export const getPokemonByNameSchema = {
    description: 'Get a Pokemon by name (case-insensitive)',
    tags: ['Pokemons'],
    params: {
        type: 'object',
        properties: {
            name: { type: 'string', description: 'Pokemon name' },
        },
        required: ['name'],
    },
    response: {
        200: {
            type: 'object',
            properties: pokemonProperties,
        },
        404: {
            type: 'object',
            properties: {
                error: { type: 'string' },
            },
        },
    },
}
