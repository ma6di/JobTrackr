/*
  🎓 LEARNING COMMENT: Database-Connected Server
  =============================================
  
  This version of the server includes:
  - Database connection using Prisma ORM
  - Real CRUD operations for users, jobs, and resumes
  - Authentication endpoints (placeholder for now)
  - Error handling for database operations
  - Data validation and sanitization
  
  Key Concepts:
  - Prisma Client: Generated database client
  - async/await: Handling database operations
  - Try/catch: Error handling for database calls
  - HTTP status codes: Proper API responses
  - Input validation: Preventing bad data
*/

// Import required packages
import express from 'express'           // Web framework
import cors from 'cors'                 // Cross-origin resource sharing
import helmet from 'helmet'             // Security headers
import morgan from 'morgan'             // HTTP request logging
import compression from 'compression'   // Response compression
import rateLimit from 'express-rate-limit' // Rate limiting protection
import dotenv from 'dotenv'             // Environment variable loading
import { PrismaClient } from '@prisma/client' // Database client

// Load environment variables from .env file
dotenv.config()

// Create Express application instance
const app = express()
const PORT = process.env.PORT || 5001

// Initialize Prisma Client for database operations
// This connects to our SQLite database defined in .env
const prisma = new PrismaClient()

/*
  🔐 LEARNING COMMENT: Security Middleware
  ========================================
  Same security setup as the simple server, but now we have database access
*/
app.use(helmet())

/*
  🌐 LEARNING COMMENT: CORS Middleware
  ===================================
  Allow React app to communicate with this API server
*/
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))

/*
  📦 LEARNING COMMENT: Body Parsing Middleware
  ===========================================
  Parse JSON and form data from request bodies
*/
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// Compression and logging middleware
app.use(compression())
app.use(morgan('combined'))

/*
  🛡️ LEARNING COMMENT: Rate Limiting
  ==================================
  Protect API endpoints from abuse
*/
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,                 // 100 requests per window
  message: {
    error: 'Too many requests from this IP, please try again later.',
    retryAfter: '15 minutes'
  }
})
app.use('/api/', limiter)

/*
  🏥 LEARNING COMMENT: Health Check with Database
  ==============================================
  Enhanced health check that tests database connection
*/
app.get('/health', async (req, res) => {
  try {
    // Test database connection by counting users
    const userCount = await prisma.user.count()
    
    res.status(200).json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      version: '2.0.0',
      database: {
        connected: true,
        users: userCount
      },
      message: '🎉 Your backend with database is working!'
    })
  } catch (error) {
    // If database connection fails
    res.status(500).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      database: {
        connected: false,
        error: error.message
      },
      message: '❌ Database connection failed'
    })
  }
})

/*
  👤 LEARNING COMMENT: User Management Routes
  ==========================================
  CRUD operations for user accounts
*/

// Get all users (for testing - remove in production)
app.get('/api/users', async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        createdAt: true,
        // Don't include password in response for security
        _count: {
          jobs: true,
          resumes: true
        }
      }
    })
    
    res.json({
      message: '👥 Users retrieved successfully',
      count: users.length,
      users: users
    })
  } catch (error) {
    console.error('Error fetching users:', error)
    res.status(500).json({
      error: 'Failed to fetch users',
      message: error.message
    })
  }
})

// Create a new user (simplified - no password hashing yet)
app.post('/api/users', async (req, res) => {
  try {
    const { email, password, firstName, lastName, phone, location } = req.body
    
    // Basic validation
    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['email', 'password', 'firstName', 'lastName']
      })
    }
    
    // Create user in database
    const user = await prisma.user.create({
      data: {
        email,
        password, // In real app, this would be hashed
        firstName,
        lastName,
        phone: phone || null,
        location: location || null
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        location: true,
        createdAt: true
        // Don't return password
      }
    })
    
    res.status(201).json({
      message: '✅ User created successfully',
      user: user
    })
  } catch (error) {
    console.error('Error creating user:', error)
    
    // Handle unique constraint violation (duplicate email)
    if (error.code === 'P2002') {
      return res.status(409).json({
        error: 'Email already exists',
        message: 'A user with this email address already exists'
      })
    }
    
    res.status(500).json({
      error: 'Failed to create user',
      message: error.message
    })
  }
})

/*
  💼 LEARNING COMMENT: Job Management Routes
  =========================================
  CRUD operations for job applications
*/

// Get all jobs for a user
app.get('/api/jobs', async (req, res) => {
  try {
    // In a real app, we'd get userId from authentication token
    // For now, we'll use a query parameter
    const userId = req.query.userId
    
    if (!userId) {
      return res.status(400).json({
        error: 'Missing userId parameter',
        message: 'Please provide userId as query parameter'
      })
    }
    
    const jobs = await prisma.job.findMany({
      where: {
        userId: parseInt(userId)
      },
      orderBy: {
        createdAt: 'desc' // Newest first
      }
    })
    
    res.json({
      message: '💼 Jobs retrieved successfully',
      count: jobs.length,
      jobs: jobs
    })
  } catch (error) {
    console.error('Error fetching jobs:', error)
    res.status(500).json({
      error: 'Failed to fetch jobs',
      message: error.message
    })
  }
})

// Create a new job application
app.post('/api/jobs', async (req, res) => {
  try {
    const {
      userId, company, position, location, jobType, salary,
      description, requirements, applicationUrl, status, priority, notes
    } = req.body
    
    // Basic validation
    if (!userId || !company || !position) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['userId', 'company', 'position']
      })
    }
    
    // Create job in database
    const job = await prisma.job.create({
      data: {
        userId: parseInt(userId),
        company,
        position,
        location: location || null,
        jobType: jobType || null,
        salary: salary || null,
        description: description || null,
        requirements: requirements || null,
        applicationUrl: applicationUrl || null,
        status: status || 'wishlist',
        priority: priority || 'medium',
        notes: notes || null
      }
    })
    
    res.status(201).json({
      message: '✅ Job application created successfully',
      job: job
    })
  } catch (error) {
    console.error('Error creating job:', error)
    res.status(500).json({
      error: 'Failed to create job application',
      message: error.message
    })
  }
})

// Update a job application
app.put('/api/jobs/:id', async (req, res) => {
  try {
    const jobId = parseInt(req.params.id)
    const updateData = req.body
    
    // Remove undefined fields
    Object.keys(updateData).forEach(key => {
      if (updateData[key] === undefined) {
        delete updateData[key]
      }
    })
    
    const job = await prisma.job.update({
      where: { id: jobId },
      data: updateData
    })
    
    res.json({
      message: '📝 Job application updated successfully',
      job: job
    })
  } catch (error) {
    console.error('Error updating job:', error)
    
    if (error.code === 'P2025') {
      return res.status(404).json({
        error: 'Job not found',
        message: 'Job application with this ID does not exist'
      })
    }
    
    res.status(500).json({
      error: 'Failed to update job application',
      message: error.message
    })
  }
})

// Delete a job application
app.delete('/api/jobs/:id', async (req, res) => {
  try {
    const jobId = parseInt(req.params.id)
    
    await prisma.job.delete({
      where: { id: jobId }
    })
    
    res.json({
      message: '🗑️ Job application deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting job:', error)
    
    if (error.code === 'P2025') {
      return res.status(404).json({
        error: 'Job not found',
        message: 'Job application with this ID does not exist'
      })
    }
    
    res.status(500).json({
      error: 'Failed to delete job application',
      message: error.message
    })
  }
})

/*
  📄 LEARNING COMMENT: Resume Management Routes
  ============================================
  CRUD operations for resume files (without file upload for now)
*/

// Get all resumes for a user
app.get('/api/resumes', async (req, res) => {
  try {
    const userId = req.query.userId
    
    if (!userId) {
      return res.status(400).json({
        error: 'Missing userId parameter',
        message: 'Please provide userId as query parameter'
      })
    }
    
    const resumes = await prisma.resume.findMany({
      where: {
        userId: parseInt(userId)
      },
      orderBy: {
        createdAt: 'desc'
      }
    })
    
    res.json({
      message: '📄 Resumes retrieved successfully',
      count: resumes.length,
      resumes: resumes
    })
  } catch (error) {
    console.error('Error fetching resumes:', error)
    res.status(500).json({
      error: 'Failed to fetch resumes',
      message: error.message
    })
  }
})

// Create resume metadata (file upload will be added later)
app.post('/api/resumes', async (req, res) => {
  try {
    const {
      userId, title, originalName, fileName, s3Url,
      fileSize, mimeType, resumeType, description
    } = req.body
    
    // Basic validation
    if (!userId || !title || !originalName || !fileName || !s3Url || !fileSize || !mimeType) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['userId', 'title', 'originalName', 'fileName', 's3Url', 'fileSize', 'mimeType']
      })
    }
    
    const resume = await prisma.resume.create({
      data: {
        userId: parseInt(userId),
        title,
        originalName,
        fileName,
        s3Url,
        fileSize: parseInt(fileSize),
        mimeType,
        resumeType: resumeType || 'general',
        description: description || null
      }
    })
    
    res.status(201).json({
      message: '✅ Resume created successfully',
      resume: resume
    })
  } catch (error) {
    console.error('Error creating resume:', error)
    res.status(500).json({
      error: 'Failed to create resume',
      message: error.message
    })
  }
})

/*
  🔍 LEARNING COMMENT: Search and Filter Routes
  ============================================
  Advanced queries for finding specific data
*/

// Search jobs by company or position
app.get('/api/search/jobs', async (req, res) => {
  try {
    const { userId, query, status, priority } = req.query
    
    if (!userId) {
      return res.status(400).json({
        error: 'Missing userId parameter'
      })
    }
    
    // Build search filters
    const where = {
      userId: parseInt(userId),
      ...(status && { status }),
      ...(priority && { priority }),
      ...(query && {
        OR: [
          { company: { contains: query, mode: 'insensitive' } },
          { position: { contains: query, mode: 'insensitive' } }
        ]
      })
    }
    
    const jobs = await prisma.job.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    })
    
    res.json({
      message: '🔍 Job search completed',
      query: query || 'all',
      filters: { status, priority },
      count: jobs.length,
      jobs: jobs
    })
  } catch (error) {
    console.error('Error searching jobs:', error)
    res.status(500).json({
      error: 'Failed to search jobs',
      message: error.message
    })
  }
})

/*
  📊 LEARNING COMMENT: Statistics Routes
  =====================================
  Dashboard data and analytics
*/

// Get user dashboard statistics
app.get('/api/dashboard/:userId', async (req, res) => {
  try {
    const userId = parseInt(req.params.userId)
    
    // Get counts for different job statuses
    const [
      totalJobs,
      appliedJobs,
      interviewingJobs,
      offeredJobs,
      totalResumes,
      user
    ] = await Promise.all([
      prisma.job.count({ where: { userId } }),
      prisma.job.count({ where: { userId, status: 'applied' } }),
      prisma.job.count({ where: { userId, status: 'interviewing' } }),
      prisma.job.count({ where: { userId, status: 'offered' } }),
      prisma.resume.count({ where: { userId } }),
      prisma.user.findUnique({ 
        where: { id: userId },
        select: { firstName: true, lastName: true }
      })
    ])
    
    if (!user) {
      return res.status(404).json({
        error: 'User not found'
      })
    }
    
    res.json({
      message: '📊 Dashboard statistics retrieved',
      user: user,
      statistics: {
        jobs: {
          total: totalJobs,
          applied: appliedJobs,
          interviewing: interviewingJobs,
          offered: offeredJobs
        },
        resumes: {
          total: totalResumes
        }
      }
    })
  } catch (error) {
    console.error('Error fetching dashboard:', error)
    res.status(500).json({
      error: 'Failed to fetch dashboard statistics',
      message: error.message
    })
  }
})

/*
  🚫 LEARNING COMMENT: 404 Handler
  ================================
  Enhanced 404 handler with database-aware routes
*/
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.method} ${req.originalUrl} not found`,
    availableRoutes: [
      'GET /health - Server and database health check',
      'GET /api/users - Get all users',
      'POST /api/users - Create new user',
      'GET /api/jobs?userId=1 - Get user jobs',
      'POST /api/jobs - Create job application',
      'PUT /api/jobs/:id - Update job application',
      'DELETE /api/jobs/:id - Delete job application',
      'GET /api/resumes?userId=1 - Get user resumes',
      'POST /api/resumes - Create resume metadata',
      'GET /api/search/jobs?userId=1&query=google - Search jobs',
      'GET /api/dashboard/:userId - Get dashboard statistics'
    ],
    tip: 'Try visiting /health to test database connection'
  })
})

/*
  ⚠️ LEARNING COMMENT: Global Error Handler
  =========================================
  Enhanced error handler for database and application errors
*/
app.use((err, req, res, next) => {
  console.error('🚨 Error occurred:', err.message)
  console.error('Stack trace:', err.stack)
  
  // Handle Prisma-specific errors
  if (err.code?.startsWith('P')) {
    return res.status(500).json({
      error: 'Database error',
      code: err.code,
      message: 'A database operation failed',
      timestamp: new Date().toISOString(),
      ...(process.env.NODE_ENV === 'development' && { 
        details: err.message,
        stack: err.stack 
      })
    })
  }
  
  res.status(err.status || 500).json({
    error: 'Something went wrong!',
    message: err.message,
    timestamp: new Date().toISOString(),
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  })
})

/*
  🚀 LEARNING COMMENT: Start Server with Database Connection
  =========================================================
  Enhanced startup that tests database connection
*/
async function startServer() {
  try {
    // Test database connection
    await prisma.$connect()
    console.log('✅ Database connected successfully')
    
    // Start HTTP server
    app.listen(PORT, () => {
      console.log('')
      console.log('🎉 JobTracker Backend with Database Started!')
      console.log('================================================')
      console.log(`🌐 Server running on: http://localhost:${PORT}`)
      console.log(`🗄️ Database: SQLite (dev.db)`)
      console.log(`📍 Health check: http://localhost:${PORT}/health`)
      console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`)
      console.log(`⏰ Started at: ${new Date().toISOString()}`)
      console.log('================================================')
      console.log('')
      console.log('🎯 Try these new database endpoints:')
      console.log(`   • http://localhost:${PORT}/health`)
      console.log(`   • http://localhost:${PORT}/api/users`)
      console.log(`   • http://localhost:${PORT}/api/jobs?userId=1`)
      console.log(`   • http://localhost:${PORT}/api/dashboard/1`)
      console.log('')
      console.log('📝 Create test data with POST requests to:')
      console.log('   • POST /api/users (create user)')
      console.log('   • POST /api/jobs (create job application)')
      console.log('')
      console.log('🎓 Learning: Your app now has real data persistence!')
      console.log('')
    })
  } catch (error) {
    console.error('❌ Failed to start server:', error)
    process.exit(1)
  }
}

// Handle graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Shutting down server...')
  await prisma.$disconnect()
  console.log('✅ Database disconnected')
  process.exit(0)
})

// Start the server
startServer()

export default app
