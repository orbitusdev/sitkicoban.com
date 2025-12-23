# Base stage
FROM node:20-alpine AS base
RUN corepack enable pnpm

# Dependencies stage
FROM base AS deps
WORKDIR /workspace

# Copy workspace configuration
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Copy ALL workspace package source code (not just package.json)
# pnpm needs the full packages to create proper workspace symlinks
COPY packages ./packages
COPY configs ./configs
COPY apps/website ./apps/website

# Install all workspace dependencies
# This will create proper symlinks in node_modules/@orbitusdev/*
RUN pnpm install --frozen-lockfile

# Builder stage
FROM deps AS builder
WORKDIR /workspace

# Build the application from workspace root
# Next.js will transpile the workspace packages during build
ENV NEXT_TELEMETRY_DISABLED=1
RUN pnpm --filter "./packages/**" build
RUN pnpm --filter @orbitusdev/website build

# Runner stage
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy standalone output files
COPY --from=builder --chown=nextjs:nodejs /workspace/apps/website/.next/standalone ./

# Copy static files
COPY --from=builder --chown=nextjs:nodejs /workspace/apps/website/.next/static ./apps/website/.next/static
COPY --from=builder --chown=nextjs:nodejs /workspace/apps/website/public ./apps/website/public

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "apps/website/server.js"]
