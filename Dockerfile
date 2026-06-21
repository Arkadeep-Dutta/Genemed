# Gene Prioritizer AI — production Dockerfile
#
# Phase 1 scope: builds and runs the Next.js app shell. Phase 2 will add a
# `npx prisma generate` step before build once the Prisma schema exists;
# Phase 3 will document how HPO data is provided to the container (either
# baked in at build time or mounted via a volume) — see DEPLOYMENT.md.

# ---- deps stage ----------------------------------------------------------
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
# Phase 1 note: this build will only succeed once package-lock.json has
# been generated and committed (see README "Verification" section).
RUN npm ci

# ---- build stage -----------------------------------------------------------
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# ---- runtime stage ---------------------------------------------------------
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

USER nextjs

EXPOSE 3000
ENV PORT=3000

CMD ["npm", "run", "start"]
