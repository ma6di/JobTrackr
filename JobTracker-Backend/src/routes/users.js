/*
  🎓 LEARNING COMMENT: User Management Routes
  ==========================================
  
  This file handles user profile operations:
  - Get user profile information
  - Update user profile
  - Change user preferences
  - View user statistics
  
  Security: All routes require authentication
  Database: Uses Prisma ORM to interact with user data
*/

import express from 'express'
import { validateEmail, hashPassword, verifyPassword } from '../utils/auth.js'

const router = express.Router()

/*
  👤 GET /api/users/profile - Get user profile
  ============================================
  
  Returns the authenticated user's profile information
  Excludes sensitive data like password hash
*/
router.get('/profile', async (req, res) => {
  try {
    const userId = req.user.id

    // Get user profile (exclude password for security)
    const user = await req.prisma.user.findUnique({
      where: { id: userId },
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
        // Exclude password field
      }
    })

    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    res.json(user)

  } catch (error) {
    console.error('Get profile error:', error)
    res.status(500).json({ 
      error: 'Failed to fetch user profile',
      details: error.message 
    })
  }
})

/*
  ✏️ PUT /api/users/profile - Update user profile
  ===============================================
  
  Updates user profile information
  Allows updating: name, email
  Validates email format and uniqueness
*/
router.put('/profile', async (req, res) => {
  try {
    const userId = req.user.id
    const { firstName, lastName, email } = req.body

    // Build update data (only include provided fields)
    const updateData = {}

    if (firstName !== undefined) {
      if (!firstName || firstName.trim().length < 2) {
        return res.status(400).json({ 
          error: 'First name must be at least 2 characters long' 
        })
      }
      updateData.firstName = firstName.trim()
    }

    if (lastName !== undefined) {
      if (!lastName || lastName.trim().length < 2) {
        return res.status(400).json({ 
          error: 'Last name must be at least 2 characters long' 
        })
      }
      updateData.lastName = lastName.trim()
    }

    if (email !== undefined) {
      // Validate email format
      if (!validateEmail(email)) {
        return res.status(400).json({ error: 'Invalid email format' })
      }

      // Check if email is already taken by another user
      const existingUser = await req.prisma.user.findFirst({
        where: {
          email: email.toLowerCase(),
          NOT: { id: userId }  // Exclude current user
        }
      })

      if (existingUser) {
        return res.status(409).json({ error: 'Email is already taken' })
      }

      updateData.email = email.toLowerCase()
    }

    // If no fields to update
    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ error: 'No valid fields to update' })
    }

    // Update user profile
    const updatedUser = await req.prisma.user.update({
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
        createdAt: true,
        updatedAt: true,
        // Exclude password field
      }
    })

    res.json(updatedUser)

  } catch (error) {
    console.error('Update profile error:', error)
    res.status(500).json({ 
      error: 'Failed to update user profile',
      details: error.message 
    })
  }
})

/*
  🔒 PUT /api/users/change-password - Change user password
  =======================================================
  
  Allows user to change their password
  Requires current password for verification
  Validates new password strength
*/
router.put('/change-password', async (req, res) => {
  try {
    const userId = req.user.id
    const { currentPassword, newPassword } = req.body

    // Validate required fields
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ 
        error: 'Current password and new password are required' 
      })
    }

    // Get user with password to verify current password
    const user = await req.prisma.user.findUnique({
      where: { id: userId }
    })

    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    // Verify current password
    const isCurrentPasswordValid = await verifyPassword(currentPassword, user.password)
    if (!isCurrentPasswordValid) {
      return res.status(400).json({ error: 'Current password is incorrect' })
    }

    // Validate new password
    const passwordValidation = validatePassword(newPassword)
    if (!passwordValidation.valid) {
      return res.status(400).json({ 
        error: 'Password validation failed',
        details: passwordValidation.errors 
      })
    }

    // Hash new password
    const hashedNewPassword = await hashPassword(newPassword)

    // Update password in database
    await req.prisma.user.update({
      where: { id: userId },
      data: { password: hashedNewPassword }
    })

    res.json({ message: 'Password changed successfully' })

  } catch (error) {
    console.error('Change password error:', error)
    res.status(500).json({ 
      error: 'Failed to change password',
      details: error.message 
    })
  }
})

/*
  📊 GET /api/users/stats - Get user statistics
  =============================================
  
  Returns statistics for the authenticated user:
  - Account creation date
  - Total jobs applied
  - Total resumes uploaded
  - Recent activity
*/
router.get('/stats', async (req, res) => {
  try {
    const userId = req.user.id

    // Get user basic info
    const user = await req.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        createdAt: true
      }
    })

    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    // Get total jobs count
    const totalJobs = await req.prisma.job.count({
      where: { userId }
    })

    // Get total resumes count
    const totalResumes = await req.prisma.resume.count({
      where: { userId }
    })

    // Get recent activity (last 30 days)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const recentJobs = await req.prisma.job.count({
      where: {
        userId,
        createdAt: { gte: thirtyDaysAgo }
      }
    })

    const recentResumes = await req.prisma.resume.count({
      where: {
        userId,
        createdAt: { gte: thirtyDaysAgo }
      }
    })

    // Calculate days since account creation
    const daysSinceCreation = Math.floor(
      (new Date() - new Date(user.createdAt)) / (1000 * 60 * 60 * 24)
    )

    res.json({
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        memberSince: user.createdAt,
        daysSinceCreation
      },
      activity: {
        totalJobs,
        totalResumes,
        recentJobs: recentJobs,
        recentResumes: recentResumes
      }
    })

  } catch (error) {
    console.error('Get user stats error:', error)
    res.status(500).json({ 
      error: 'Failed to fetch user statistics',
      details: error.message 
    })
  }
})

/*
  🗑️ DELETE /api/users/account - Delete user account
  ==================================================
  
  Permanently deletes the user account and all associated data
  Requires password confirmation for security
  This is irreversible!
*/
router.delete('/account', async (req, res) => {
  try {
    const userId = req.user.id
    const { password } = req.body

    // Validate password is provided
    if (!password) {
      return res.status(400).json({ 
        error: 'Password confirmation is required to delete account' 
      })
    }

    // Get user with password to verify
    const user = await req.prisma.user.findUnique({
      where: { id: userId }
    })

    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    // Verify password
    const isPasswordValid = await verifyPassword(password, user.password)
    if (!isPasswordValid) {
      return res.status(400).json({ error: 'Incorrect password' })
    }

    // Delete all user data (Prisma will handle cascading deletes)
    await req.prisma.user.delete({
      where: { id: userId }
    })

    res.json({ message: 'Account deleted successfully' })

  } catch (error) {
    console.error('Delete account error:', error)
    res.status(500).json({ 
      error: 'Failed to delete account',
      details: error.message 
    })
  }
})

export default router
