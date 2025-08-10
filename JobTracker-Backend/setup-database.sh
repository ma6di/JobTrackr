#!/bin/bash

echo "🚀 Creating JobTracker Database Schema..."
echo "Database URL: ${DATABASE_URL:0:30}..."

# Set OpenSSL config for Railway
export OPENSSL_CONF=/dev/null

echo "📦 Generating Prisma Client..."
npx prisma generate

echo "🗄️ Creating Database Tables..."
npx prisma db push --force-reset

echo "✅ Database schema created successfully!"
echo "📋 Checking created tables..."
npx prisma db execute --stdin <<EOF
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
EOF
