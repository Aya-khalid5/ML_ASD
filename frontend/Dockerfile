# ---------------------------------------------------------------------------
# ASD Screening Frontend — Next.js
# ---------------------------------------------------------------------------

# ---- Build stage -----------------------------------------------------------
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies first (better layer caching).
COPY package.json package-lock.json* ./
RUN npm install

# Copy the source and build the standalone server.
COPY . .
# The API URL can be injected at build time for server-rendered calls.
ARG NEXT_PUBLIC_API_URL=http://localhost:8000
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
RUN npm run build

# ---- Runtime stage ---------------------------------------------------------
FROM node:20-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production

# Standalone output contains the server and a minimal node_modules.
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

EXPOSE 3000
CMD ["node", "server.js"]

