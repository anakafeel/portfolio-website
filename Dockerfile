# ---------- 1. Builder Stage ----------
FROM node:22-alpine AS builder
WORKDIR /app

# Enable corepack and install the correct pnpm version
RUN corepack enable && corepack prepare pnpm@10.28.1 --activate

# Copy package files first for better caching
COPY package.json pnpm-lock.yaml ./

# Install all dependencies (including devDependencies)
RUN pnpm install --frozen-lockfile

# Copy all source code
COPY . .

# Build the Next.js production bundle
RUN pnpm run build


# ---------- 2. Runner Stage ----------
FROM node:22-alpine AS runner
WORKDIR /app

# Enable corepack for pnpm (used only for install — runtime uses npm)
RUN corepack enable && corepack prepare pnpm@10.28.1 --activate

# Set environment variables for production
ENV NODE_ENV=production
ENV PORT=3000

# Copy only necessary build artifacts and node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./
COPY --from=builder /app/pnpm-lock.yaml ./

# Install only production dependencies
RUN pnpm install --prod --frozen-lockfile

# Expose the same port your app listens on
EXPOSE 3000

# Healthcheck (optional but useful for Portainer & Watchtower)
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s \
  CMD wget -qO- http://localhost:3000 || exit 1

# Start the server
CMD ["node_modules/.bin/next", "start"]
