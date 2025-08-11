#!/bin/bash

echo "🔍 Diagnosing Railway Environment Variables..."
echo ""

echo "📋 You need to check these environment variables in Railway:"
echo ""
echo "1. Go to: https://railway.app/dashboard"
echo "2. Select your JobTracker backend project"
echo "3. Go to Variables tab"
echo "4. Make sure these are set:"
echo ""
echo "✅ Required Variables:"
echo "   DATABASE_URL - Your PostgreSQL connection string"
echo "   JWT_SECRET - Your JWT secret key (ROTATE if previously exposed!)" 
echo "   NODE_ENV=production"
echo "   CORS_ORIGIN=https://job-trackr-murex.vercel.app"
echo ""
echo "🔗 Database Connection:"
echo "   If you don't have DATABASE_URL set, you need to:"
echo "   - Add PostgreSQL service to your Railway project"
echo "   - Copy the DATABASE_URL from PostgreSQL service"
echo "   - Add it to your backend's environment variables"
echo ""
echo "🧪 Testing if DATABASE_URL is set..."

# Test a simple endpoint that doesn't require database
echo "Testing health endpoint (no DB required):"
curl -s "https://jobtrackr-production.up.railway.app/health" | jq . 2>/dev/null || curl -s "https://jobtrackr-production.up.railway.app/health"

echo ""
echo ""
echo "Testing an endpoint that requires database:"
curl -s "https://jobtrackr-production.up.railway.app/api/users/profile" \
  -H "Authorization: Bearer invalid_token" 2>/dev/null | head -c 200

echo ""
echo ""
echo "🚨 If you see 'Internal Server Error' above, the database isn't connected!"
echo "💡 Fix: Set DATABASE_URL in Railway environment variables"
