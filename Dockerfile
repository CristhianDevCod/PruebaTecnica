# multi-stage build
FROM node:20-alpine AS builder
WORKDIR /app

# dependencias nativas
RUN apk add --no-cache libc6-compat build-base python3

# install
COPY package.json yarn.lock ./
# si usas npm: COPY package.json package-lock.json ./
RUN yarn install --frozen-lockfile

# copy source
COPY . .

# build (Next.js)
ENV NODE_ENV=production
RUN yarn build

# production image
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
# evita instalar dev deps
COPY --from=builder /app/package.json /app/yarn.lock ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.js ./next.config.js
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

EXPOSE 3000
# If you use Next.js middleware or image optimization, ensure proper environment
CMD ["node", "server.js"]
# Alternatively if using built-in next start:
# CMD ["yarn", "start"]
