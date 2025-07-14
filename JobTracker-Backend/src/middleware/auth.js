/*
  🎓 LEARNING COMMENT: Authentication Middleware
  =============================================
  
  Middleware functions that run between the request and response:
  - Check if user is authenticated (has valid token)
  - Extract user information from token
  - Protect routes that require authentication
  - Handle authentication errors gracefully
  
  How Middleware Works:
  1. Request comes in → Middleware runs → Route handler runs → Response sent
  2. Middleware can modify req/res objects or stop the chain
  3. next() continues to next middleware, next(error) triggers error handler
*/

import { verifyToken, extractTokenFromHeader } from '../utils/auth.js'

/*
  🔐 LEARNING COMMENT: Authentication Middleware Function
  ======================================================
  
  This middleware:
  1. Extracts JWT token from Authorization header
  2. Verifies the token is valid and not expired
  3. Adds user info to req.user for use in route handlers
  4. Blocks access if no valid token is provided
  
  Usage: app.get('/protected-route', requireAuth, (req, res) => {...})
*/

/**
 * Middleware to require authentication for protected routes
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object  
 * @param {Function} next - Next middleware function
 */
export function requireAuth(req, res, next) {
  try {
    // Extract token from Authorization header
    const authHeader = req.headers.authorization
    const token = extractTokenFromHeader(authHeader)
    
    // Check if token exists
    if (!token) {
      return res.status(401).json({
        error: 'Authentication required',
        message: 'Please provide a valid authorization token',
        code: 'NO_TOKEN'
      })
    }
    
    // Verify and decode the token
    const decoded = verifyToken(token)
    
    // Add user information to request object for use in route handlers
    req.user = {
      id: decoded.userId,
      email: decoded.email,
      firstName: decoded.firstName,
      lastName: decoded.lastName
    }
    
    // Continue to next middleware/route handler
    next()
    
  } catch (error) {
    console.error('Authentication error:', error.message)
    
    // Handle different types of authentication errors
    let statusCode = 401
    let errorCode = 'AUTH_FAILED'
    let message = 'Authentication failed'
    
    if (error.message.includes('expired')) {
      errorCode = 'TOKEN_EXPIRED'
      message = 'Your session has expired, please log in again'
    } else if (error.message.includes('invalid')) {
      errorCode = 'INVALID_TOKEN'
      message = 'Invalid authentication token'
    }
    
    return res.status(statusCode).json({
      error: 'Authentication failed',
      message: message,
      code: errorCode
    })
  }
}

/*
  🔓 LEARNING COMMENT: Optional Authentication Middleware
  ======================================================
  
  This middleware allows but doesn't require authentication:
  - If token is provided and valid, adds user info to req.user
  - If no token or invalid token, continues without user info
  - Useful for routes that work differently for logged in vs anonymous users
  
  Example: Public job listings that show "Apply" button only for logged in users
*/

/**
 * Middleware for optional authentication (user info if available)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Next middleware function
 */
export function optionalAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization
    const token = extractTokenFromHeader(authHeader)
    
    // If no token, continue without user info
    if (!token) {
      req.user = null
      return next()
    }
    
    // Try to verify token
    const decoded = verifyToken(token)
    req.user = {
      id: decoded.userId,
      email: decoded.email,
      firstName: decoded.firstName,
      lastName: decoded.lastName
    }
    
    next()
    
  } catch (error) {
    // If token is invalid, continue without user info (don't block request)
    console.warn('Optional auth failed:', error.message)
    req.user = null
    next()
  }
}

/*
  👤 LEARNING COMMENT: User Authorization Middleware
  =================================================
  
  Authorization vs Authentication:
  - Authentication: "Who are you?" (login verification)
  - Authorization: "What can you do?" (permission checking)
  
  This middleware checks if the authenticated user has permission
  to access/modify specific resources (like their own data only).
*/

/**
 * Middleware to check if user can access their own resources
 * @param {string} userIdParam - Name of URL parameter containing user ID
 * @returns {Function} - Middleware function
 */
export function requireOwnership(userIdParam = 'userId') {
  return (req, res, next) => {
    try {
      // Must be authenticated first
      if (!req.user) {
        return res.status(401).json({
          error: 'Authentication required',
          message: 'Please log in to access this resource',
          code: 'NOT_AUTHENTICATED'
        })
      }
      
      // Get the user ID from URL parameters or request body
      const resourceUserId = req.params[userIdParam] || req.body[userIdParam]
      
      // Check if user is trying to access their own data
      if (parseInt(resourceUserId) !== req.user.id) {
        return res.status(403).json({
          error: 'Access denied',
          message: 'You can only access your own data',
          code: 'INSUFFICIENT_PERMISSIONS'
        })
      }
      
      next()
      
    } catch (error) {
      console.error('Authorization error:', error.message)
      return res.status(500).json({
        error: 'Authorization check failed',
        message: error.message
      })
    }
  }
}

/*
  📊 LEARNING COMMENT: Admin Authorization Middleware
  ==================================================
  
  Some routes should only be accessible by admin users:
  - User management endpoints
  - System statistics
  - Database maintenance operations
  
  This checks for admin role in user's JWT token.
*/

/**
 * Middleware to require admin role
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Next middleware function
 */
export function requireAdmin(req, res, next) {
  try {
    // Must be authenticated first
    if (!req.user) {
      return res.status(401).json({
        error: 'Authentication required',
        message: 'Please log in to access this resource',
        code: 'NOT_AUTHENTICATED'
      })
    }
    
    // Check if user has admin role (this would be in their JWT token)
    if (!req.user.isAdmin) {
      return res.status(403).json({
        error: 'Admin access required',
        message: 'This endpoint requires administrator privileges',
        code: 'ADMIN_REQUIRED'
      })
    }
    
    next()
    
  } catch (error) {
    console.error('Admin authorization error:', error.message)
    return res.status(500).json({
      error: 'Authorization check failed',
      message: error.message
    })
  }
}

/*
  ⏰ LEARNING COMMENT: Rate Limiting Middleware
  ============================================
  
  Prevent abuse of authentication endpoints:
  - Login attempts (prevent brute force)
  - Registration attempts (prevent spam)
  - Password reset requests (prevent flooding)
  
  This creates specific rate limits for sensitive operations.
*/

/**
 * Create rate limiting middleware for authentication endpoints
 * @param {Object} options - Rate limiting options
 * @returns {Function} - Rate limiting middleware
 */
export function createAuthRateLimit(options = {}) {
  const defaults = {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // 5 attempts per window
    skipSuccessfulRequests: true, // Don't count successful logins
    message: {
      error: 'Too many authentication attempts',
      message: 'Please wait before trying again',
      retryAfter: '15 minutes'
    }
  }
  
  return function(req, res, next) {
    // Simple in-memory rate limiting (in production, use Redis)
    const key = req.ip + ':' + req.route?.path
    const now = Date.now()
    
    // Initialize or get existing attempt data
    if (!req.app.locals.authAttempts) {
      req.app.locals.authAttempts = new Map()
    }
    
    const attempts = req.app.locals.authAttempts.get(key) || { count: 0, resetTime: now }
    
    // Reset if window has passed
    if (now > attempts.resetTime) {
      attempts.count = 0
      attempts.resetTime = now + (options.windowMs || defaults.windowMs)
    }
    
    // Check if limit exceeded
    if (attempts.count >= (options.max || defaults.max)) {
      return res.status(429).json(options.message || defaults.message)
    }
    
    // Increment attempt count
    attempts.count++
    req.app.locals.authAttempts.set(key, attempts)
    
    next()
  }
}

/*
  🎓 LEARNING SUMMARY: Middleware Concepts
  =======================================
  
  This file demonstrates key middleware patterns:
  ✅ Authentication checking (requireAuth)
  ✅ Optional authentication (optionalAuth)  
  ✅ Authorization/permissions (requireOwnership)
  ✅ Role-based access (requireAdmin)
  ✅ Rate limiting (createAuthRateLimit)
  
  Middleware Chain Example:
  app.post('/api/jobs', 
    createAuthRateLimit(),     // 1. Check rate limits
    requireAuth,               // 2. Verify authentication
    requireOwnership('userId'), // 3. Check permissions
    (req, res) => {            // 4. Handle request
      // req.user is available here
      // Create job for authenticated user
    }
  )
  
  This is how professional APIs protect resources and manage access!
*/
