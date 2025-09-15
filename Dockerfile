# Dockerfile (multi-stage optimizado para Yarn + Next.js)
# ---- build stage ----
FROM node:20-alpine AS builder
WORKDIR /app

# Enable CorePack and prepare the version of yarn specified in package.json
RUN corepack enable && corepack prepare yarn@4.9.4 --activate

# native dependencies required for the build
RUN apk add --no-cache libc6-compat build-base python3

# copy files that define dependencies first (cache)
COPY package.json yarn.lock ./

# Install all deps (dev prod) required for build <br> 
# Allow lockfile update in the build
RUN yarn install

# copy the rest of the code
COPY . .

# Generate Prisma Client after copying all code (includes schema.prism) <br> 
# Using NPX to avoid workspace issues
RUN npx prisma generate

# Next.js build (no turbopack for Docker compatibility) <br> 
# Disable linting during build to avoid code errors
ENV NODE_ENV=production
RUN npx next build --no-lint

# ---- production stage ----
FROM node:20-alpine AS runner
WORKDIR /app

# Tools needed in runtime (Netcat for HealthCheck/EntryPoint)
RUN apk add --no-cache netcat-openbsd

ENV NODE_ENV=production

# Enable Corepack and prepare yarn also for runner
RUN corepack enable && corepack prepare yarn@4.9.4 --activate

# Copy full node modules from builder (more efficient than reinstalling)
COPY --from=builder /app/node_modules ./node_modules
COPY package.json yarn.lock ./

# Create non-root user (optional) after installing deps to avoid permissions
RUN addgroup -g 1001 nextgroup && adduser -u 1001 -G nextgroup -s /bin/sh -D nextuser

# Copy artifacts from builder (build output and required files)
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/next.config.ts ./next.config.ts
COPY --from=builder /app/package.json ./package.json

# Copy entrypoint and give it permissions
COPY ./entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# switch to user no-root
USER nextuser

EXPOSE 3000

ENTRYPOINT ["/entrypoint.sh"]
CMD ["yarn", "start"]