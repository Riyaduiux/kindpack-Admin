# syntax=docker/dockerfile:1
# API image. Build from the repository root:
#   docker build -f apps/backend/Dockerfile -t app-api .
# Or simply: docker compose up -d --build
ARG NODE_VERSION=22

FROM node:${NODE_VERSION}-bookworm-slim AS base
# OpenSSL is required by the Prisma query engine.
RUN apt-get update \
  && apt-get install -y --no-install-recommends openssl ca-certificates \
  && rm -rf /var/lib/apt/lists/*
ENV TURBO_TELEMETRY_DISABLED=1 \
    NEXT_TELEMETRY_DISABLED=1
WORKDIR /app

# 1. Prune the monorepo to the API and the internal packages it uses (@app/db).
FROM base AS prepare
COPY . .
RUN npx --yes turbo@2.11.7 prune @app/backend --docker

# 2. Install dependencies first (this layer is cached until a package.json or the
#    lockfile changes), then copy the sources and build with Turborepo
#    (db:generate → @app/db build → @app/backend build).
FROM base AS builder
COPY --from=prepare /app/out/json/ .
RUN npm ci --no-audit --no-fund
COPY --from=prepare /app/out/full/ .
RUN npx turbo run build --filter=@app/backend

# 3. Runtime image. Dev dependencies stay: the entrypoint uses the Prisma CLI for
#    migrations and tsx for the optional first-run seed.
FROM base AS runner
ENV NODE_ENV=production \
    PORT=8080 \
    UPLOAD_DIR=/app/uploads
COPY --from=builder --chown=node:node /app /app
RUN mkdir -p /app/uploads \
  && chown node:node /app/uploads \
  && chmod +x /app/apps/backend/docker-entrypoint.sh
USER node
EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=5s --start-period=60s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:'+(process.env.PORT||8080)+'/'+(process.env.API_PREFIX||'api/v1')+'/health').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"
ENTRYPOINT ["/app/apps/backend/docker-entrypoint.sh"]
