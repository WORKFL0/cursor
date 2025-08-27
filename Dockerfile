# Multi-stage build for optimized production image
FROM node:20-alpine AS base

# Install security updates and required packages
RUN apk update && apk upgrade && apk add --no-cache \
    libc6-compat \
    curl \
    dumb-init \
    && rm -rf /var/cache/apk/*

# Create app directory and user early
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app

# Copy package files with proper ownership
COPY --chown=nextjs:nodejs package.json package-lock.json* ./

# Install all dependencies for build (dev + production)
RUN npm ci --include=dev && npm cache clean --force

# Remove dev dependencies and keep only production
RUN npm prune --omit=dev

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app

# Copy dependencies
COPY --from=deps --chown=nextjs:nodejs /app/node_modules ./node_modules
COPY --chown=nextjs:nodejs . .

# Environment variables for build
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

# Switch to nextjs user for build
USER nextjs

# Build application
RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

# Security: Use non-root user
USER nextjs

# Environment variables
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Copy built application with proper ownership
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

# Set the correct permissions for prerender cache
RUN mkdir -p .next && chown -R nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Create logs directory
RUN mkdir -p /app/logs && chown -R nextjs:nodejs /app/logs

# Expose port
EXPOSE 3000

# Health check with improved timeout and interval
HEALTHCHECK --interval=20s --timeout=5s --start-period=10s --retries=3 \
    CMD curl -f http://localhost:3000/api/health || exit 1

# Add labels for metadata
LABEL maintainer="Workflo B.V. <info@workflo.it>"
LABEL version="1.0.0"
LABEL description="Workflo New Project - Next.js Application"

# Use dumb-init as PID 1 to handle signals properly
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "server.js"]