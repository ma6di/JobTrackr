/*
  LEARNING COMMENT: Global Error Handler Middleware
  - Catches all unhandled errors in Express application
  - Provides consistent error response format
  - Logs errors for debugging while protecting sensitive information
  - Different behavior for development vs production environments
*/

/* 
  LEARNING COMMENT: Error Handler Function
  - Express error middleware has 4 parameters: (err, req, res, next)
  - Must have all 4 parameters for Express to recognize it as error handler
  - Processes errors from routes, middleware, and async operations
*/
const errorHandler = (err, req, res, next) => {
  /* 
    LEARNING COMMENT: Error Logging
    - Logs full error details to console for debugging
    - Includes request information for context
    - Stack trace helps identify error source
  */
  console.error('🚨 Error occurred:')
  console.error('📍 Route:', req.method, req.originalUrl)
  console.error('🔍 Error:', err.message)
  console.error('📊 Stack:', err.stack)
  
  /* 
    LEARNING COMMENT: Error Status Code Determination
    - Uses error.status or error.statusCode if available
    - Defaults to 500 (Internal Server Error) for unknown errors
    - Maintains proper HTTP status codes for API responses
  */
  let statusCode = err.status || err.statusCode || 500
  let message = err.message || 'Internal Server Error'

  /* 
    LEARNING COMMENT: Handle Specific Error Types
    - Different error types require different responses
    - Provides user-friendly messages for common errors
    - Maintains security by not exposing sensitive details
  */

  // Prisma/Database Errors
  if (err.code === 'P2002') {
    // Unique constraint violation
    statusCode = 409
    message = 'A record with this information already exists'
  } else if (err.code === 'P2025') {
    // Record not found
    statusCode = 404
    message = 'Record not found'
  } else if (err.code === 'P2003') {
    // Foreign key constraint violation
    statusCode = 400
    message = 'Cannot perform this action due to related records'
  }

  // JWT Authentication Errors
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401
    message = 'Invalid token. Please log in again.'
  } else if (err.name === 'TokenExpiredError') {
    statusCode = 401
    message = 'Token expired. Please log in again.'
  }

  // Validation Errors
  if (err.name === 'ValidationError') {
    statusCode = 400
    message = 'Validation failed'
    
    // Extract validation details if available
    if (err.errors) {
      const validationErrors = Object.values(err.errors).map(e => e.message)
      message = `Validation failed: ${validationErrors.join(', ')}`
    }
  }

  // Multer File Upload Errors
  if (err.code === 'LIMIT_FILE_SIZE') {
    statusCode = 413
    message = 'File too large. Maximum size is 10MB.'
  } else if (err.code === 'LIMIT_UNEXPECTED_FILE') {
    statusCode = 400
    message = 'Unexpected file field'
  }

  // AWS/S3 Errors
  if (err.code === 'NoSuchBucket') {
    statusCode = 500
    message = 'File storage is temporarily unavailable'
  } else if (err.code === 'AccessDenied') {
    statusCode = 500
    message = 'File storage access denied'
  }

  /* 
    LEARNING COMMENT: Error Response Structure
    - Consistent JSON response format for all errors
    - Includes error type, message, and optional details
    - Different information provided based on environment
  */
  const errorResponse = {
    error: {
      type: err.name || 'Error',
      message: message,
      statusCode: statusCode
    }
  }

  /* 
    LEARNING COMMENT: Development vs Production Error Details
    - Development: Include full error details for debugging
    - Production: Hide sensitive information from users
    - Stack traces can reveal internal application structure
  */
  if (process.env.NODE_ENV === 'development') {
    // Include detailed error information in development
    errorResponse.error.details = {
      originalMessage: err.message,
      stack: err.stack,
      code: err.code,
      path: req.originalUrl,
      method: req.method,
      timestamp: new Date().toISOString()
    }
  } else {
    // Production: minimal error information
    errorResponse.error.timestamp = new Date().toISOString()
    errorResponse.error.requestId = req.id || 'unknown' // If you add request ID middleware
  }

  /* 
    LEARNING COMMENT: Add Helpful Error Messages
    - Provides actionable guidance for common errors
    - Helps users understand what went wrong and how to fix it
    - Improves user experience with meaningful error responses
  */
  if (statusCode === 401) {
    errorResponse.error.suggestion = 'Please log in again or check your authentication credentials'
  } else if (statusCode === 403) {
    errorResponse.error.suggestion = 'You do not have permission to access this resource'
  } else if (statusCode === 404) {
    errorResponse.error.suggestion = 'The requested resource could not be found'
  } else if (statusCode === 429) {
    errorResponse.error.suggestion = 'You are making too many requests. Please wait and try again.'
  } else if (statusCode >= 500) {
    errorResponse.error.suggestion = 'This is a server error. Please try again later or contact support if the problem persists.'
  }

  /* 
    LEARNING COMMENT: Send Error Response
    - Sets appropriate HTTP status code
    - Sends JSON error response to client
    - Ends the request-response cycle
  */
  res.status(statusCode).json(errorResponse)
}

/* 
  LEARNING COMMENT: Async Error Wrapper
  - Utility function to catch errors in async route handlers
  - Eliminates need for try-catch blocks in every async route
  - Automatically passes errors to error handler middleware
*/
export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next)
}

/* 
  LEARNING COMMENT: Not Found Handler
  - Specifically handles 404 errors for unknown routes
  - Creates proper Error object with 404 status
  - Can be used before the general error handler
*/
export const notFoundHandler = (req, res, next) => {
  const error = new Error(`Route ${req.method} ${req.originalUrl} not found`)
  error.status = 404
  next(error)
}

export default errorHandler
