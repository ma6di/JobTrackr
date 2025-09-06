// routes/resumeRoutes.js
import express from 'express'
import multer from 'multer'
import cloudinary from '../config/cloudinary.js'
import db from '../models/index.js' // Sequelize models

const router = express.Router()

// Multer only for parsing multipart form-data
const upload = multer({ dest: 'uploads/' })

/**
 * Upload resume → Cloudinary → save in DB
 */
router.post('/', upload.single('file'), async (req, res) => {
  try {
    console.log('Upload request started')
    console.log('User ID:', req.user.id)
    console.log('File received:', req.file ? {
      originalname: req.file.originalname,
      filename: req.file.filename,
      size: req.file.size,
      mimetype: req.file.mimetype
    } : 'No file')
    console.log('Body data:', req.body)
    
    if (!req.file) {
      console.log('No file uploaded - returning 400')
      return res.status(400).json({ error: 'No file uploaded' })
    }

    const { title, description } = req.body
    
    console.log('Uploading to Cloudinary...')
    
    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      resource_type: 'raw', // important for PDFs/docs
      folder: 'resumes',
      public_id: `user_${req.user.id}_${Date.now()}`,
    })
    
    console.log('Cloudinary upload successful:', {
      public_id: result.public_id,
      secure_url: result.secure_url,
      resource_type: result.resource_type
    })

    // Save DB record
    console.log('Creating database record...')
    const resume = await db.Resume.create({
      userId: req.user.id,
      title: title || req.file.originalname,
      originalName: req.file.originalname,
      fileName: req.file.filename,
      cloudinaryUrl: result.secure_url,
      cloudinaryPublicId: result.public_id,
      fileSize: req.file.size,
      mimeType: req.file.mimetype,
      description: description || '',
    })
    
    console.log('Resume created successfully:', {
      id: resume.id,
      title: resume.title,
      cloudinaryUrl: resume.cloudinaryUrl
    })

    res.status(201).json(resume)
  } catch (err) {
    console.error('Resume upload error:', err)
    console.error('Error stack:', err.stack)
    res.status(500).json({ 
      error: 'Resume upload failed',
      details: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
    })
  }
})

/**
 * Get all resumes for logged-in user
 */
router.get('/', async (req, res) => {
  try {
    console.log('Fetching resumes for user ID:', req.user.id)
    const resumes = await db.Resume.findAll({
      where: { userId: req.user.id },
      order: [['createdAt', 'DESC']],
    })
    console.log('Found resumes:', resumes.length)
    if (resumes.length > 0) {
      console.log('Sample resume data:', {
        id: resumes[0].id,
        title: resumes[0].title,
        cloudinaryUrl: resumes[0].cloudinaryUrl,
        s3Url: resumes[0].s3Url,
        hasCloudinaryUrl: !!resumes[0].cloudinaryUrl,
        hasS3Url: !!resumes[0].s3Url
      })
    }
    res.json(resumes)
  } catch (err) {
    console.error('Fetch resumes error:', err)
    res.status(500).json({ error: 'Failed to fetch resumes' })
  }
})

/**
 * Preview a resume → redirect to Cloudinary or S3
 */
router.get('/:id/preview', async (req, res) => {
  try {
    const resumeId = req.params.id
    console.log('Preview request for resume ID:', resumeId)
    console.log('User ID:', req.user.id)
    
    // Validate resume ID
    if (!resumeId || resumeId === 'undefined' || resumeId === 'null') {
      console.log('Invalid resume ID provided:', resumeId)
      return res.status(400).json({ 
        error: 'Invalid resume ID',
        details: 'Resume ID is required and must be a valid number'
      })
    }
    
    const resume = await db.Resume.findByPk(resumeId)
    console.log('Found resume:', resume ? {
      id: resume.id,
      userId: resume.userId,
      title: resume.title,
      cloudinaryUrl: resume.cloudinaryUrl,
      s3Url: resume.s3Url,
      hasCloudinaryUrl: !!resume.cloudinaryUrl,
      hasS3Url: !!resume.s3Url
    } : 'null')
    
    if (!resume) {
      return res.status(404).json({ error: 'Resume not found' })
    }
    
    if (resume.userId !== req.user.id) {
      return res.status(403).json({ error: 'Access denied - you can only access your own resumes' })
    }
    
    // Try Cloudinary URL first, then S3 URL as fallback
    const fileUrl = resume.cloudinaryUrl || resume.s3Url
    
    if (!fileUrl) {
      console.log('No file URL found for resume ID:', resume.id)
      return res.status(404).json({ 
        error: 'Resume file not found',
        details: 'This resume does not have an associated file URL. Please re-upload the resume.'
      })
    }
    
    console.log('Redirecting to:', fileUrl)
    res.redirect(fileUrl)
  } catch (err) {
    console.error('Preview error:', err)
    res.status(500).json({ error: 'Failed to preview resume' })
  }
})

/**
 * Download a resume → redirect to Cloudinary or S3
 */
router.get('/:id/download', async (req, res) => {
  try {
    const resumeId = req.params.id
    console.log('Download request for resume ID:', resumeId)
    console.log('User ID:', req.user.id)
    
    // Validate resume ID
    if (!resumeId || resumeId === 'undefined' || resumeId === 'null') {
      console.log('Invalid resume ID provided:', resumeId)
      return res.status(400).json({ 
        error: 'Invalid resume ID',
        details: 'Resume ID is required and must be a valid number'
      })
    }
    
    const resume = await db.Resume.findByPk(resumeId)
    console.log('Found resume:', resume ? {
      id: resume.id,
      userId: resume.userId,
      title: resume.title,
      cloudinaryUrl: resume.cloudinaryUrl,
      s3Url: resume.s3Url,
      downloadCount: resume.downloadCount
    } : 'null')
    
    if (!resume) {
      return res.status(404).json({ error: 'Resume not found' })
    }
    
    if (resume.userId !== req.user.id) {
      return res.status(403).json({ error: 'Access denied - you can only download your own resumes' })
    }
    
    // Try Cloudinary URL first, then S3 URL as fallback
    const fileUrl = resume.cloudinaryUrl || resume.s3Url
    
    if (!fileUrl) {
      console.log('No file URL found for resume ID:', resume.id)
      return res.status(404).json({ 
        error: 'Resume file not found',
        details: 'This resume does not have an associated file URL. Please re-upload the resume.'
      })
    }
    
    // Increment download count
    try {
      await resume.increment('downloadCount')
      console.log('Incremented download count for resume ID:', resume.id)
    } catch (incrementError) {
      console.error('Failed to increment download count:', incrementError)
      // Don't fail the download if we can't increment counter
    }
    
    console.log('Redirecting to:', fileUrl)
    res.redirect(fileUrl)
  } catch (err) {
    console.error('Download error:', err)
    res.status(500).json({ error: 'Failed to download resume' })
  }
})

/**
 * Delete a resume → remove from Cloudinary + DB
 */
router.delete('/:id', async (req, res) => {
  try {
    const resume = await db.Resume.findByPk(req.params.id)
    if (!resume || resume.userId !== req.user.id) {
      return res.status(404).json({ error: 'Resume not found' })
    }

    // Delete from Cloudinary using stored public_id
    if (resume.cloudinaryPublicId) {
      try {
        await cloudinary.uploader.destroy(resume.cloudinaryPublicId, {
          resource_type: 'raw',
        })
      } catch (cloudinaryError) {
        console.error('Cloudinary deletion error:', cloudinaryError)
        // Continue with DB deletion even if Cloudinary fails
      }
    }

    // Delete DB record
    await resume.destroy()

    res.json({ message: 'Resume deleted successfully' })
  } catch (err) {
    console.error('Delete error:', err)
    res.status(500).json({ error: 'Failed to delete resume' })
  }
})

export default router
