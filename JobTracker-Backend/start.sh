#!/bin/bash

echo "🚀 Starting JobTracker Backend..."

# Set environment for Railway
export OPENSSL_CONF=/dev/null

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
    echo "❌ Error: DATABASE_URL not set!"
    exit 1
fi

echo "✅ DATABASE_URL is set"
echo "📦 Generating Prisma Client..."
npx prisma generate

echo "🗄️ Setting up database schema..."
npx prisma db push --accept-data-loss

echo "🔍 Checking database tables..."
npx prisma db execute --stdin <<EOF || echo "Could not list tables"
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
EOF

echo "🚀 Starting server..."
node src/server.js
