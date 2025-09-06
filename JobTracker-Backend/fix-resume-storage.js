#!/usr/bin/env node

// Fix resume storage - migrate old local file references to database storage
import db from './src/models/index.js'
import fs from 'fs'
import path from 'path'

console.log('🔍 Checking resume records for storage issues...')

async function fixResumeStorage() {
  try {
    // Find all resumes that have local file paths but no database content
    const problematicResumes = await db.Resume.findAll({
      where: {
        s3Url: {
          [db.Sequelize.Op.like]: '/uploads/%'
        },
        fileContent: null
      }
    })

    console.log(`📊 Found ${problematicResumes.length} resumes with local file references`)

    if (problematicResumes.length === 0) {
      console.log('✅ No problematic resumes found!')
      return
    }

    for (const resume of problematicResumes) {
      console.log(`\n📄 Processing resume: ${resume.title} (ID: ${resume.id})`)
      console.log(`   Current s3Url: ${resume.s3Url}`)
      
      const filename = resume.s3Url.replace('/uploads/', '')
      const localPath = path.join(process.cwd(), 'uploads', filename)
      
      console.log(`   Looking for file at: ${localPath}`)
      
      if (fs.existsSync(localPath)) {
        // File exists locally - migrate to database storage
        try {
          const fileContent = fs.readFileSync(localPath)
          
          await resume.update({
            s3Url: 'database://content',
            fileContent: fileContent
          })
          
          console.log(`   ✅ Migrated to database storage (${fileContent.length} bytes)`)
        } catch (error) {
          console.log(`   ❌ Failed to migrate: ${error.message}`)
        }
      } else {
        // File doesn't exist - mark for cleanup or deletion
        console.log(`   ⚠️  Local file not found`)
        console.log(`   Options:`)
        console.log(`     1. Delete this resume record (file is lost)`)
        console.log(`     2. Ask user to re-upload`)
        
        // For now, just log - don't auto-delete
        console.log(`   📝 Keeping record for user to handle manually`)
      }
    }
    
    console.log('\n✅ Resume storage fix completed!')
    console.log('💡 Users should re-upload any resumes that show "File not found" errors')
    
  } catch (error) {
    console.error('❌ Error fixing resume storage:', error)
  } finally {
    await db.sequelize.close()
  }
}

fixResumeStorage()
