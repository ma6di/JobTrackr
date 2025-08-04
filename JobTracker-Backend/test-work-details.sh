#!/bin/bash

echo "Testing Work Details Integration..."

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
    "email": "work-details-test@example.com",
    "password": "TestUser123!",
    "firstName": "Work",
    "lastName": "Details"
  }')

TOKEN=$(echo $REGISTER_RESPONSE | grep -o '"token":"[^"]*"' | cut -d'"' -f4)

if [[ -z "$TOKEN" ]]; then
    echo "❌ Failed to create user or get token"
    echo "Response: $REGISTER_RESPONSE"
    exit 1
fi

echo "✅ User created, token obtained"

# Create a job with full work details
echo "3. Creating job with work details..."
JOB_RESPONSE=$(curl -s -X POST http://localhost:3001/api/jobs \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "company": "Tech Corp",
    "position": "Senior Developer",
    "location": "San Francisco, CA",
    "salary": "$120,000 - $150,000",
    "jobType": "Full-time",
    "remote": "Hybrid",
    "status": "applied",
    "description": "Amazing role for a senior developer",
    "additionalInfo": "Great benefits and flexible hours"
  }')

echo "Job creation response: $JOB_RESPONSE"

# Create another job with different work arrangement
echo "4. Creating remote contract job..."
JOB_RESPONSE2=$(curl -s -X POST http://localhost:3001/api/jobs \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "company": "Remote Startup",
    "position": "Frontend Consultant",
    "location": "Remote",
    "salary": "$80/hour",
    "jobType": "Contract",
    "remote": "Remote",
    "status": "applied",
    "description": "Contract position for React expert"
  }')

echo "Second job creation response: $JOB_RESPONSE2"

# Get jobs to see work details
echo "5. Fetching jobs to verify work details..."
JOBS_RESPONSE=$(curl -s -X GET http://localhost:3001/api/jobs \
  -H "Authorization: Bearer $TOKEN")

echo "Jobs response with work details:"
echo $JOBS_RESPONSE | jq '.jobs[] | {position, company, jobType, remote}' 2>/dev/null || echo $JOBS_RESPONSE

echo "6. Testing complete!"
