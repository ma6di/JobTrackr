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
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' })
    }

    const { title, description } = req.body

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      resource_type: 'raw', // important for PDFs/docs
      folder: 'resumes',
      public_id: `user_${req.user.id}_${Date.now()}`,
    })

    // Save DB record
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

    res.status(201).json(resume)
  } catch (err) {
    console.error('Resume upload error:', err)
    res.status(500).json({ error: 'Resume upload failed' })
  }
})

/**
 * Get all resumes for logged-in user
 */
router.get('/', async (req, res) => {
  try {
    const resumes = await db.Resume.findAll({
      where: { userId: req.user.id },
      order: [['createdAt', 'DESC']],
    })
    res.json(resumes)
  } catch (err) {
    console.error('Fetch resumes error:', err)
    res.status(500).json({ error: 'Failed to fetch resumes' })
  }
})

/**
 * Preview a resume → redirect to Cloudinary
 */
router.get('/:id/preview', async (req, res) => {
  try {
    const resume = await db.Resume.findByPk(req.params.id)
    if (!resume || resume.userId !== req.user.id) {
      return res.status(404).json({ error: 'Resume not found' })
    }
    res.redirect(resume.cloudinaryUrl)
  } catch (err) {
    console.error('Preview error:', err)
    res.status(500).json({ error: 'Failed to preview resume' })
  }
})

/**
 * Download a resume → redirect to Cloudinary
 */
router.get('/:id/download', async (req, res) => {
  try {
    const resume = await db.Resume.findByPk(req.params.id)
    if (!resume || resume.userId !== req.user.id) {
      return res.status(404).json({ error: 'Resume not found' })
    }
    
    // Increment download count
    await resume.increment('downloadCount')
    
    res.redirect(resume.cloudinaryUrl) // Cloudinary serves the file
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
