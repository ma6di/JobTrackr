#!/usr/bin/env node

/*
  🧪 LEARNING COMMENT: LinkedIn API Integration Test
  =================================================
  
  This script tests the LinkedIn API endpoints to ensure
  the auto-fill functionality is working correctly.
  
  Tests:
  1. Parse LinkedIn job URL endpoint
  2. Verify mock data generation
  3. Check API response format
*/

import axios from 'axios'

const API_BASE = 'http://localhost:3001/api'

// Test data
const testUrls = [
  'https://linkedin.com/jobs/view/1234567890',
  'https://linkedin.com/jobs/view/9876543210', 
  'https://linkedin.com/jobs/view/5555555555'
]

async function testLinkedInJobParsing() {
  console.log('🧪 Testing LinkedIn Job URL Parsing...\n')
  
  for (let i = 0; i < testUrls.length; i++) {
    const jobUrl = testUrls[i]
    console.log(`📋 Test ${i + 1}: ${jobUrl}`)
    
    try {
      const response = await axios.post(`${API_BASE}/auth/linkedin/parse-job`, {
        jobUrl: jobUrl
      }, {
        headers: {
          'Content-Type': 'application/json',
          // For testing without auth, we'll modify the backend temporarily
          'Authorization': 'Bearer test-token'
        }
      })
      
      const jobData = response.data.jobData
      
      console.log('✅ Success!')
      console.log(`   Company: ${jobData.company}`)
      console.log(`   Position: ${jobData.position}`)
      console.log(`   Location: ${jobData.location}`)
      console.log(`   Salary: ${jobData.salary}`)
      console.log(`   Type: ${jobData.type}`)
      console.log(`   Remote: ${jobData.remote}`)
      console.log(`   Description: ${jobData.description.substring(0, 100)}...`)
      console.log('')
      
    } catch (error) {
      console.log('❌ Error:', error.response?.data?.message || error.message)
      console.log('')
    }
  }
}

async function testInvalidUrl() {
  console.log('🧪 Testing Invalid URL Handling...\n')
  
  const invalidUrl = 'https://example.com/invalid-job-url'
  console.log(`📋 Invalid URL Test: ${invalidUrl}`)
  
  try {
    const response = await axios.post(`${API_BASE}/auth/linkedin/parse-job`, {
      jobUrl: invalidUrl
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer test-token'
      }
    })
    
    console.log('⚠️  Unexpected success - should have failed')
    
  } catch (error) {
    if (error.response?.status === 400) {
      console.log('✅ Correctly rejected invalid URL')
      console.log(`   Error: ${error.response.data.message}`)
    } else {
      console.log('❌ Unexpected error:', error.message)
    }
  }
  
  console.log('')
}

async function runTests() {
  console.log('🔗 LinkedIn API Integration Tests')
  console.log('================================\n')
  
  // Check if backend is running
  try {
    await axios.get(`${API_BASE}/health`)
    console.log('✅ Backend server is running\n')
  } catch (error) {
    console.log('❌ Backend server is not responding')
    console.log('   Make sure the backend is running on http://localhost:3001')
    console.log('   Run: cd JobTracker-Backend && npm start\n')
    return
  }
  
  await testLinkedInJobParsing()
  await testInvalidUrl()
  
  console.log('🎉 All tests completed!')
  console.log('\n💡 Next steps:')
  console.log('   1. Open http://localhost:5173 in your browser')
  console.log('   2. Navigate to Jobs page and click "Add Job Application"')
  console.log('   3. Try pasting a LinkedIn URL in the integration section')
  console.log('   4. Watch the form auto-fill with job data!')
}

runTests().catch(console.error)
