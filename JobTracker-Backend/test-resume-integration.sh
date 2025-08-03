#!/bin/bash

echo "Testing Resume Integration..."

# Check if backend is running
echo "1. Checking backend health..."
HEALTH=$(curl -s http://localhost:3001/health)
if [[ $HEALTH == *"healthy"* ]]; then
    echo "✅ Backend is running"
else
    echo "❌ Backend is not running. Please start it with: npm start"
    exit 1
fi

# Register a new user
echo "2. Creating test user..."
REGISTER_RESPONSE=$(curl -s -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "resume-test@example.com",
    "password": "TestUser123!",
    "firstName": "Resume",
    "lastName": "Test"
  }')

TOKEN=$(echo $REGISTER_RESPONSE | grep -o '"token":"[^"]*"' | cut -d'"' -f4)

if [[ -z "$TOKEN" ]]; then
    echo "❌ Failed to create user or get token"
    echo "Response: $REGISTER_RESPONSE"
    exit 1
fi

echo "✅ User created, token obtained"

# Create a job with resumeId = null to simulate existing jobs
echo "3. Creating job without resume..."
JOB_RESPONSE=$(curl -s -X POST http://localhost:3001/api/jobs \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "company": "Test Company",
    "position": "Test Position",
    "location": "Remote",
    "salary": "$50,000",
    "status": "applied",
    "resumeId": null
  }')

echo "Job creation response: $JOB_RESPONSE"

# Get jobs to see if resume data is included
echo "4. Fetching jobs..."
JOBS_RESPONSE=$(curl -s -X GET http://localhost:3001/api/jobs \
  -H "Authorization: Bearer $TOKEN")

echo "Jobs response: $JOBS_RESPONSE"

echo "5. Testing complete!"
