/*
  🎓 LEARNING COMMENT: Resume Management Routes
  =============================================
  
  This file handles resume operations:
  - List all resumes for authenticated user
  - Create new resume record
  - Get specific resume details
  - Update resume information
  - Delete resume
  
  Note: File upload functionality will be added in the next phase
  For now, we'll work with resume metadata (title, description, etc.)
  
  Security: All routes require authentication
  Database: Uses Prisma ORM to interact with resume data
*/

import express from 'express'

const router = express.Router()

/*
  📋 GET /api/resumes - List all resumes for authenticated user
  ============================================================
  
  Returns all resumes belonging to the authenticated user
  Supports pagination and search by title
  Orders by creation date (newest first)
*/
router.get('/', async (req, res) => {
  try {
    const userId = req.user.id
    
    // Extract query parameters
    const { 
      search,           // Search term for resume title
      page = 1,         // Page number for pagination
      limit = 10        // Number of items per page
    } = req.query

    // Build filter conditions
    const where = {
      userId: userId,   // Only resumes for this user
      ...(search && {
        title: { contains: search, mode: 'insensitive' }
      })
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit)

    // Get resumes with filters and pagination
    const resumes = await req.prisma.resume.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take: parseInt(limit)
    })

    // Get total count for pagination info
    const total = await req.prisma.resume.count({ where })

    res.json({
      resumes,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    })

  } catch (error) {
    console.error('Get resumes error:', error)
    res.status(500).json({ 
      error: 'Failed to fetch resumes',
      details: error.message 
    })
  }
})

/*
  ➕ POST /api/resumes - Create new resume record
  ===============================================
  
  Creates a new resume record with metadata
  Required: title
  Optional: description, skills, experience, education
  
  Note: File upload will be added in next phase
*/
router.post('/', async (req, res) => {
  try {
    const userId = req.user.id
    const { 
      title, 
      description = '',
      resumeType = 'general'
    } = req.body

    // Validate required fields
    if (!title || !title.trim()) {
      return res.status(400).json({ 
        error: 'Resume title is required' 
      })
    }

    // Create new resume record (placeholder for file fields until file upload is implemented)
    const newResume = await req.prisma.resume.create({
      data: {
        userId,
        title: title.trim(),
        originalName: title.trim() + '.pdf', // Placeholder
        fileName: `resume_${userId}_${Date.now()}.pdf`, // Placeholder
        s3Url: '', // Placeholder - will be filled when file upload is implemented
        fileSize: 0, // Placeholder
        mimeType: 'application/pdf', // Placeholder
        resumeType,
        description: description.trim()
      }
    })

    res.status(201).json(newResume)

  } catch (error) {
    console.error('Create resume error:', error)
    res.status(500).json({ 
      error: 'Failed to create resume',
      details: error.message 
    })
  }
})

/*
  � GET /api/resumes/stats - Get resume statistics
  =================================================
  
  Returns statistics for the authenticated user's resumes:
  - Total resume count
  - Most recent resume
  - Creation activity over time
  
  Note: This route must come before /:id route to avoid conflicts
*/
router.get('/stats', async (req, res) => {
  try {
    const userId = req.user.id

    // Get total resumes count
    const totalResumes = await req.prisma.resume.count({
      where: { userId }
    })

    // Get most recent resume
    const latestResume = await req.prisma.resume.findFirst({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        createdAt: true
      }
    })

    // Get resumes created in last 30 days
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    
    const recentResumes = await req.prisma.resume.count({
      where: {
        userId,
        createdAt: { gte: thirtyDaysAgo }
      }
    })

    res.json({
      totalResumes,
      latestResume,
      recentActivity: {
        last30Days: recentResumes
      }
    })

  } catch (error) {
    console.error('Resume stats error:', error)
    res.status(500).json({ 
      error: 'Failed to fetch resume statistics',
      details: error.message 
    })
  }
})

/*
  �🔍 GET /api/resumes/:id - Get specific resume details
  ====================================================
  
  Returns detailed information for a specific resume
  Security: Only returns resume if it belongs to authenticated user
*/
router.get('/:id', async (req, res) => {
  try {
    const userId = req.user.id
    const resumeId = parseInt(req.params.id)

    // Validate resume ID
    if (isNaN(resumeId)) {
      return res.status(400).json({ error: 'Invalid resume ID' })
    }

    // Find resume by ID and ensure it belongs to user
    const resume = await req.prisma.resume.findUnique({
      where: { 
        id: resumeId,
        userId: userId  // Security: ensure user owns this resume
      }
    })

    if (!resume) {
      return res.status(404).json({ error: 'Resume not found' })
    }

    res.json(resume)

  } catch (error) {
    console.error('Get resume details error:', error)
    res.status(500).json({ 
      error: 'Failed to fetch resume details',
      details: error.message 
    })
  }
})

/*
  ✏️ PUT /api/resumes/:id - Update resume information
  ==================================================
  
  Updates resume metadata
  Allows updating: title, description, skills, experience, education
  Security: Only allows updating resumes owned by authenticated user
*/
router.put('/:id', async (req, res) => {
  try {
    const userId = req.user.id
    const resumeId = parseInt(req.params.id)

    // Validate resume ID
    if (isNaN(resumeId)) {
      return res.status(400).json({ error: 'Invalid resume ID' })
    }

    // Check if resume exists and belongs to user
    const existingResume = await req.prisma.resume.findUnique({
      where: { 
        id: resumeId,
        userId: userId
      }
    })

    if (!existingResume) {
      return res.status(404).json({ error: 'Resume not found' })
    }

    const { 
      title, 
      description,
      resumeType
    } = req.body

    // Build update data (only include provided fields)
    const updateData = {}
    
    if (title !== undefined) {
      if (!title.trim()) {
        return res.status(400).json({ error: 'Resume title cannot be empty' })
      }
      updateData.title = title.trim()
    }
    
    if (description !== undefined) {
      updateData.description = description.trim()
    }
    
    if (resumeType !== undefined) {
      updateData.resumeType = resumeType
    }

    // If no fields to update
    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ error: 'No valid fields to update' })
    }

    // Update the resume
    const updatedResume = await req.prisma.resume.update({
      where: { id: resumeId },
      data: updateData
    })

    res.json(updatedResume)

  } catch (error) {
    console.error('Update resume error:', error)
    res.status(500).json({ 
      error: 'Failed to update resume',
      details: error.message 
    })
  }
})

/*
  🗑️ DELETE /api/resumes/:id - Delete resume
  ==========================================
  
  Permanently deletes a resume and its associated file (if any)
  Security: Only allows deleting resumes owned by authenticated user
*/
router.delete('/:id', async (req, res) => {
  try {
    const userId = req.user.id
    const resumeId = parseInt(req.params.id)

    // Validate resume ID
    if (isNaN(resumeId)) {
      return res.status(400).json({ error: 'Invalid resume ID' })
    }

    // Check if resume exists and belongs to user
    const existingResume = await req.prisma.resume.findUnique({
      where: { 
        id: resumeId,
        userId: userId
      }
    })

    if (!existingResume) {
      return res.status(404).json({ error: 'Resume not found' })
    }

    // TODO: In next phase, delete associated file from storage (AWS S3)
    // For now, just delete the database record

    // Delete the resume
    await req.prisma.resume.delete({
      where: { id: resumeId }
    })

    res.json({ message: 'Resume deleted successfully' })

  } catch (error) {
    console.error('Delete resume error:', error)
    res.status(500).json({ 
      error: 'Failed to delete resume',
      details: error.message 
    })
  }
})

/*
  📊 GET /api/resumes/stats - Get resume statistics
  =================================================
  
  Returns statistics for the authenticated user's resumes:
  - Total resume count
  - Most recent resume
  - Creation activity over time
*/
router.get('/stats', async (req, res) => {
  try {
    const userId = req.user.id

    // Get total resumes count
    const totalResumes = await req.prisma.resume.count({
      where: { userId }
    })

    // Get most recent resume
    const latestResume = await req.prisma.resume.findFirst({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        createdAt: true
      }
    })

    // Get resumes created in last 30 days
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    
    const recentResumes = await req.prisma.resume.count({
      where: {
        userId,
        createdAt: { gte: thirtyDaysAgo }
      }
    })

    res.json({
      totalResumes,
      latestResume,
      recentActivity: {
        last30Days: recentResumes
      }
    })

  } catch (error) {
    console.error('Resume stats error:', error)
    res.status(500).json({ 
      error: 'Failed to fetch resume statistics',
      details: error.message 
    })
  }
})

export default router
