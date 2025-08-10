#!/bin/bash

echo "🚀 Railway Deployment Readiness Check (Updated)"
echo "================================================"

# Check if we're in the backend directory
if [ ! -f "package.json" ]; then
  echo "❌ Error: Run this script from JobTracker-Backend directory"
  exit 1
fi

echo "✅ In correct directory (JobTracker-Backend)"

# Check essential files
FILES=("package.json" ".nvmrc" "Procfile" "railway.json" "nixpacks.toml" "railway.toml")
for file in "${FILES[@]}"; do
  if [ -f "$file" ]; then
    echo "✅ $file exists"
  else
    echo "❌ $file missing"
  fi
done

# Check Node version in .nvmrc
if [ -f ".nvmrc" ]; then
  NODE_VERSION=$(cat .nvmrc | tr -d '\n\r')
  echo "✅ Node version specified: $NODE_VERSION"
fi

# Check engines in package.json
if grep -q '"engines"' package.json; then
  echo "✅ Engines field found in package.json"
else
  echo "❌ Missing engines field in package.json"
fi

# Check start script
if grep -q '"start".*"node src/server.js"' package.json; then
  echo "✅ Start script configured correctly"
else
  echo "❌ Start script issue in package.json"
fi

# Test build process
echo ""
echo "🔨 Testing build process..."
npm run build > /dev/null 2>&1
if [ $? -eq 0 ]; then
  echo "✅ Build process works"
else
  echo "❌ Build process failed"
fi

echo ""
echo "📋 Railway Deployment Instructions:"
echo "1. Push these changes to GitHub"
echo "2. In Railway: Settings → Root Directory = 'JobTracker-Backend'"
echo "3. In Railway: Settings → Builder = 'Nixpacks'"
echo "4. Add environment variables (see checklist)"
echo "5. Deploy!"

echo ""
echo "🎯 If deployment still fails:"
echo "- Delete Railway service and recreate"
echo "- Use 'Empty Service' then connect GitHub"
echo "- Ensure PostgreSQL is added as separate service"

echo ""
echo "✅ Ready for Railway deployment!"
