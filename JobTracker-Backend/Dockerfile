# Use Node.js on Debian (not Alpine) for OpenSSL 1.1 compatibility
FROM node:18-bullseye-slim

# Install OpenSSL 1.1 and other required system dependencies
RUN apt-get update && apt-get install -y \
    openssl \
    libssl1.1 \
    ca-certificates \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy package files first
COPY package*.json ./

# Copy Prisma schema (needed for postinstall script)
COPY prisma ./prisma/

# Install dependencies (this will run prisma generate via postinstall)
ENV DATABASE_URL="postgresql://user:pass@localhost:5432/db"
RUN npm ci --only=production

# Copy rest of application code
COPY . .

# Ensure Prisma client is generated with correct binary targets
ENV DATABASE_URL="postgresql://user:pass@localhost:5432/db"
RUN npx prisma generate

# Set environment variables
ENV OPENSSL_CONF=/dev/null

# Expose port
EXPOSE $PORT

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:$PORT/health || exit 1

# Start the application
CMD ["npm", "start"]
