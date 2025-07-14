/*
 * JobTracker Backend Server with Authentication
 * 
 * This file creates an Express server that includes:
 * 1. Database connection (Prisma + SQLite)
 * 2. Authentication system (JWT + bcrypt)
 * 3. Protected routes for jobs, resumes, and user data
 * 4. Public authentication endpoints (login, register)
 * 
 * Learning Focus: Understanding how authentication integrates with a REST API
 */

// Import required packages (ES modules syntax)
import express from 'express'; // Web framework for Node.js
import cors from 'cors'; // Enable cross-origin requests (for frontend)
import helmet from 'helmet'; // Security middleware
import morgan from 'morgan'; // HTTP request logger
import dotenv from 'dotenv'; // Environment variable loader

// Load environment variables from .env file
dotenv.config();

// Import our custom modules (ES modules syntax)
import { PrismaClient } from '@prisma/client'; // Database ORM client
import errorHandler from './middleware/errorHandler.js'; // Global error handling
import { requireAuth } from './middleware/auth.js'; // Authentication middleware

// Import route handlers (ES modules syntax)
import authRoutes from './routes/auth.js'; // Authentication routes (login, register, etc.)
import userRoutes from './routes/users.js'; // User management routes
import jobRoutes from './routes/jobs.js'; // Job tracking routes
import resumeRoutes from './routes/resumes.js'; // Resume management routes

// Import file upload utilities
import { ensureUploadDirectories, cleanupTempFiles } from './utils/fileUpload.js';

// Initialize Express application
const app = express();

// Initialize Prisma client for database operations
const prisma = new PrismaClient();

/*
 * MIDDLEWARE SETUP
 * Middleware functions run between the request and response
 * They can modify the request, response, or terminate the request-response cycle
 */

// Security middleware - sets various HTTP headers to secure the app
app.use(helmet());

// CORS middleware - allows frontend (different port/domain) to make requests
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173', // Vite default port
  credentials: true // Allow cookies to be sent with requests
}));

// Body parsing middleware - converts JSON in request body to JavaScript objects
app.use(express.json({ limit: '50mb' })); // Increased limit for file uploads later

// URL encoding middleware - parses URL-encoded data (form submissions)
app.use(express.urlencoded({ extended: true }));

// Logging middleware - logs all HTTP requests in development
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev')); // 'dev' format: method url status response-time
}

/*
 * MAKE PRISMA AVAILABLE TO ALL ROUTES
 * This attaches the database client to the request object
 * so all route handlers can access it via req.prisma
 */
app.use((req, res, next) => {
  req.prisma = prisma; // Attach Prisma client to request
  next(); // Continue to next middleware
});

/*
 * ROUTES SETUP
 * Routes define the endpoints our API responds to
 */

// Health check endpoint - always accessible, no authentication required
app.get('/api/health', (req, res) => {
  res.json({ 
    message: 'JobTracker API is running!',
    timestamp: new Date().toISOString(),
    authentication: 'enabled'
  });
});

// Authentication routes - public endpoints (no JWT required)
// These handle user registration, login, logout, etc.
app.use('/api/auth', authRoutes);

/*
 * PROTECTED ROUTES
 * All routes below this point require JWT authentication
 * The authMiddleware.authenticate function checks for valid JWT tokens
 */

// User management routes - requires authentication
// Examples: GET /api/users/profile, PUT /api/users/profile
app.use('/api/users', requireAuth, userRoutes);

// Job tracking routes - requires authentication
// Examples: GET /api/jobs, POST /api/jobs, PUT /api/jobs/:id
app.use('/api/jobs', requireAuth, jobRoutes);

// Resume management routes - requires authentication
// Examples: GET /api/resumes, POST /api/resumes, DELETE /api/resumes/:id
app.use('/api/resumes', requireAuth, resumeRoutes);

// Dashboard statistics endpoint - requires authentication
app.get('/api/dashboard/stats', requireAuth, async (req, res) => {
  try {
    // Get the authenticated user's ID from the JWT token
    // (authMiddleware.authenticate adds req.user to the request)
    const userId = req.user.id;

    // Count total jobs for this user
    const totalJobs = await req.prisma.job.count({
      where: { userId: userId }
    });

    // Count jobs by status for this user
    const appliedJobs = await req.prisma.job.count({
      where: { 
        userId: userId,
        status: 'applied' 
      }
    });

    const interviewJobs = await req.prisma.job.count({
      where: { 
        userId: userId,
        status: 'interview' 
      }
    });

    const rejectedJobs = await req.prisma.job.count({
      where: { 
        userId: userId,
        status: 'rejected' 
      }
    });

    const offeredJobs = await req.prisma.job.count({
      where: { 
        userId: userId,
        status: 'offer' 
      }
    });

    // Count total resumes for this user
    const totalResumes = await req.prisma.resume.count({
      where: { userId: userId }
    });

    // Calculate success rate (offers / total applications)
    const successRate = totalJobs > 0 ? ((offeredJobs / totalJobs) * 100).toFixed(1) : 0;

    // Return dashboard statistics
    res.json({
      totalJobs,
      totalResumes,
      jobStats: {
        applied: appliedJobs,
        interview: interviewJobs,
        rejected: rejectedJobs,
        offer: offeredJobs
      },
      successRate: `${successRate}%`
    });

  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch dashboard statistics',
      details: error.message 
    });
  }
});

/*
 * ERROR HANDLING
 * These handlers catch any errors that occur in routes above
 */

// 404 handler - when no route matches the request
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Route not found',
    method: req.method,
    path: req.originalUrl
  });
});

// Global error handler - catches all other errors
app.use(errorHandler);

/*
 * STARTUP INITIALIZATION
 * Initialize file upload directories and cleanup old temp files
 */

// Initialize upload directories and cleanup temp files
async function initializeServer() {
  try {
    await ensureUploadDirectories()
    await cleanupTempFiles(24) // Clean files older than 24 hours
    console.log('🗂️ File upload system initialized')
  } catch (error) {
    console.error('❌ File upload initialization error:', error)
  }
}

// Initialize file upload system
await initializeServer()

/*
 * SERVER STARTUP
 * Start the server and handle graceful shutdown
 */

const PORT = process.env.PORT || 3001; // Use environment variable or default

// Start the server
const server = app.listen(PORT, () => {
  console.log(`
🚀 JobTracker Backend Server with Authentication is running!
📍 URL: http://localhost:${PORT}
🔒 Authentication: JWT enabled
📊 Database: SQLite (Prisma)
🌍 Environment: ${process.env.NODE_ENV || 'development'}

Available endpoints:
📊 GET  /api/health              - Health check (public)
🔐 POST /api/auth/register       - User registration (public)
🔐 POST /api/auth/login          - User login (public)
🔐 POST /api/auth/logout         - User logout (protected)
👤 GET  /api/users/profile       - Get user profile (protected)
👤 PUT  /api/users/profile       - Update profile (protected)
💼 GET  /api/jobs                - List user's jobs (protected)
💼 POST /api/jobs                - Create new job (protected)
📄 GET  /api/resumes             - List user's resumes (protected)
📄 POST /api/resumes             - Create new resume (protected)
📈 GET  /api/dashboard/stats     - Dashboard statistics (protected)

Test with: curl http://localhost:${PORT}/api/health
  `);
});

/*
 * GRACEFUL SHUTDOWN
 * Handle process termination signals to close database connections cleanly
 */

// Handle CTRL+C (SIGINT)
process.on('SIGINT', async () => {
  console.log('\n🛑 Shutting down server gracefully...');
  
  // Close Prisma connection
  await prisma.$disconnect();
  console.log('📊 Database connection closed');
  
  // Close HTTP server
  server.close(() => {
    console.log('🚀 HTTP server closed');
    process.exit(0);
  });
});

// Handle kill signal (SIGTERM)
process.on('SIGTERM', async () => {
  console.log('\n🛑 Received SIGTERM, shutting down gracefully...');
  
  // Close Prisma connection
  await prisma.$disconnect();
  console.log('📊 Database connection closed');
  
  // Close HTTP server
  server.close(() => {
    console.log('🚀 HTTP server closed');
    process.exit(0);
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', async (error) => {
  console.error('❌ Uncaught Exception:', error);
  
  // Close Prisma connection
  await prisma.$disconnect();
  
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', async (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  
  // Close Prisma connection
  await prisma.$disconnect();
  
  process.exit(1);
});

// Export app for testing purposes
export default app;
