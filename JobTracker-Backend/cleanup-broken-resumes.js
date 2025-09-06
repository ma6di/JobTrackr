#!/usr/bin/env node

// Cleanup script for broken resume records
// This removes resume records that have local file paths but no accessible files

import dotenv from 'dotenv'
import { Sequelize, DataTypes } from 'sequelize'

// Load environment variables
dotenv.config()

console.log('🧹 JobTracker Resume Cleanup Script')
console.log('=====================================')

// Create Sequelize connection
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgresql',
  logging: false, // Set to console.log to see SQL queries
  dialectOptions: {
    ssl: process.env.NODE_ENV === 'production' ? {
      require: true,
      rejectUnauthorized: false
    } : false
  }
})

// Define Resume model inline
const Resume = sequelize.define('Resume', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  originalName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  fileName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  s3Url: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  cloudinaryUrl: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  cloudinaryPublicId: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  fileContent: {
    type: DataTypes.BLOB('long'),
    allowNull: true,
  },
  fileSize: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  mimeType: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  resumeType: {
    type: DataTypes.STRING,
    defaultValue: 'general',
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    allowNull: false,
  },
  downloadCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    allowNull: false,
  },
}, {
  timestamps: true,
  tableName: 'resumes',
})

async function cleanupBrokenResumes() {
  try {
    console.log('🔗 Connecting to database...')
    await sequelize.authenticate()
    console.log('✅ Database connection established')

    console.log('\n🔍 Scanning for broken resume records...')
    
    // Find resumes with local file paths but no file content or cloudinary URL
    const brokenResumes = await Resume.findAll({
      where: {
        [Sequelize.Op.and]: [
          // Has local file path in s3Url
          {
            s3Url: {
              [Sequelize.Op.or]: [
                { [Sequelize.Op.like]: '/uploads/%' },
                { [Sequelize.Op.like]: 'local://%' }
              ]
            }
          },
          // No Cloudinary URL
          {
            [Sequelize.Op.or]: [
              { cloudinaryUrl: null },
              { cloudinaryUrl: '' }
            ]
          },
          // No file content in database
          {
            [Sequelize.Op.or]: [
              { fileContent: null },
              { fileContent: '' }
            ]
          }
        ]
      }
    })

    console.log(`📊 Found ${brokenResumes.length} broken resume records`)

    if (brokenResumes.length === 0) {
      console.log('🎉 No broken resumes found! Your database is clean.')
      return
    }

    console.log('\n📋 Broken resume details:')
    brokenResumes.forEach((resume, index) => {
      console.log(`${index + 1}. "${resume.title}" (ID: ${resume.id})`)
      console.log(`   User ID: ${resume.userId}`)
      console.log(`   File: ${resume.originalName}`)
      console.log(`   S3 URL: ${resume.s3Url}`)
      console.log(`   Created: ${resume.createdAt}`)
      console.log(`   Downloads: ${resume.downloadCount}`)
      console.log('')
    })

    // Ask for confirmation before deleting
    console.log('⚠️  WARNING: This will permanently delete these resume records!')
    console.log('💡 Users will need to re-upload their resumes after cleanup.')
    console.log('')
    console.log('🔄 Proceeding with cleanup in 3 seconds...')
    
    // Wait 3 seconds
    await new Promise(resolve => setTimeout(resolve, 3000))
    
    console.log('\n🗑️  Deleting broken resume records...')
    
    let deletedCount = 0
    for (const resume of brokenResumes) {
      try {
        await resume.destroy()
        console.log(`✅ Deleted: "${resume.title}" (ID: ${resume.id})`)
        deletedCount++
      } catch (error) {
        console.log(`❌ Failed to delete resume ID ${resume.id}: ${error.message}`)
      }
    }

    console.log(`\n🎯 Cleanup completed!`)
    console.log(`✅ Successfully deleted: ${deletedCount} records`)
    console.log(`❌ Failed to delete: ${brokenResumes.length - deletedCount} records`)
    
    if (deletedCount > 0) {
      console.log('\n📝 Next steps:')
      console.log('1. Users should now re-upload their resumes through the frontend')
      console.log('2. New uploads will use database storage and work on Railway')
      console.log('3. Test upload/preview/download functionality')
    }

  } catch (error) {
    console.error('❌ Cleanup failed:', error.message)
    if (error.name === 'SequelizeConnectionError') {
      console.error('💡 Make sure your DATABASE_URL environment variable is set correctly')
    }
  } finally {
    console.log('\n🔌 Closing database connection...')
    await sequelize.close()
    console.log('👋 Cleanup script finished')
  }
}

// Run the cleanup
cleanupBrokenResumes().catch(console.error)
