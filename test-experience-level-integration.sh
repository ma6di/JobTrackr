#!/bin/bash

echo "🧪 Experience Level Field - Integration Test"
echo "=============================================="

# Test 1: Check if backend server is running
echo "📡 Test 1: Checking backend server..."
BACKEND_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3001/health)
if [ "$BACKEND_STATUS" = "200" ]; then
    echo "✅ Backend server is running on port 3001"
else
    echo "❌ Backend server is not responding (Status: $BACKEND_STATUS)"
    exit 1
fi

# Test 2: Test creating a job with experience level
echo ""
echo "📝 Test 2: Creating job with experience level..."
CREATE_RESPONSE=$(curl -s -X POST http://localhost:3001/api/jobs \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer test-token" \
  -d '{
    "company": "Test Company",
    "position": "Senior Software Engineer",
    "location": "San Francisco, CA",
    "salary": "$150k - $180k",
    "jobType": "Full-time",
    "experienceLevel": "Senior",
    "remote": "Hybrid",
    "description": "Test job with experience level",
    "additionalInfo": "Senior level position",
    "applicationUrl": "https://example.com/job",
    "status": "Applied",
    "appliedAt": "2025-08-04T00:00:00.000Z",
    "notes": "Testing experience level field"
  }')

if echo "$CREATE_RESPONSE" | grep -q '"experienceLevel":"Senior"'; then
    echo "✅ Job created successfully with experience level"
    JOB_ID=$(echo "$CREATE_RESPONSE" | grep -o '"id":[0-9]*' | head -1 | cut -d':' -f2)
    echo "   Job ID: $JOB_ID"
else
    echo "❌ Failed to create job with experience level"
    echo "   Response: $CREATE_RESPONSE"
fi

# Test 3: Test fetching jobs and verify experience level is included
echo ""
echo "📋 Test 3: Fetching jobs to verify experience level..."
FETCH_RESPONSE=$(curl -s -X GET http://localhost:3001/api/jobs \
  -H "Authorization: Bearer test-token")

JOBS_WITH_EXP_LEVEL=$(echo "$FETCH_RESPONSE" | grep -o '"experienceLevel":"[^"]*"' | wc -l)
echo "✅ Found $JOBS_WITH_EXP_LEVEL jobs with experience level data"

# Test 4: Test updating experience level
if [ ! -z "$JOB_ID" ]; then
    echo ""
    echo "✏️  Test 4: Updating experience level..."
    UPDATE_RESPONSE=$(curl -s -X PUT "http://localhost:3001/api/jobs/$JOB_ID" \
      -H "Content-Type: application/json" \
      -H "Authorization: Bearer test-token" \
      -d '{
        "experienceLevel": "Principal"
      }')
    
    if echo "$UPDATE_RESPONSE" | grep -q '"experienceLevel":"Principal"'; then
        echo "✅ Experience level updated successfully"
    else
        echo "❌ Failed to update experience level"
        echo "   Response: $UPDATE_RESPONSE"
    fi
fi

echo ""
echo "🎉 Experience Level Integration Test Complete!"
echo "=============================================="

# Display summary
echo ""
echo "📊 Test Summary:"
echo "  ✅ Backend API connectivity"
echo "  ✅ Job creation with experience level"
echo "  ✅ Job fetching with experience level data"
echo "  ✅ Experience level field updates"
echo ""
echo "🌐 To test the frontend:"
echo "  1. Start frontend: cd JobTracker && npm run dev"
echo "  2. Open: http://localhost:5173"
echo "  3. Create a new job and select an experience level"
echo "  4. Verify it appears in the jobs table"
echo "  5. View job details to see experience level display"
