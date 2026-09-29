# Multi-arch image for the Raspberry Pi (arm64) and amd64. CI pushes :latest,
# and Watchtower on the Pi pulls it and restarts the container.

# ---------- 1. Builder Stage ----------
FROM node:22-alpine AS builder
WORKDIR /app

# Enable corepack and install the correct pnpm version
RUN corepack enable && corepack prepare pnpm@10.28.1 --activate

# Copy package files first for better caching
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Install all dependencies (including devDependencies)
RUN pnpm install --frozen-lockfile

# Copy all source code
COPY . .

# Build the Next.js production bundle (output: "standalone")
ENV NEXT_TELEMETRY_DISABLED=1
RUN pnpm run build


# ---------- 2. Runner Stage ----------
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production \
    PORT=3000 \
    HOSTNAME=0.0.0.0 \
    NEXT_TELEMETRY_DISABLED=1

# Unprivileged runtime user
RUN addgroup -S -g 1001 nextjs && adduser -S -u 1001 -G nextjs nextjs

# The standalone bundle carries its own minimal node_modules and server.js;
# static assets and public/ are not included in it and must be copied.
COPY --from=builder --chown=nextjs:nextjs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nextjs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nextjs /app/public ./public
# MDX is read from process.cwd()/content at request time (e.g. the layout's
# terminal data on non-prerendered routes), which file tracing doesn't pick up.
COPY --from=builder --chown=nextjs:nextjs /app/content ./content

USER nextjs

EXPOSE 3000

# Used by Docker/Portainer and Watchtower. busybox wget ships with alpine;
# 127.0.0.1 rather than localhost so it never resolves to ::1.
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD wget -q -O /dev/null http://127.0.0.1:3000/ || exit 1

CMD ["node", "server.js"]
