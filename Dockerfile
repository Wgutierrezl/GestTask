# Builder stage: install dev deps and compile TypeScript
FROM node:18-alpine AS builder
WORKDIR /usr/src/app

# Install dependencies (including devDependencies for build)
COPY package*.json ./
RUN npm ci

# Copy sources and build
COPY . .
RUN npm run build

# Runner stage: production image with only runtime deps
FROM node:18-alpine AS runner
WORKDIR /usr/src/app

# Set production environment
ENV NODE_ENV=production

# Create non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Install only production dependencies
COPY package*.json ./
RUN npm ci --omit=dev --omit=optional

# Copy built assets from builder
COPY --from=builder /usr/src/app/dist ./dist

# If you rely on public assets, uncomment and copy them
# COPY --from=builder /usr/src/app/public ./public

USER appuser

EXPOSE 8098

CMD ["node", "dist/main.js"]

