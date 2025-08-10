# Use Node.js LTS version
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files first
COPY package*.json ./

# Copy Prisma schema (needed for postinstall script)
COPY prisma ./prisma/

# Install dependencies (this will run prisma generate via postinstall)
RUN npm ci --only=production

# Copy rest of application code
COPY . .

# Ensure Prisma client is generated
RUN npx prisma generate

# Expose port
EXPOSE $PORT

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:$PORT/health || exit 1

# Start the application
CMD ["npm", "start"]
