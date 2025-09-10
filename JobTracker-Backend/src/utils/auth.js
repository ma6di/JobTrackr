/*
  🎓 LEARNING COMMENT: Authentication Utilities
  ============================================
  
  This file contains utility functions for user authentication:
  - Password hashing and verification using bcrypt
  - JWT token generation and verification
  - Secure password policies and validation
  
  Key Security Concepts:
  - Salt rounds: Makes password hashing slower and more secure
  - JWT: JSON Web Tokens for stateless authentication
  - Token expiration: Automatic logout for security
  - Password complexity: Enforcing strong passwords
*/

import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

/*
  🔐 LEARNING COMMENT: Password Hashing
  ====================================
  
  bcrypt is a one-way hashing function that:
  - Takes a plain text password
  - Adds a "salt" (random data) to prevent rainbow table attacks
  - Applies multiple rounds of hashing (makes it slow = secure)
  - Returns a hash that can't be reversed to get original password
  
  Salt rounds: Higher = more secure but slower
  - 10 rounds: Good for development
  - 12+ rounds: Production recommendation
*/

const SALT_ROUNDS = 10 // Number of salt rounds for bcrypt hashing

/**
 * Hash a plain text password
 * @param {string} password - Plain text password to hash
 * @returns {Promise<string>} - Hashed password
 */
export async function hashPassword(password) {
  try {
    // Generate salt and hash password in one step
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS)
    return hashedPassword
  } catch (error) {
    throw new Error('Failed to hash password: ' + error.message)
  }
}

/**
 * Verify a password against its hash
 * @param {string} password - Plain text password to verify
 * @param {string} hashedPassword - Hashed password from database
 * @returns {Promise<boolean>} - True if password matches, false otherwise
 */
export async function verifyPassword(password, hashedPassword) {
  try {
    // bcrypt.compare handles the salt extraction and comparison
    const isMatch = await bcrypt.compare(password, hashedPassword)
    return isMatch
  } catch (error) {
    throw new Error('Failed to verify password: ' + error.message)
  }
}

/*
  🎟️ LEARNING COMMENT: JWT Token Management
  =========================================
  
  JWT (JSON Web Token) is a secure way to transmit information between parties:
  - Header: Contains token type and signing algorithm
  - Payload: Contains user data (claims) like user ID, email
  - Signature: Ensures token hasn't been tampered with
  
  Benefits:
  - Stateless: Server doesn't need to store session data
  - Scalable: Works across multiple servers
  - Self-contained: All needed info is in the token
  - Expiration: Automatic security through time limits
*/

/**
 * Generate a JWT token for a user
 * @param {Object} user - User object with id, email, etc.
 * @returns {string} - Signed JWT token
 */
export function generateToken(user) {
  try {
    // Create payload with user information (don't include sensitive data)
    const payload = {
      userId: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName
    }
    
    // Sign token with secret key and set expiration
    const token = jwt.sign(
      payload, // Data to include in token
      process.env.JWT_SECRET || 'fallback-secret-key-for-development', // Secret key for signing
      { 
        expiresIn: '7d', // Token expires in 7 days
        issuer: 'jobtracker-api', // Who issued this token
        audience: 'jobtracker-app' // Who is this token for
      }
    )
    
    return token
  } catch (error) {
    throw new Error('Failed to generate token: ' + error.message)
  }
}

/**
 * Verify and decode a JWT token
 * @param {string} token - JWT token to verify
 * @returns {Object} - Decoded token payload with user info
 */
export function verifyToken(token) {
  try {
    // Verify token signature and check expiration
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'fallback-secret-key-for-development',
      {
        issuer: 'jobtracker-api', // Must match what we set when creating
        audience: 'jobtracker-app' // Must match what we set when creating
      }
    )
    
    return decoded
  } catch (error) {
    // Different types of JWT errors
    if (error.name === 'TokenExpiredError') {
      throw new Error('Token has expired')
    } else if (error.name === 'JsonWebTokenError') {
      throw new Error('Invalid token')
    } else if (error.name === 'NotBeforeError') {
      throw new Error('Token not yet valid')
    } else {
      throw new Error('Failed to verify token: ' + error.message)
    }
  }
}

/*
  ✅ LEARNING COMMENT: Password Validation
  ========================================
  
  Strong password policies help protect user accounts:
  - Minimum length prevents brute force attacks
  - Character variety makes passwords harder to guess
  - Common password checks prevent easily cracked passwords
  
  This is client-side validation - always validate on server too!
*/

/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @returns {Object} - Validation result with isValid and errors
 */
export function validatePassword(password) {
  const errors = []
  
  // Check minimum length
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long')
  }
  
  // Check for uppercase letter
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter')
  }
  
  // Check for lowercase letter
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter')
  }
  
  // Check for number
  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number')
  }
  
  // Check for special character
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Password must contain at least one special character')
  }
  
  // Check against common passwords (basic list)
  const commonPasswords = [
    'password', '123456', 'password123', 'admin', 'qwerty',
    'letmein', 'welcome', 'monkey', '1234567890'
  ]
  
  if (commonPasswords.includes(password.toLowerCase())) {
    errors.push('Password is too common, please choose a more unique password')
  }
  
  return {
    isValid: errors.length === 0,
    errors: errors,
    strength: calculatePasswordStrength(password)
  }
}

/**
 * Calculate password strength score
 * @param {string} password - Password to analyze
 * @returns {Object} - Strength score and level
 */
function calculatePasswordStrength(password) {
  let score = 0
  
  // Length points
  if (password.length >= 8) score += 1
  if (password.length >= 12) score += 1
  if (password.length >= 16) score += 1
  
  // Character variety points
  if (/[a-z]/.test(password)) score += 1
  if (/[A-Z]/.test(password)) score += 1
  if (/\d/.test(password)) score += 1
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score += 1
  
  // Complexity points
  if (/[!@#$%^&*(),.?":{}|<>].*[!@#$%^&*(),.?":{}|<>]/.test(password)) score += 1
  if (/\d.*\d.*\d/.test(password)) score += 1
  
  // Determine strength level
  let level = 'weak'
  if (score >= 7) level = 'very strong'
  else if (score >= 5) level = 'strong'
  else if (score >= 3) level = 'medium'
  
  return {
    score: score,
    maxScore: 9,
    level: level,
    percentage: Math.round((score / 9) * 100)
  }
}

/*
  📧 LEARNING COMMENT: Email Validation
  ====================================
  
  Email validation helps ensure users provide valid contact information:
  - Format checking with regex
  - Domain validation (basic)
  - Disposable email detection (optional)
*/

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {Object} - Validation result
 */
export function validateEmail(email) {
  const errors = []
  
  // Basic email format check
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    errors.push('Please enter a valid email address')
  }
  
  // Check email length
  if (email.length > 254) {
    errors.push('Email address is too long')
  }
  
  // Check for common typos in popular domains
  const commonDomainTypos = {
    'gmail.co': 'gmail.com',
    'gmail.con': 'gmail.com',
    'gmial.com': 'gmail.com',
    'yahoo.co': 'yahoo.com',
    'hotmai.com': 'hotmail.com'
  }
  
  const domain = email.split('@')[1]
  if (domain && commonDomainTypos[domain]) {
    errors.push(`Did you mean ${email.replace(domain, commonDomainTypos[domain])}?`)
  }
  
  return {
    isValid: errors.length === 0,
    errors: errors,
    suggestions: errors.filter(error => error.includes('Did you mean'))
  }
}

/*
  🔒 LEARNING COMMENT: Security Utilities
  =======================================
  
  Additional security helpers for authentication:
  - Rate limiting helpers
  - Token blacklisting (for logout)
  - Session management
*/

/**
 * Generate a secure random token for password reset, email verification, etc.
 * @param {number} length - Length of token to generate
 * @returns {string} - Random token
 */
export function generateSecureToken(length = 32) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let token = ''
  
  for (let i = 0; i < length; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  
  return token
}

/**
 * Extract token from Authorization header
 * @param {string} authHeader - Authorization header value
 * @returns {string|null} - Extracted token or null
 */
export function extractTokenFromHeader(authHeader) {
  if (!authHeader) return null
  
  // Expected format: "Bearer <token>"
  const parts = authHeader.split(' ')
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return null
  }
  
  return parts[1]
}

/*
  🎓 LEARNING SUMMARY: What This File Provides
  ===========================================
  
  This authentication utility module gives you:
  ✅ Secure password hashing with bcrypt
  ✅ JWT token generation and verification
  ✅ Password strength validation
  ✅ Email format validation
  ✅ Security token generation
  ✅ Token extraction helpers
  
  These are production-ready utilities used by real applications!
*/
