#!/bin/bash
# Script to start the JobTracker backend server
# Run this in a new terminal while keeping Vite running

echo "Starting JobTracker Backend Server..."
echo "=================================="

cd "/Users/mahdicheraghali/Desktop/My Project/JobTracker-Backend"

# Check if backend is already running
if lsof -ti:3001 > /dev/null; then
    echo "⚠️  Port 3001 is already in use. Killing existing process..."
    kill $(lsof -ti:3001)
    sleep 2
fi

echo "🚀 Starting backend server on port 3001..."
node src/server.js
