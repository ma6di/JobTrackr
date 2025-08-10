#!/bin/bash

echo "🚀 Testing Railway Deployment"
echo "=============================="

# Prompt for Railway URL
read -p "Enter your Railway app URL (e.g., https://your-app.up.railway.app): " RAILWAY_URL

if [ -z "$RAILWAY_URL" ]; then
  echo "❌ Error: Please provide your Railway URL"
  exit 1
fi

echo ""
echo "Testing: $RAILWAY_URL"
echo ""

# Test health endpoint
echo "1. Testing health endpoint..."
curl -s "$RAILWAY_URL/health" | head -c 200
echo ""
echo ""

# Test API base
echo "2. Testing API base..."
curl -s "$RAILWAY_URL/api" | head -c 200
echo ""
echo ""

# Test auth endpoints (should return errors without credentials)
echo "3. Testing auth endpoints..."
echo "   Login endpoint (should return validation error):"
curl -s -X POST "$RAILWAY_URL/api/auth/login" \
     -H "Content-Type: application/json" \
     -d '{}' | head -c 200
echo ""
echo ""

echo "4. Testing user registration (should return validation error):"
curl -s -X POST "$RAILWAY_URL/api/auth/register" \
     -H "Content-Type: application/json" \
     -d '{}' | head -c 200
echo ""
echo ""

echo "✅ Basic API tests complete!"
echo ""
echo "🔍 Next steps:"
echo "1. Add PostgreSQL database if not done"
echo "2. Set environment variables in Railway"
echo "3. Run database migrations"
echo "4. Test with frontend application"
