export const loginSchema = {
    tags: ['Authentication'],
    body: {
        type: 'object',
        required: ['userId'],
        properties: {
            userId: { type: 'string', description: 'User ID' },
        },
    },
    response: {
        200: {
            type: 'object',
            properties: {
                token: { type: 'string' },
                user: {
                    type: 'object',
                    properties: {
                        id: { type: 'string' },
                        username: { type: 'string' },
                    },
                },
            },
        },
    },
}
