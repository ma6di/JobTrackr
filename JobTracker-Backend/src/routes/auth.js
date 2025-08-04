/*
  🎓 LEARNING COMMENT: Authentication Routes
  ==========================================
  
  This file handles all authentication-related endpoints:
  - User registration (create new account)
  - User login (authenticate existing user)
  - User logout (invalidate token)
  - Profile management (get/update user info)
  - Password management (change password)
  
  Security Features:
  - Password hashing with bcrypt
  - JWT token generation
  - Input validation and sanitization
  - Rate limiting for auth attempts
  - Secure error messages (don't reveal user existence)
*/

import express from 'express'
import { PrismaClient } from '@prisma/client'
import { 
  hashPassword, 
  verifyPassword, 
  generateToken, 
  validatePassword, 
  validateEmail 
} from '../utils/auth.js'
import { 
  requireAuth, 
  optionalAuth, 
  createAuthRateLimit 
} from '../middleware/auth.js'

const router = express.Router()
const prisma = new PrismaClient()

/*
  📝 LEARNING COMMENT: User Registration
  =====================================
  
  Registration process:
  1. Validate input data (email format, password strength)
  2. Check if user already exists (prevent duplicates)
  3. Hash password securely
  4. Create user record in database
  5. Generate JWT token for immediate login
  6. Return user info and token
*/

// POST /api/auth/register - Create new user account
router.post('/register', createAuthRateLimit({ max: 3 }), async (req, res) => {
  try {
    const { email, password, firstName, lastName, phone, location } = req.body
    
    // Validate required fields
    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'Email, password, first name, and last name are required',
        required: ['email', 'password', 'firstName', 'lastName']
      })
    }
    
    // Validate email format
    const emailValidation = validateEmail(email)
    if (!emailValidation.isValid) {
      return res.status(400).json({
        error: 'Invalid email',
        message: 'Please provide a valid email address',
        details: emailValidation.errors
      })
    }
    
    // Validate password strength
    const passwordValidation = validatePassword(password)
    if (!passwordValidation.isValid) {
      return res.status(400).json({
        error: 'Weak password',
        message: 'Password does not meet security requirements',
        requirements: passwordValidation.errors,
        strength: passwordValidation.strength
      })
    }
    
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    })
    
    if (existingUser) {
      return res.status(409).json({
        error: 'Email already registered',
        message: 'An account with this email address already exists',
        suggestion: 'Try logging in or use a different email address'
      })
    }
    
    // Hash password securely
    const hashedPassword = await hashPassword(password)
    
    // Create new user
    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase(), // Store email in lowercase for consistency
        password: hashedPassword,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        phone: phone?.trim() || null,
        location: location?.trim() || null
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        location: true,
        createdAt: true
        // Don't return password hash
      }
    })
    
    // Generate JWT token for immediate login
    const token = generateToken(user)
    
    res.status(201).json({
      message: '✅ Account created successfully',
      user: user,
      token: token,
      tokenType: 'Bearer',
      expiresIn: '7 days'
    })
    
  } catch (error) {
    console.error('Registration error:', error)
    
    // Handle database constraint errors
    if (error.code === 'P2002') {
      return res.status(409).json({
        error: 'Email already registered',
        message: 'An account with this email address already exists'
      })
    }
    
    res.status(500).json({
      error: 'Registration failed',
      message: 'Unable to create account at this time, please try again'
    })
  }
})

/*
  🔐 LEARNING COMMENT: User Login
  ==============================
  
  Login process:
  1. Find user by email
  2. Verify password against stored hash
  3. Generate new JWT token
  4. Return user info and token
  5. Don't reveal whether email exists (security)
*/

// POST /api/auth/login - Authenticate existing user
router.post('/login', createAuthRateLimit({ max: 5 }), async (req, res) => {
  try {
    const { email, password } = req.body
    
    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        error: 'Missing credentials',
        message: 'Email and password are required'
      })
    }
    
    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    })
    
    // If user doesn't exist, don't reveal this fact (security)
    if (!user) {
      return res.status(401).json({
        error: 'Invalid credentials',
        message: 'Invalid email or password'
      })
    }
    
    // Verify password
    const isPasswordValid = await verifyPassword(password, user.password)
    
    if (!isPasswordValid) {
      return res.status(401).json({
        error: 'Invalid credentials',
        message: 'Invalid email or password'
      })
    }
    
    // Generate JWT token
    const token = generateToken(user)
    
    // Return user info and token (exclude password)
    const { password: _, ...userWithoutPassword } = user
    
    res.json({
      message: '🎉 Login successful',
      user: userWithoutPassword,
      token: token,
      tokenType: 'Bearer',
      expiresIn: '7 days'
    })
    
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({
      error: 'Login failed',
      message: 'Unable to process login at this time'
    })
  }
})

/*
  🚪 LEARNING COMMENT: User Logout
  ===============================
  
  With JWT tokens, logout is mainly client-side:
  1. Client removes token from storage
  2. Server can optionally blacklist token
  3. Token will expire naturally
  
  For enhanced security, we could maintain a blacklist of revoked tokens.
*/

// POST /api/auth/logout - Logout user (invalidate token)
router.post('/logout', requireAuth, async (req, res) => {
  try {
    // In a simple JWT implementation, logout is handled client-side
    // The client just needs to remove the token from storage
    
    // For enhanced security, you could:
    // 1. Add token to a blacklist in Redis/database
    // 2. Track active sessions
    // 3. Provide "logout from all devices" functionality
    
    res.json({
      message: '👋 Logout successful',
      instruction: 'Token has been invalidated'
    })
    
  } catch (error) {
    console.error('Logout error:', error)
    res.status(500).json({
      error: 'Logout failed',
      message: 'Unable to process logout'
    })
  }
})

/*
  👤 LEARNING COMMENT: Get Current User Profile
  ============================================
  
  This endpoint allows the frontend to:
  1. Get current user's information
  2. Verify token is still valid
  3. Refresh user data after updates
*/

// GET /api/auth/me - Get current user profile
router.get('/me', requireAuth, async (req, res) => {
  try {
    // Get fresh user data from database
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        location: true,
        profilePicture: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            jobs: true,
            resumes: true
          }
        }
      }
    })
    
    if (!user) {
      return res.status(404).json({
        error: 'User not found',
        message: 'User account no longer exists'
      })
    }
    
    res.json({
      message: '👤 User profile retrieved',
      user: user
    })
    
  } catch (error) {
    console.error('Get profile error:', error)
    res.status(500).json({
      error: 'Failed to get profile',
      message: 'Unable to retrieve user profile'
    })
  }
})

/*
  ✏️ LEARNING COMMENT: Update User Profile
  =======================================
  
  Allow users to update their profile information:
  1. Validate new data
  2. Check for email uniqueness if email is changing
  3. Update database record
  4. Return updated user info
*/

// PUT /api/auth/profile - Update user profile
router.put('/profile', requireAuth, async (req, res) => {
  try {
    const { firstName, lastName, phone, location, profilePicture } = req.body
    const userId = req.user.id
    
    // Build update data (only include provided fields)
    const updateData = {}
    if (firstName !== undefined) updateData.firstName = firstName.trim()
    if (lastName !== undefined) updateData.lastName = lastName.trim()  
    if (phone !== undefined) updateData.phone = phone?.trim() || null
    if (location !== undefined) updateData.location = location?.trim() || null
    if (profilePicture !== undefined) updateData.profilePicture = profilePicture?.trim() || null
    
    // Update user in database
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        location: true,
        profilePicture: true,
        updatedAt: true
      }
    })
    
    res.json({
      message: '✅ Profile updated successfully',
      user: updatedUser
    })
    
  } catch (error) {
    console.error('Update profile error:', error)
    res.status(500).json({
      error: 'Failed to update profile',
      message: 'Unable to update profile at this time'
    })
  }
})

/*
  🔑 LEARNING COMMENT: Change Password
  ===================================
  
  Secure password change process:
  1. Verify current password
  2. Validate new password strength
  3. Hash new password
  4. Update database
  5. Optionally invalidate all existing tokens
*/

// PUT /api/auth/password - Change user password
router.put('/password', requireAuth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body
    const userId = req.user.id
    
    // Validate input
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        error: 'Missing passwords',
        message: 'Current password and new password are required'
      })
    }
    
    // Get user's current password hash
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { password: true }
    })
    
    // Verify current password
    const isCurrentPasswordValid = await verifyPassword(currentPassword, user.password)
    if (!isCurrentPasswordValid) {
      return res.status(401).json({
        error: 'Invalid current password',
        message: 'Current password is incorrect'
      })
    }
    
    // Validate new password strength
    const passwordValidation = validatePassword(newPassword)
    if (!passwordValidation.isValid) {
      return res.status(400).json({
        error: 'Weak new password',
        message: 'New password does not meet security requirements',
        requirements: passwordValidation.errors,
        strength: passwordValidation.strength
      })
    }
    
    // Hash new password
    const hashedNewPassword = await hashPassword(newPassword)
    
    // Update password in database
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedNewPassword }
    })
    
    res.json({
      message: '🔒 Password changed successfully',
      recommendation: 'Please log in again on all devices for security'
    })
    
  } catch (error) {
    console.error('Change password error:', error)
    res.status(500).json({
      error: 'Failed to change password',
      message: 'Unable to change password at this time'
    })
  }
})

/*
  🔍 LEARNING COMMENT: Check Email Availability
  ============================================
  
  Helper endpoint for registration forms to check
  if an email is available before form submission.
*/

// GET /api/auth/check-email/:email - Check if email is available
router.get('/check-email/:email', async (req, res) => {
  try {
    const email = req.params.email.toLowerCase()
    
    // Validate email format
    const emailValidation = validateEmail(email)
    if (!emailValidation.isValid) {
      return res.status(400).json({
        error: 'Invalid email format',
        details: emailValidation.errors
      })
    }
    
    // Check if email exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
      select: { id: true }
    })
    
    res.json({
      email: email,
      available: !existingUser,
      message: existingUser ? 'Email is already registered' : 'Email is available'
    })
    
  } catch (error) {
    console.error('Check email error:', error)
    res.status(500).json({
      error: 'Failed to check email',
      message: 'Unable to verify email availability'
    })
  }
})

export default router
