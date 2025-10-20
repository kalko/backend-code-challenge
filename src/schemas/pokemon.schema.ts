const attackProperties = {
    id: { type: 'number' },
    name: { type: 'string' },
    type: { type: 'string' },
    damage: { type: 'number' },
    category: { type: 'string', enum: ['fast', 'special'] },
}

const evolutionProperties = {
    id: { type: 'number' },
    name: { type: 'string' },
}

const pokemonProperties = {
    id: { type: 'string' },
    name: { type: 'string' },
    classification: { type: 'string' },
    types: { type: 'array', items: { type: 'string' } },
    resistant: { type: 'array', items: { type: 'string' } },
    weaknesses: { type: 'array', items: { type: 'string' } },
    weightMinimum: { type: 'string' },
    weightMaximum: { type: 'string' },
    heightMinimum: { type: 'string' },
    heightMaximum: { type: 'string' },
    fleeRate: { type: 'number' },
    evolutionRequirementName: { type: 'string' },
    evolutionRequirementAmount: { type: 'number' },
    evolutions: {
        type: 'array',
        items: {
            type: 'object',
            properties: evolutionProperties,
        },
    },
    attacks: {
        type: 'array',
        items: {
            type: 'object',
            properties: attackProperties,
        },
    },
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
            search: { type: 'string', description: 'Search by Pokemon name (case-insensitive)' },
            type: { type: 'string', description: 'Filter by Pokemon type (Fire, Water, Grass)' },
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

export const getPokemonTypesSchema = {
    description: 'Get list of all unique Pokemon types',
    tags: ['Pokemons'],
    response: {
        200: {
            type: 'object',
            properties: {
                types: {
                    type: 'array',
                    items: { type: 'string' },
                },
            },
        },
    },
}
