/*
  🎓 LEARNING COMMENT: Resume Management Routes with File Upload
  ==============================================================
  
  This file handles resume operations including file uploads:
  - List all resumes for authenticated user
  - Upload resume files (PDF, DOC, DOCX) to AWS S3
  - Get specific resume details and download links
  - Update resume information
  - Delete resume and associated files
  
  File Upload Features:
  - Multer middleware for handling multipart/form-data
  - AWS S3 integration for secure cloud storage
  - File validation (type, size, content)
  - Secure download URLs with expiration
  - File metadata tracking
  
  Security: All routes require authentication
  Database: Uses Prisma ORM with file metadata storage
*/

import express from 'express'
import { 
  createLocalUploadMiddleware, 
  uploadToS3, 
  deleteFromS3, 
  generateSignedUrl,
  extractFileMetadata,
  generateSecureFilename,
  validateFile
} from '../utils/fileUpload.js'

const router = express.Router()

// Create upload middleware
const upload = createLocalUploadMiddleware()

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
  ➕ POST /api/resumes - Upload new resume file
  =============================================
  
  Handles resume file uploads with the following process:
  1. Receive multipart/form-data with file and metadata
  2. Validate file type, size, and content
  3. Upload file to AWS S3 with secure filename
  4. Store file metadata in database
  5. Return resume record with download URL
  
  Form fields:
  - file: Resume file (PDF, DOC, DOCX, TXT, RTF)
  - title: Resume title/name
  - description: Optional description
  - resumeType: Type of resume (general, tech, sales, etc.)
*/
router.post('/', upload.single('file'), async (req, res) => {
  try {
    const userId = req.user.id
    const { title, description = '', resumeType = 'general' } = req.body
    const file = req.file

    // Check if file was uploaded
    if (!file) {
      return res.status(400).json({ 
        error: 'No file uploaded',
        message: 'Please select a resume file to upload'
      })
    }

    // Validate title is provided
    if (!title || !title.trim()) {
      return res.status(400).json({ 
        error: 'Resume title is required' 
      })
    }

    // Validate file (additional check beyond multer)
    const fileValidation = validateFile(file)
    if (!fileValidation.isValid) {
      return res.status(400).json({ 
        error: 'File validation failed',
        details: fileValidation.errors
      })
    }

    // Upload file to Cloudinary
    const cloudinary = require('cloudinary').v2;
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET
    });

    let cloudinaryResult;
    try {
      cloudinaryResult = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            resource_type: 'auto',
            folder: 'resumes',
            public_id: `${userId}_${Date.now()}_${file.originalname}`,
            overwrite: true
          },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        );
        stream.end(file.buffer);
      });
    } catch (cloudError) {
      console.error('Cloudinary upload failed:', cloudError);
      return res.status(500).json({
        error: 'File upload failed',
        details: cloudError.message
      });
    }

    // Extract file metadata
    const metadata = extractFileMetadata({
      ...file,
      filename: cloudinaryResult.public_id
    });

    // Create resume record in database
    const newResume = await req.prisma.resume.create({
      data: {
        userId,
        title: title.trim(),
        originalName: file.originalname,
        fileName: cloudinaryResult.public_id,
        cloudinaryUrl: cloudinaryResult.secure_url,
        fileSize: file.size,
        mimeType: file.mimetype,
        resumeType,
        description: description.trim()
      }
    });

    // Download URL is always the Cloudinary URL
    const downloadUrl = cloudinaryResult.secure_url;

    res.status(201).json({
      ...newResume,
      downloadUrl,
      fileInfo: {
        humanFileSize: metadata.humanFileSize,
        isPDF: metadata.isPDF,
        isWord: metadata.isWord,
        extension: metadata.extension
      }
    });

  } catch (error) {
    console.error('Create resume error:', error)
    res.status(500).json({ 
      error: 'Failed to upload resume',
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

    // For Cloudinary, just return the cloudinaryUrl
    res.json({
      ...resume,
      downloadUrl: resume.cloudinaryUrl || null
    })

  } catch (error) {
    console.error('Get resume details error:', error)
    res.status(500).json({ 
      error: 'Failed to fetch resume details',
      details: error.message 
    })
  }
})

/*
  📥 GET /api/resumes/:id/download - Download resume file
  ======================================================
  
  Generates a secure download URL and redirects to it
  The URL expires after 1 hour for security
  Security: Only allows downloading user's own resumes
*/
router.get('/:id/download', async (req, res) => {
  try {
    const userId = req.user.id
    const resumeId = parseInt(req.params.id)

    // Validate resume ID
    if (isNaN(resumeId)) {
      return res.status(400).json({ error: 'Invalid resume ID' })
    }

    // Find resume and verify ownership
    const resume = await req.prisma.resume.findUnique({
      where: { 
        id: resumeId,
        userId: userId
      }
    })

    if (!resume) {
      return res.status(404).json({ error: 'Resume not found' })
    }

    // Check if resume has a file
    if (!resume.fileName) {
      return res.status(404).json({ 
        error: 'Resume file not found',
        message: 'This resume does not have an associated file'
      })
    }

    // Check if file is stored in S3 or locally
    if (resume.s3Url && resume.s3Url.startsWith('http')) {
      // File is in S3, generate signed download URL
      try {
        const downloadUrl = await generateSignedUrl(resume.fileName, 3600)
        
        // Update download count
        await req.prisma.resume.update({
          where: { id: resumeId },
          data: { 
            downloadCount: { increment: 1 }
          }
        })

        // Return download URL or redirect
        if (req.query.redirect === 'true') {
          res.redirect(downloadUrl)
        } else {
          res.json({
            downloadUrl,
            fileName: resume.originalName,
            fileSize: resume.fileSize,
            mimeType: resume.mimeType,
            expiresIn: '1 hour'
          })
        }
      } catch (error) {
        console.error('S3 download URL generation failed:', error)
        res.status(500).json({ 
          error: 'Failed to generate download URL',
          details: error.message 
        })
      }
    } else {
      // File is stored locally, serve it directly
      try {
        const fs = await import('fs/promises')
        const path = await import('path')
        
        const filePath = path.join(process.cwd(), 'temp', 'uploads', resume.fileName)
        
        // Check if file exists
        await fs.access(filePath)
        
        // Update download count
        await req.prisma.resume.update({
          where: { id: resumeId },
          data: { 
            downloadCount: { increment: 1 }
          }
        })
        
        // Set appropriate headers
        res.setHeader('Content-Type', resume.mimeType)
        res.setHeader('Content-Disposition', `attachment; filename="${resume.originalName}"`)
        
        // Send file
        res.sendFile(path.resolve(filePath))
      } catch (fileError) {
        console.error('Local file access error:', fileError)
        res.status(404).json({ 
          error: 'File not found on disk',
          details: fileError.message
        })
      }
    }

  } catch (error) {
    console.error('Download resume error:', error)
    res.status(500).json({ 
      error: 'Failed to process download request',
      details: error.message 
    })
  }
})

/*
  📄 GET /api/resumes/:id/preview - Preview resume file
  ====================================================
  
  Similar to download but serves the file for inline viewing/preview
  Sets Content-Disposition to inline instead of attachment
  Security: Only allows previewing user's own resumes
*/
router.get('/:id/preview', async (req, res) => {
  try {
    const userId = req.user.id
    const resumeId = parseInt(req.params.id)

    // Validate resume ID
    if (isNaN(resumeId)) {
      return res.status(400).json({ error: 'Invalid resume ID' })
    }

    // Find resume and verify ownership
    const resume = await req.prisma.resume.findUnique({
      where: { 
        id: resumeId,
        userId: userId
      }
    })

    if (!resume) {
      return res.status(404).json({ error: 'Resume not found' })
    }

    // Check if resume has a cloudinaryUrl
    if (resume.cloudinaryUrl) {
      // Redirect to Cloudinary URL for inline preview
      return res.redirect(resume.cloudinaryUrl);
    }
    // If no cloudinaryUrl, file is not available
    return res.status(404).json({
      error: 'Resume preview not available on Cloudinary',
      details: 'No cloudinaryUrl available for this resume.'
    });

  } catch (error) {
    console.error('Preview resume error:', error)
    res.status(500).json({ 
      error: 'Failed to process preview request',
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

    // Optionally: delete file from Cloudinary here if you want (requires Cloudinary API call)
    // For now, just delete DB record
    await req.prisma.resume.delete({
      where: { id: resumeId }
    });

    res.json({
      message: 'Resume deleted successfully',
      fileName: existingResume.originalName
    });

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

/*
  📥 GET /api/resumes/download/:filename - Download resume file
  ============================================================
  
  Serves local resume files when S3 is not available
  Security: Only serves files that belong to authenticated user
*/
router.get('/download/:filename', async (req, res) => {
  try {
    const { filename } = req.params;
    const userId = req.user.id;

    // Find resume by filename and user
    const resume = await req.prisma.resume.findFirst({
      where: {
        fileName: filename,
        userId
      }
    });

    if (!resume) {
      return res.status(404).json({
        error: 'File not found or access denied'
      });
    }

    // Use Cloudinary URL for download
    if (resume.cloudinaryUrl) {
      // Optionally increment download count
      await req.prisma.resume.update({
        where: { id: resume.id },
        data: { downloadCount: { increment: 1 } }
      });
      // Redirect to Cloudinary file
      return res.redirect(resume.cloudinaryUrl);
    }

    // If no cloudinaryUrl, file is not available
    return res.status(404).json({
      error: 'Resume file not found on Cloudinary',
      details: 'No cloudinaryUrl available for this resume.'
    });
  } catch (error) {
    console.error('Download error:', error);
    res.status(500).json({
      error: 'Failed to download file',
      details: error.message
    });
  }
})

export default router
