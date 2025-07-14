/*
  LEARNING COMMENT: Database Configuration Module
  - Handles PostgreSQL database connection using Prisma ORM
  - Provides database connection management and health checking
  - Supports both local development and AWS RDS production databases
*/

import { PrismaClient } from '@prisma/client'

/* 
  LEARNING COMMENT: Prisma Client Instance
  - PrismaClient is the main interface to your database
  - Auto-generated based on your schema.prisma file
  - Provides type-safe database queries and mutations
  - Handles connection pooling and query optimization
*/
let prisma

/* 
  LEARNING COMMENT: Prisma Client Configuration
  - Different settings for development vs production
  - Logging helps with debugging database queries
  - Error formatting provides better error messages
*/
if (process.env.NODE_ENV === 'production') {
  // Production configuration
  prisma = new PrismaClient({
    log: ['error'], // Only log errors in production
    errorFormat: 'minimal'
  })
} else {
  // Development configuration
  prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error'], // Verbose logging for development
    errorFormat: 'pretty'
  })
}

/* 
  LEARNING COMMENT: Database Connection Function
  - Establishes connection to PostgreSQL database
  - Tests connection with a simple query
  - Handles connection errors gracefully
  - Returns promise for async/await usage
*/
export async function connectDatabase() {
  try {
    // Test database connection
    await prisma.$connect()
    
    // Verify connection with a simple query
    await prisma.$queryRaw`SELECT 1`
    
    console.log('✅ PostgreSQL database connected successfully')
    console.log(`📍 Database: ${getDatabaseInfo()}`)
    
    return prisma
  } catch (error) {
    console.error('❌ Database connection failed:', error.message)
    
    // Provide helpful error messages for common issues
    if (error.message.includes('ECONNREFUSED')) {
      console.error('🔍 Suggestion: Make sure PostgreSQL is running and DATABASE_URL is correct')
    } else if (error.message.includes('authentication failed')) {
      console.error('🔍 Suggestion: Check your database username and password')
    } else if (error.message.includes('database') && error.message.includes('does not exist')) {
      console.error('🔍 Suggestion: Create the database or run migrations')
    }
    
    throw error
  }
}

/* 
  LEARNING COMMENT: Database Disconnection Function
  - Cleanly closes database connection
  - Important for graceful server shutdown
  - Prevents connection leaks
*/
export async function disconnectDatabase() {
  try {
    await prisma.$disconnect()
    console.log('🔌 Database disconnected successfully')
  } catch (error) {
    console.error('❌ Error disconnecting from database:', error.message)
  }
}

/* 
  LEARNING COMMENT: Database Health Check Function
  - Tests if database is responsive
  - Used by health check endpoints
  - Returns connection status information
*/
export async function checkDatabaseHealth() {
  try {
    const startTime = Date.now()
    await prisma.$queryRaw`SELECT 1`
    const responseTime = Date.now() - startTime
    
    return {
      status: 'healthy',
      responseTime: `${responseTime}ms`,
      connection: 'active'
    }
  } catch (error) {
    return {
      status: 'unhealthy',
      error: error.message,
      connection: 'failed'
    }
  }
}

/* 
  LEARNING COMMENT: Database Info Helper
  - Extracts database name and host from connection URL
  - Useful for logging and debugging
  - Masks sensitive information (passwords)
*/
function getDatabaseInfo() {
  const dbUrl = process.env.DATABASE_URL
  if (!dbUrl) return 'No DATABASE_URL configured'
  
  try {
    const url = new URL(dbUrl)
    return `${url.hostname}:${url.port}${url.pathname}`
  } catch {
    return 'Invalid DATABASE_URL format'
  }
}

/* 
  LEARNING COMMENT: Export Prisma Instance
  - Makes prisma client available throughout the application
  - Used in controllers and middleware for database operations
  - Singleton pattern ensures single connection instance
*/
export { prisma }

export const getPrismaClient = () => prisma

export default prisma
