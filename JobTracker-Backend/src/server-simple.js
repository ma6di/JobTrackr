/*
  LEARNING COMMENT: Simplified Server for Testing
  - This version runs without database connection
  - Perfect for understanding how Express works
  - We'll add database later step by step
*/

import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import compression from 'compression'
import rateLimit from 'express-rate-limit'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config()

// Create Express app
const app = express()
const PORT = process.env.PORT || 5000

/* 
  LEARNING COMMENT: Basic Middleware Setup
  - Only the essential middleware for testing
  - No database or AWS dependencies yet
*/

// Security middleware
app.use(helmet())

// CORS middleware  
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))

// Body parsing middleware
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// Compression middleware
app.use(compression())

// Logging middleware
app.use(morgan('combined'))

// Rate limiting middleware
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: {
    error: 'Too many requests from this IP, please try again later.',
    retryAfter: '15 minutes'
  }
})
app.use('/api/', limiter)

/* 
  LEARNING COMMENT: Test Routes
  - Simple routes to verify everything works
  - Real routes will be added in next steps
*/

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    version: '1.0.0',
    message: '🎉 Your backend is working!'
  })
})

// Test API endpoints
app.get('/api/test', (req, res) => {
  res.json({
    message: '🚀 API is working!',
    timestamp: new Date().toISOString(),
    method: req.method,
    url: req.url,
    headers: {
      'user-agent': req.headers['user-agent'],
      'content-type': req.headers['content-type']
    }
  })
})

// Test POST endpoint
app.post('/api/test', (req, res) => {
  res.json({
    message: '📝 POST request received!',
    receivedData: req.body,
    timestamp: new Date().toISOString()
  })
})

// Future auth routes (placeholder)
app.get('/api/auth/status', (req, res) => {
  res.json({
    message: '🔐 Auth endpoints coming soon!',
    endpoints: [
      'POST /api/auth/register',
      'POST /api/auth/login',
      'POST /api/auth/logout'
    ]
  })
})

// Future resume routes (placeholder)
app.get('/api/resumes', (req, res) => {
  res.json({
    message: '📄 Resume endpoints coming soon!',
    endpoints: [
      'GET /api/resumes',
      'POST /api/resumes',
      'PUT /api/resumes/:id',
      'DELETE /api/resumes/:id'
    ]
  })
})

// Future job routes (placeholder)
app.get('/api/jobs', (req, res) => {
  res.json({
    message: '💼 Job endpoints coming soon!',
    endpoints: [
      'GET /api/jobs',
      'POST /api/jobs',
      'PUT /api/jobs/:id',
      'DELETE /api/jobs/:id'
    ]
  })
})

/* 
  LEARNING COMMENT: 404 Handler
  - Catches requests to non-existent endpoints
  - Provides helpful information about available routes
*/
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.method} ${req.originalUrl} not found`,
    availableRoutes: [
      'GET /health - Server health check',
      'GET /api/test - Test API endpoint',
      'POST /api/test - Test POST endpoint',
      'GET /api/auth/status - Auth status',
      'GET /api/resumes - Resume endpoints (coming)',
      'GET /api/jobs - Job endpoints (coming)'
    ],
    tip: 'Try visiting /health or /api/test'
  })
})

/* 
  LEARNING COMMENT: Basic Error Handler
  - Catches any errors and formats them nicely
  - Development version with detailed error info
*/
app.use((err, req, res, next) => {
  console.error('🚨 Error occurred:', err.message)
  
  res.status(err.status || 500).json({
    error: 'Something went wrong!',
    message: err.message,
    timestamp: new Date().toISOString(),
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  })
})

/* 
  LEARNING COMMENT: Start the Server
  - Simple startup without database dependency
  - Logs helpful information for testing
*/
app.listen(PORT, () => {
  console.log('')
  console.log('🎉 JobTracker Backend Server Started!')
  console.log('=====================================')
  console.log(`🌐 Server running on: http://localhost:${PORT}`)
  console.log(`📍 Health check: http://localhost:${PORT}/health`)
  console.log(`🔗 API test: http://localhost:${PORT}/api/test`)
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`)
  console.log(`⏰ Started at: ${new Date().toISOString()}`)
  console.log('=====================================')
  console.log('')
  console.log('🎯 Try these URLs in your browser:')
  console.log(`   • http://localhost:${PORT}/health`)
  console.log(`   • http://localhost:${PORT}/api/test`)
  console.log(`   • http://localhost:${PORT}/api/auth/status`)
  console.log('')
  console.log('📝 To test POST requests, use:')
  console.log('   • Postman, Thunder Client, or curl')
  console.log('')
})

export default app
