// routes/resumeRoutes.js
import express from 'express'
import multer from 'multer'
import cloudinary, { hasCloudinaryConfig } from '../config/cloudinary.js'
import db from '../models/index.js' // Sequelize models
import path from 'path'
import fs from 'fs'

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
    
    let cloudinaryUrl = null
    let cloudinaryPublicId = null
    let fileContent = null
    
    if (hasCloudinaryConfig) {
      try {
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
        
        cloudinaryUrl = result.secure_url
        cloudinaryPublicId = result.public_id
      } catch (cloudinaryError) {
        console.error('Cloudinary upload failed:', cloudinaryError.message)
        console.log('Falling back to database storage')
      }
    } else {
      console.log('Cloudinary not configured, storing file content in database')
    }
    
    // If Cloudinary failed or not configured, store file content in database
    if (!cloudinaryUrl) {
      try {
        fileContent = fs.readFileSync(req.file.path)
        console.log('File content stored in database, size:', fileContent.length)
      } catch (fileError) {
        console.error('Failed to read file:', fileError.message)
        return res.status(500).json({ error: 'Failed to process uploaded file' })
      }
    }

    // Save DB record
    console.log('Creating database record...')
    const resume = await db.Resume.create({
      userId: req.user.id,
      title: title || req.file.originalname,
      originalName: req.file.originalname,
      fileName: req.file.filename,
      cloudinaryUrl: cloudinaryUrl,
      cloudinaryPublicId: cloudinaryPublicId,
      s3Url: cloudinaryUrl ? null : 'database://content', // indicates content is in DB
      fileContent: fileContent, // Store binary data if no Cloudinary
      fileSize: req.file.size,
      mimeType: req.file.mimetype,
      description: description || '',
    })
    
    console.log('Resume created successfully:', {
      id: resume.id,
      title: resume.title,
      cloudinaryUrl: resume.cloudinaryUrl,
      s3Url: resume.s3Url,
      hasFileContent: !!fileContent
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
 * Preview a resume → serve directly or redirect
 */
router.options('/:id/preview', (req, res) => {
  // CORS preflight response
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, Cache-Control')
  res.setHeader('Access-Control-Max-Age', '86400') // 24 hours
  res.status(204).end()
})

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
    
    // Try Cloudinary URL first, then check if content is in database
    let fileUrl = resume.cloudinaryUrl
    
    if (!fileUrl && resume.s3Url === 'database://content') {
      // File content is stored in database - serve directly instead of redirecting
      console.log('Serving PDF preview directly from database')
      
      if (resume.fileContent) {
        // Set headers for inline PDF display
        const contentType = resume.mimeType || 'application/pdf'
        
        // Enhanced CORS headers for frontend compatibility
        res.setHeader('Access-Control-Allow-Origin', '*')
        res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS')
        res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, Cache-Control')
        res.setHeader('Access-Control-Expose-Headers', 'Content-Length, Content-Type, Content-Disposition')
        
        // PDF headers
        res.setHeader('Content-Type', contentType)
        res.setHeader('Content-Disposition', 'inline; filename="' + resume.originalName + '"')
        res.setHeader('Accept-Ranges', 'bytes')
        res.setHeader('Content-Length', resume.fileContent.length)
        
        // Cache headers
        res.setHeader('Cache-Control', 'public, max-age=3600')
        res.setHeader('Last-Modified', new Date(resume.updatedAt).toUTCString())
        res.setHeader('ETag', `"${resume.id}-${resume.fileContent.length}"`)
        
        console.log('Direct preview headers set:', {
          contentType,
          disposition: `inline; filename="${resume.originalName}"`,
          size: resume.fileContent.length,
          corsOrigin: '*'
        })
        
        return res.send(resume.fileContent)
      }
      
      // Fallback to redirect if no file content
      fileUrl = `${req.protocol}://${req.get('host')}/api/resumes/file/${resume.fileName}`
      console.log('Converting database storage to preview URL:', fileUrl)
    } else if (!fileUrl && resume.s3Url && resume.s3Url.startsWith('/uploads/')) {
      // Legacy local file path
      const filename = resume.s3Url.replace('/uploads/', '')
      fileUrl = `${req.protocol}://${req.get('host')}/api/resumes/file/${filename}`
      console.log('Converting local path to preview URL:', fileUrl)
    }
    
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
    
    // Try Cloudinary URL first, then check if content is in database
    let fileUrl = resume.cloudinaryUrl
    
    if (!fileUrl && resume.s3Url === 'database://content') {
      // File content is stored in database
      fileUrl = `${req.protocol}://${req.get('host')}/api/resumes/file/${resume.fileName}?download=true`
      console.log('Converting database storage to download URL:', fileUrl)
    } else if (!fileUrl && resume.s3Url && resume.s3Url.startsWith('/uploads/')) {
      // Legacy local file path
      const filename = resume.s3Url.replace('/uploads/', '')
      fileUrl = `${req.protocol}://${req.get('host')}/api/resumes/file/${filename}?download=true`
      console.log('Converting local path to download URL:', fileUrl)
    }
    
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

// Test endpoint to check Cloudinary configuration
router.get('/test-config', (req, res) => {
  try {
    console.log('Testing Cloudinary configuration...')
    
    const hasCloudName = !!process.env.CLOUDINARY_CLOUD_NAME
    const hasApiKey = !!process.env.CLOUDINARY_API_KEY
    const hasApiSecret = !!process.env.CLOUDINARY_API_SECRET
    
    console.log('Cloudinary config check:', {
      hasCloudName,
      hasApiKey,
      hasApiSecret,
      cloudName: process.env.CLOUDINARY_CLOUD_NAME ? 'set' : 'missing'
    })
    
    res.json({
      cloudinary: {
        configured: hasCloudName && hasApiKey && hasApiSecret,
        hasCloudName,
        hasApiKey,
        hasApiSecret,
        cloudName: hasCloudName ? process.env.CLOUDINARY_CLOUD_NAME : 'not set'
      },
      database: {
        connected: !!db.Resume
      },
      user: {
        id: req.user.id,
        email: req.user.email
      }
    })
  } catch (error) {
    console.error('Config test error:', error)
    res.status(500).json({ error: error.message })
  }
})

/**
 * Test upload without Cloudinary - save to local only
 */
router.post('/test-upload', upload.single('file'), async (req, res) => {
  try {
    console.log('Test upload request started')
    console.log('User ID:', req.user.id)
    console.log('File received:', req.file ? {
      originalname: req.file.originalname,
      filename: req.file.filename,
      size: req.file.size,
      mimetype: req.file.mimetype,
      path: req.file.path
    } : 'No file')
    console.log('Body data:', req.body)
    
    if (!req.file) {
      console.log('No file uploaded - returning 400')
      return res.status(400).json({ error: 'No file uploaded' })
    }

    const { title, description } = req.body
    
    console.log('Creating database record without Cloudinary...')
    
    // Save DB record with local file path (for testing)
    const resume = await db.Resume.create({
      userId: req.user.id,
      title: title || req.file.originalname,
      originalName: req.file.originalname,
      fileName: req.file.filename,
      s3Url: `local://uploads/${req.file.filename}`, // temporary local URL
      fileSize: req.file.size,
      mimeType: req.file.mimetype,
      description: description || '',
    })
    
    console.log('Test resume created successfully:', {
      id: resume.id,
      title: resume.title,
      s3Url: resume.s3Url
    })

    res.status(201).json(resume)
  } catch (err) {
    console.error('Test resume upload error:', err)
    console.error('Error stack:', err.stack)
    res.status(500).json({ 
      error: 'Test resume upload failed',
      details: err.message
    })
  }
})

/**
 * Serve local files when Cloudinary is not available
 */
router.get('/file/:filename', async (req, res) => {
  try {
    const filename = req.params.filename
    const download = req.query.download === 'true' // Check if download is requested
    console.log('Serving file:', filename, download ? '(download)' : '(preview)')
    
    // First, try to find the resume by filename in database
    const resume = await db.Resume.findOne({
      where: { fileName: filename }
    })
    
    if (!resume) {
      console.log('Resume not found for filename:', filename)
      return res.status(404).json({ error: 'File not found' })
    }
    
    // If we have file content in database, serve it
    if (resume.fileContent) {
      console.log('Serving file from database, size:', resume.fileContent.length)
      
      // Set appropriate headers based on whether it's download or preview
      if (download) {
        // Force download - don't change this, it's working
        res.setHeader('Content-Type', 'application/octet-stream')
        res.setHeader('Content-Disposition', `attachment; filename="${resume.originalName}"`)
      } else {
        // For preview - enhanced headers for proper PDF display
        const contentType = resume.mimeType || 'application/pdf'
        res.setHeader('Content-Type', contentType)
        res.setHeader('Content-Disposition', 'inline')
        
        // Additional headers for better PDF preview and cache busting
        res.setHeader('Accept-Ranges', 'bytes')
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate')
        res.setHeader('Pragma', 'no-cache')
        res.setHeader('Expires', '0')
        res.setHeader('ETag', `"${resume.id}-${resume.fileContent.length}"`)
        
        // CORS headers for cross-origin preview
        res.setHeader('Access-Control-Allow-Origin', '*')
        res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS')
        res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, Cache-Control')
        res.setHeader('Access-Control-Expose-Headers', 'Content-Length, Content-Type, Content-Disposition')
        
        console.log('Preview headers set:', {
          contentType,
          disposition: 'inline',
          size: resume.fileContent.length,
          etag: `"${resume.id}-${resume.fileContent.length}"`
        })
      }
      
      res.setHeader('Content-Length', resume.fileContent.length)
      res.send(resume.fileContent)
      return
    }
    
    // Fallback to filesystem (though this likely won't work on Railway)
    const filePath = path.join(process.cwd(), 'uploads', filename)
    console.log('Trying file path:', filePath)
    
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      console.log('File not found:', filePath)
      return res.status(404).json({ error: 'File not found' })
    }
    
    // Get file stats to determine content type
    const stats = fs.statSync(filePath)
    
    // Set appropriate headers based on whether it's download or preview
    if (download) {
      // Force download
      res.setHeader('Content-Type', 'application/octet-stream')
      res.setHeader('Content-Disposition', `attachment; filename="${resume.originalName}"`)
    } else {
      // For preview - set correct content type
      res.setHeader('Content-Type', resume.mimeType || 'application/pdf')
      res.setHeader('Content-Disposition', 'inline')
    }
    
    res.setHeader('Content-Length', stats.size)
    
    // Stream the file
    const fileStream = fs.createReadStream(filePath)
    fileStream.pipe(res)
    
  } catch (error) {
    console.error('File serving error:', error)
    res.status(500).json({ error: 'Failed to serve file' })
  }
})

/**
 * Cleanup endpoint to remove broken resume records
 * This removes resumes that have local file paths but no accessible files
 */
router.delete('/cleanup-broken', async (req, res) => {
  try {
    console.log('🧹 Starting broken resume cleanup...')
    
    // Find resumes with local file paths but no file content or cloudinary URL
    const brokenResumes = await db.Resume.findAll({
      where: {
        [db.Sequelize.Op.and]: [
          // Has local file path in s3Url
          {
            s3Url: {
              [db.Sequelize.Op.or]: [
                { [db.Sequelize.Op.like]: '/uploads/%' },
                { [db.Sequelize.Op.like]: 'local://%' }
              ]
            }
          },
          // No Cloudinary URL
          {
            [db.Sequelize.Op.or]: [
              { cloudinaryUrl: null },
              { cloudinaryUrl: '' }
            ]
          },
          // No file content in database
          {
            [db.Sequelize.Op.or]: [
              { fileContent: null },
              { fileContent: '' }
            ]
          }
        ]
      }
    })

    console.log(`📊 Found ${brokenResumes.length} broken resume records`)

    if (brokenResumes.length === 0) {
      return res.json({
        message: 'No broken resumes found! Database is clean.',
        deletedCount: 0,
        brokenResumes: []
      })
    }

    // Log details of what will be deleted
    const resumeDetails = brokenResumes.map(resume => ({
      id: resume.id,
      title: resume.title,
      userId: resume.userId,
      originalName: resume.originalName,
      s3Url: resume.s3Url,
      createdAt: resume.createdAt,
      downloadCount: resume.downloadCount
    }))

    console.log('📋 Broken resume details:', resumeDetails)
    
    console.log('🗑️  Deleting broken resume records...')
    
    let deletedCount = 0
    const deletedResumes = []
    
    for (const resume of brokenResumes) {
      try {
        const resumeInfo = {
          id: resume.id,
          title: resume.title,
          userId: resume.userId,
          originalName: resume.originalName
        }
        
        await resume.destroy()
        console.log(`✅ Deleted: "${resume.title}" (ID: ${resume.id})`)
        deletedCount++
        deletedResumes.push(resumeInfo)
      } catch (error) {
        console.log(`❌ Failed to delete resume ID ${resume.id}: ${error.message}`)
      }
    }

    console.log(`🎯 Cleanup completed! Deleted ${deletedCount} broken resume records`)

    res.json({
      message: `Cleanup completed! Deleted ${deletedCount} broken resume records.`,
      deletedCount,
      totalFound: brokenResumes.length,
      deletedResumes,
      nextSteps: [
        'Users should re-upload their resumes through the frontend',
        'New uploads will use database storage and work properly on Railway',
        'Test upload/preview/download functionality'
      ]
    })

  } catch (error) {
    console.error('❌ Cleanup failed:', error)
    res.status(500).json({ 
      error: 'Cleanup failed',
      details: error.message 
    })
  }
})

export default router
