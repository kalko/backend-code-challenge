FROM node:22-alpine AS builder

WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install

COPY . .

RUN yarn build

# Production stage
FROM node:22-alpine AS production

# Install curl for healthcheck
RUN apk add --no-cache curl

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

WORKDIR /app

# Copy package files
COPY package.json yarn.lock ./

RUN yarn install 

# Copy build app
COPY --from=builder /app/dist ./dist

# Copy migration and seeder files
COPY --from=builder /app/src/migrations ./src/migrations
COPY --from=builder /app/src/seeders ./src/seeders

# Copy MikroORM config
COPY --from=builder /app/src/mikro-orm.config.ts ./src/mikro-orm.config.ts

# Copy pokemon data
COPY pokemons.json ./

# Change ownership to non-root user
RUN chown -R nodejs:nodejs /app

# Switch to non-root user
USER nodejs

# Expose application port
EXPOSE 3333

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
    CMD curl -f http://localhost:3333/health || exit 1

# Start the application
CMD ["node", "dist/index.js"]
