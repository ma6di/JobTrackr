/*
  🎓 LEARNING COMMENT: Job Application Routes
  ==========================================
  
  This file handles all job application CRUD operations:
  - List all jobs for authenticated user
  - Create new job application
  - Get specific job details
  - Update job application status/details
  - Delete job application
  - Search/filter jobs
  
  Security: All routes require authentication (user must be logged in)
  Database: Uses Prisma ORM to interact with SQLite database
*/

import express from 'express'

const router = express.Router()

/*
  📋 GET /api/jobs - List all jobs for authenticated user
  =======================================================
  
  Features:
  - Returns only jobs belonging to the authenticated user
  - Supports search by company or position
  - Supports filtering by status
  - Supports pagination
  - Orders by creation date (newest first)
*/
router.get('/', async (req, res) => {
  try {
    // Get user ID from authentication middleware
    const userId = req.user.id
    
    // Extract query parameters for filtering/searching
    const { 
      search,           // Search term for company or position
      status,           // Filter by job status
      page = 1,         // Page number for pagination
      limit = 10        // Number of items per page
    } = req.query

    // Build filter conditions
    const where = {
      userId: userId,   // Only jobs for this user
      ...(search && {
        OR: [
          { company: { contains: search, mode: 'insensitive' } },
          { position: { contains: search, mode: 'insensitive' } }
        ]
      }),
      ...(status && { status: status })
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit)

    // Get jobs with filters and pagination
    const jobs = await req.prisma.job.findMany({
      where,
      include: {
        resume: {
          select: {
            id: true,
            title: true,
            originalName: true,
            fileName: true,
            resumeType: true,
            mimeType: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: parseInt(limit)
    })

    // Get total count for pagination info
    const total = await req.prisma.job.count({ where })

    res.json({
      jobs,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    })

  } catch (error) {
    console.error('Get jobs error:', error)
    res.status(500).json({ 
      error: 'Failed to fetch jobs',
      details: error.message 
    })
  }
})

/*
  ➕ POST /api/jobs - Create new job application
  ==============================================
  
  Required fields: company, position, status
  Optional fields: description, salary, location, applicationDate
  
  Validation:
  - Company and position cannot be empty
  - Status must be valid value
  - Salary must be positive number if provided
*/
router.post('/', async (req, res) => {
  try {
    const userId = req.user.id
  const { 
    company, 
    position, 
    status = 'applied',
    description = '',
    salary,
    location = '',
    appliedAt,
    jobType,
    requirements,
    additionalInfo,
    applicationUrl,
    priority = 'medium',
    notes,
    interviewDate,
    followUpDate,
    resumeId
  } = req.body

    // Validate required fields
    if (!company || !position) {
      return res.status(400).json({ 
        error: 'Company and position are required' 
      })
    }

    // Validate status
    const validStatuses = ['applied', 'interview', 'offer', 'rejected']
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ 
        error: 'Status must be one of: ' + validStatuses.join(', ')
      })
    }

    // Validate salary if provided
    if (salary !== undefined && salary !== null && salary !== '') {
      // Allow salary as string (e.g., "$75,000", "75k", "60000-80000")
      // Just check that it's not completely empty after trimming
      const trimmedSalary = salary.toString().trim()
      if (trimmedSalary.length === 0) {
        return res.status(400).json({ 
          error: 'Salary cannot be empty' 
        })
      }
    }

    // Create new job application
    const newJob = await req.prisma.job.create({
      data: {
        userId,
        company: company.trim(),
        position: position.trim(),
        status,
        description: description.trim(),
        salary: salary || null,  // Store as string or null
        location: location.trim(),
        appliedAt: appliedAt ? new Date(appliedAt) : new Date(),
        jobType: jobType?.trim() || null,
        requirements: requirements?.trim() || null,
        additionalInfo: additionalInfo?.trim() || null,
        applicationUrl: applicationUrl?.trim() || null,
        priority,
        notes: notes?.trim() || null,
        interviewDate: interviewDate ? new Date(interviewDate) : null,
        followUpDate: followUpDate ? new Date(followUpDate) : null,
        resumeId: resumeId ? parseInt(resumeId) : null
      }
    })

    res.status(201).json(newJob)

  } catch (error) {
    console.error('Create job error:', error)
    res.status(500).json({ 
      error: 'Failed to create job application',
      details: error.message 
    })
  }
})

/*
  📊 GET /api/jobs/stats - Get job application statistics
  =======================================================
  
  Returns statistics for the authenticated user:
  - Total applications
  - Count by status
  - Success rate
  - Recent activity
*/
router.get('/stats', async (req, res) => {
  try {
    const userId = req.user.id

    // Get total jobs count
    const totalJobs = await req.prisma.job.count({
      where: { userId }
    })

    // Get jobs grouped by status
    const statusCounts = await req.prisma.job.groupBy({
      by: ['status'],
      where: { userId },
      _count: { status: true }
    })

    // Convert to object for easier access
    const stats = {}
    statusCounts.forEach(item => {
      stats[item.status] = item._count.status
    })

    // Calculate success rate (offers / total applications)
    const offers = stats.offer || 0
    const successRate = totalJobs > 0 ? ((offers / totalJobs) * 100).toFixed(1) : 0

    // Get recent applications (last 7 days)
    const weekAgo = new Date()
    weekAgo.setDate(weekAgo.getDate() - 7)
    
    const recentJobs = await req.prisma.job.count({
      where: {
        userId,
        createdAt: { gte: weekAgo }
      }
    })

    res.json({
      totalJobs,
      statusBreakdown: {
        applied: stats.applied || 0,
        interview: stats.interview || 0,
        offer: stats.offer || 0,
        rejected: stats.rejected || 0
      },
      successRate: `${successRate}%`,
      recentApplications: recentJobs
    })

  } catch (error) {
    console.error('Job stats error:', error)
    res.status(500).json({ 
      error: 'Failed to fetch job statistics',
      details: error.message 
    })
  }
})

/*
  🔍 GET /api/jobs/:id - Get specific job details
  ===============================================
  
  Returns detailed information for a specific job application
  Security: Only returns job if it belongs to authenticated user
*/
router.get('/:id', async (req, res) => {
  try {
    const userId = req.user.id
    const jobId = parseInt(req.params.id)

    // Validate job ID
    if (isNaN(jobId)) {
      return res.status(400).json({ error: 'Invalid job ID' })
    }

    // Find job by ID and ensure it belongs to user
    const job = await req.prisma.job.findUnique({
      where: { 
        id: jobId,
        userId: userId  // Security: ensure user owns this job
      }
    })

    if (!job) {
      return res.status(404).json({ error: 'Job application not found' })
    }

    res.json(job)

  } catch (error) {
    console.error('Get job details error:', error)
    res.status(500).json({ 
      error: 'Failed to fetch job details',
      details: error.message 
    })
  }
})

/*
  ✏️ PUT /api/jobs/:id - Update job application
  =============================================
  
  Updates any field of a job application
  Security: Only allows updating jobs owned by authenticated user
  Validation: Same as create job endpoint
*/
router.put('/:id', async (req, res) => {
  try {
    const userId = req.user.id
    const jobId = parseInt(req.params.id)

    // Validate job ID
    if (isNaN(jobId)) {
      return res.status(400).json({ error: 'Invalid job ID' })
    }

    // Check if job exists and belongs to user
    const existingJob = await req.prisma.job.findUnique({
      where: { 
        id: jobId,
        userId: userId
      }
    })

    if (!existingJob) {
      return res.status(404).json({ error: 'Job application not found' })
    }

    const { 
      company, 
      position, 
      status,
      description,
      salary,
      location,
      appliedAt,
      jobType,
      requirements,
      additionalInfo,
      applicationUrl,
      priority,
      notes,
      interviewDate,
      followUpDate,
      resumeId
    } = req.body

    // Build update data (only include provided fields)
    const updateData = {}
    
    if (company !== undefined) {
      if (!company.trim()) {
        return res.status(400).json({ error: 'Company cannot be empty' })
      }
      updateData.company = company.trim()
    }
    
    if (position !== undefined) {
      if (!position.trim()) {
        return res.status(400).json({ error: 'Position cannot be empty' })
      }
      updateData.position = position.trim()
    }
    
    if (status !== undefined) {
      const validStatuses = ['applied', 'interview', 'offer', 'rejected']
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ 
          error: 'Status must be one of: ' + validStatuses.join(', ')
        })
      }
      updateData.status = status
    }
    
    if (description !== undefined) {
      updateData.description = description.trim()
    }
    
    if (salary !== undefined) {
      if (salary !== null && salary !== '' && (isNaN(salary) || parseFloat(salary) < 0)) {
        return res.status(400).json({ error: 'Salary must be a positive number' })
      }
      updateData.salary = salary || null  // Store as string or null
    }
    
    if (location !== undefined) {
      updateData.location = location.trim()
    }
    
    if (appliedAt !== undefined) {
      updateData.appliedAt = new Date(appliedAt)
    }

    if (jobType !== undefined) {
      updateData.jobType = jobType?.trim() || null
    }

    if (requirements !== undefined) {
      updateData.requirements = requirements?.trim() || null
    }

    if (additionalInfo !== undefined) {
      updateData.additionalInfo = additionalInfo?.trim() || null
    }

    if (applicationUrl !== undefined) {
      updateData.applicationUrl = applicationUrl?.trim() || null
    }

    if (priority !== undefined) {
      const validPriorities = ['low', 'medium', 'high']
      if (!validPriorities.includes(priority)) {
        return res.status(400).json({ 
          error: 'Priority must be one of: ' + validPriorities.join(', ')
        })
      }
      updateData.priority = priority
    }

    if (notes !== undefined) {
      updateData.notes = notes?.trim() || null
    }

    if (interviewDate !== undefined) {
      updateData.interviewDate = interviewDate ? new Date(interviewDate) : null
    }

    if (followUpDate !== undefined) {
      updateData.followUpDate = followUpDate ? new Date(followUpDate) : null
    }

    if (resumeId !== undefined) {
      updateData.resumeId = resumeId ? parseInt(resumeId) : null
    }

    // Update the job
    const updatedJob = await req.prisma.job.update({
      where: { id: jobId },
      data: updateData,
      include: {
        resume: {
          select: {
            id: true,
            title: true,
            originalName: true,
            fileName: true,
            resumeType: true,
            mimeType: true
          }
        }
      }
    })

    res.json(updatedJob)

  } catch (error) {
    console.error('Update job error:', error)
    res.status(500).json({ 
      error: 'Failed to update job application',
      details: error.message 
    })
  }
})

/*
  🗑️ DELETE /api/jobs/:id - Delete job application
  =================================================
  
  Permanently deletes a job application
  Security: Only allows deleting jobs owned by authenticated user
*/
router.delete('/:id', async (req, res) => {
  try {
    const userId = req.user.id
    const jobId = parseInt(req.params.id)

    // Validate job ID
    if (isNaN(jobId)) {
      return res.status(400).json({ error: 'Invalid job ID' })
    }

    // Check if job exists and belongs to user
    const existingJob = await req.prisma.job.findUnique({
      where: { 
        id: jobId,
        userId: userId
      }
    })

    if (!existingJob) {
      return res.status(404).json({ error: 'Job application not found' })
    }

    // Delete the job
    await req.prisma.job.delete({
      where: { id: jobId }
    })

    res.json({ message: 'Job application deleted successfully' })

  } catch (error) {
    console.error('Delete job error:', error)
    res.status(500).json({ 
      error: 'Failed to delete job application',
      details: error.message 
    })
  }
})

export default router
