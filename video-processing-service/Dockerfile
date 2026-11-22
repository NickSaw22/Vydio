
# Build stage
FROM node:26-bookworm-slim AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY tsconfig.json ./
COPY src ./src

RUN npm run build


# Runtime stage
FROM node:26-bookworm-slim AS runtime

ENV NODE_ENV=production

WORKDIR /app

# Install FFmpeg
RUN apt-get update \
    && apt-get install -y --no-install-recommends ffmpeg \
    && rm -rf /var/lib/apt/lists/* \
    && mkdir -p /data \
    && chown node:node /app /data

COPY --chown=node:node package.json package-lock.json ./

USER node

# Production dependencies
RUN npm ci --omit=dev

COPY --from=build --chown=node:node /app/dist ./dist

VOLUME ["/data"]

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
    CMD node -e "fetch('http://127.0.0.1:3000/').then(r => process.exit(r.ok ? 0 : 1)).catch(() => process.exit(1))"

CMD ["node", "dist/index.js"]
