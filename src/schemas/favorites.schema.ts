const favoriteItemProperties = {
    id: { type: 'string', description: 'Favorite ID' },
    pokemon: {
        type: 'object',
        properties: {
            id: { type: 'string', description: 'Pokemon ID' },
            name: { type: 'string', description: 'Pokemon name' },
            classification: { type: 'string', description: 'Pokemon classification' },
        },
    },
    createdAt: { type: 'string', description: 'Timestamp when favorite was added' },
}

const errorResponse = {
    type: 'object',
    properties: {
        error: { type: 'string' },
    },
}

export const getFavoritesSchema = {
    description: 'Get all favorite Pokemons for the authenticated user',
    tags: ['Favorites'],
    security: [{ Bearer: [] }],
    response: {
        200: {
            type: 'object',
            properties: {
                userId: { type: 'string', description: 'User ID' },
                favorites: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: favoriteItemProperties,
                    },
                },
            },
        },
        401: errorResponse,
        500: errorResponse,
    },
}

export const addFavoriteSchema = {
    description: 'Add a Pokemon to favorites',
    tags: ['Favorites'],
    security: [{ Bearer: [] }],
    params: {
        type: 'object',
        properties: {
            pokemonId: { type: 'string', description: 'Pokemon ID to add to favorites' },
        },
        required: ['pokemonId'],
    },
    response: {
        200: {
            type: 'object',
            properties: {
                message: { type: 'string' },
                favorite: {
                    type: 'object',
                    properties: {
                        id: { type: 'string', description: 'Favorite ID' },
                        pokemon: { type: 'string', description: 'Pokemon name' },
                    },
                },
            },
        },
        400: errorResponse,
        401: errorResponse,
        404: errorResponse,
        500: errorResponse,
    },
}

export const removeFavoriteSchema = {
    description: 'Remove a Pokemon from favorites',
    tags: ['Favorites'],
    security: [{ Bearer: [] }],
    params: {
        type: 'object',
        properties: {
            pokemonId: { type: 'string', description: 'Pokemon ID to remove from favorites' },
        },
        required: ['pokemonId'],
    },
    response: {
        200: {
            type: 'object',
            properties: {
                message: { type: 'string' },
            },
        },
        401: errorResponse,
        404: errorResponse,
        500: errorResponse,
    },
}
