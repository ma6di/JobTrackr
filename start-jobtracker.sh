#!/bin/bash

echo "🚀 Starting JobTracker Development Environment"
echo "=============================================="

# Navigate to backend directory
echo "📂 Starting Backend Server..."
cd "/Users/mahdicheraghali/Desktop/My Project/JobTracker-Backend"

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing backend dependencies..."
    npm install
fi

# Start backend server in background
echo "🔧 Starting backend server on port 3001..."
npm start &
BACKEND_PID=$!

# Wait a bit for backend to start
sleep 3

# Navigate to frontend directory
echo "📂 Starting Frontend Server..."
cd "/Users/mahdicheraghali/Desktop/My Project/JobTracker"

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing frontend dependencies..."
    npm install
fi

# Start frontend server
echo "🎨 Starting frontend server on port 5173..."
echo ""
echo "🌐 Your JobTracker will be available at:"
echo "   Frontend: http://localhost:5173"
echo "   Backend:  http://localhost:3001"
echo ""
echo "📊 Navigate to http://localhost:5173/jobs to test the Jobs page"
echo ""
echo "⚠️  To stop both servers, press Ctrl+C"

# Start frontend server
npm run dev

# When frontend stops, also stop backend
echo "🛑 Stopping backend server..."
kill $BACKEND_PID
