/*
  LEARNING COMMENT: Main Express Server Entry Point
  - This is the heart of the JobTracker backend API
  - Sets up Express server with middleware, routes, and error handling
  - Configures database connection and AWS services
  - Provides RESTful API endpoints for the React frontend
*/

// Import required modules
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import compression from 'compression'
import rateLimit from 'express-rate-limit'
import dotenv from 'dotenv'

// Import custom modules (we'll create these)
import { connectDatabase, getPrismaClient } from './config/database.js'
import { configureAWS } from './config/aws.js'
import errorHandler from './middleware/errorHandler.js'
import { requireAuth } from './middleware/auth.js'

// Import route handlers (we'll create these)
import authRoutes from './routes/auth.js'
import userRoutes from './routes/users.js'
import resumeRoutes from './routes/resumes.js'
import jobRoutes from './routes/jobs.js'

/* 
  LEARNING COMMENT: Environment Configuration
  - dotenv loads environment variables from .env file
  - Keeps sensitive data (passwords, API keys) out of code
  - Different configs for development vs production
*/
dotenv.config()

/* 
  LEARNING COMMENT: Express App Initialization
  - Creates Express application instance
  - Express is the web framework that handles HTTP requests
*/
const app = express()

/* 
  LEARNING COMMENT: Port Configuration
  - Uses environment variable PORT or defaults to 5000
  - Cloud platforms (AWS, Heroku) inject PORT automatically
  - Allows flexible deployment across different environments
*/
const PORT = process.env.PORT || 5000

/* 
  LEARNING COMMENT: Security Middleware Setup
  - helmet(): Sets security-related HTTP headers
  - Protects against common web vulnerabilities
  - Essential for production applications
*/
app.use(helmet())

/* 
  LEARNING COMMENT: CORS (Cross-Origin Resource Sharing) Setup
  - Allows React frontend (localhost:3000) to call API (localhost:5000)
  - Configures which origins can access the API
  - Essential for frontend-backend communication
*/
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:5174', 
    'http://localhost:5175',
    process.env.CORS_ORIGIN
  ].filter(Boolean),
  credentials: true, // Allow cookies and auth headers
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))

/* 
  LEARNING COMMENT: Request Parsing Middleware
  - express.json(): Parses JSON request bodies (from fetch() calls)
  - express.urlencoded(): Parses form data
  - Converts request data into JavaScript objects
*/
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

/* 
  LEARNING COMMENT: Prisma Middleware
  - Adds Prisma client to req.prisma for use in routes
  - Makes database operations available in all route handlers
*/
app.use((req, res, next) => {
  req.prisma = getPrismaClient()
  next()
})

/* 
  LEARNING COMMENT: Compression Middleware
  - Compresses HTTP responses (gzip)
  - Reduces bandwidth usage and improves performance
  - Especially helpful for JSON API responses
*/
app.use(compression())

/* 
  LEARNING COMMENT: Request Logging Middleware
  - morgan logs HTTP requests to console
  - 'combined' format includes detailed request info
  - Helps with debugging and monitoring
*/
app.use(morgan('combined'))

/* 
  LEARNING COMMENT: Rate Limiting Middleware
  - Prevents API abuse by limiting requests per IP
  - 15 minutes window, max 100 requests per IP
  - Protects against DDoS and brute force attacks
*/
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.',
    retryAfter: '15 minutes'
  },
  standardHeaders: true, // Return rate limit info in headers
  legacyHeaders: false   // Disable X-RateLimit-* headers
})
app.use('/api/', limiter)

/* 
  LEARNING COMMENT: Health Check Endpoint
  - Simple endpoint to verify server is running
  - Used by AWS load balancers and monitoring tools
  - Returns basic server status information
*/
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    version: '1.0.0'
  })
})

/* 
  LEARNING COMMENT: API Routes Setup
  - Mounts different route handlers under /api prefix
  - Organizes endpoints by functionality (auth, users, resumes, jobs)
  - RESTful API design pattern
*/
app.use('/api/auth', authRoutes)                    // Authentication: /api/auth/login, /api/auth/register
app.use('/api/users', requireAuth, userRoutes)     // User management: /api/users/profile (protected)
app.use('/api/resumes', requireAuth, resumeRoutes) // Resume CRUD: /api/resumes, /api/resumes/:id (protected)
app.use('/api/jobs', requireAuth, jobRoutes)       // Job applications: /api/jobs, /api/jobs/:id (protected)

/* 
  LEARNING COMMENT: 404 Handler for Unknown Routes
  - Catches requests to non-existent endpoints
  - Returns consistent error format
  - Prevents server crashes from invalid URLs
*/
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.method} ${req.originalUrl} not found`,
    availableRoutes: [
      'GET /health',
      'POST /api/auth/login',
      'POST /api/auth/register',
      'GET /api/users/profile',
      'GET /api/resumes',
      'GET /api/jobs'
    ]
  })
})

/* 
  LEARNING COMMENT: Global Error Handler
  - Catches all unhandled errors in the application
  - Provides consistent error response format
  - Logs errors for debugging while hiding sensitive details from users
*/
app.use(errorHandler)

/* 
  LEARNING COMMENT: Server Startup Function
  - Initializes database connection and AWS services
  - Starts HTTP server on specified port
  - Handles startup errors gracefully
*/
async function startServer() {
  try {
    // Initialize database connection
    console.log('🗄️  Connecting to database...')
    await connectDatabase()
    console.log('✅ Database connected successfully')

    // Configure AWS services
    console.log('☁️  Configuring AWS services...')
    await configureAWS()
    console.log('✅ AWS services configured')

    // Start HTTP server
    app.listen(PORT, () => {
      console.log('')
      console.log('🚀 JobTracker Backend Server Started!')
      console.log('================================')
      console.log(`🌐 Server running on port: ${PORT}`)
      console.log(`📍 Health check: http://localhost:${PORT}/health`)
      console.log(`🔗 API base URL: http://localhost:${PORT}/api`)
      console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`)
      console.log(`⏰ Started at: ${new Date().toISOString()}`)
      console.log('================================')
      console.log('')
    })

  } catch (error) {
    console.error('❌ Failed to start server:', error.message)
    console.error('🔍 Error details:', error)
    process.exit(1) // Exit with error code
  }
}

/* 
  LEARNING COMMENT: Graceful Shutdown Handling
  - Handles SIGTERM and SIGINT signals (Ctrl+C)
  - Closes database connections cleanly
  - Prevents data corruption during shutdown
*/
process.on('SIGTERM', () => {
  console.log('⚠️  SIGTERM received, shutting down gracefully...')
  process.exit(0)
})

process.on('SIGINT', () => {
  console.log('⚠️  SIGINT received, shutting down gracefully...')
  process.exit(0)
})

/* 
  LEARNING COMMENT: Unhandled Error Catchers
  - Catches promise rejections and exceptions
  - Logs errors and exits gracefully
  - Prevents server from hanging in error states
*/
process.on('unhandledRejection', (err) => {
  console.error('💥 Unhandled Promise Rejection:', err.message)
  console.error('🔍 Full error:', err)
  process.exit(1)
})

process.on('uncaughtException', (err) => {
  console.error('💥 Uncaught Exception:', err.message)
  console.error('🔍 Full error:', err)
  process.exit(1)
})

// Start the server
startServer()

export default app
