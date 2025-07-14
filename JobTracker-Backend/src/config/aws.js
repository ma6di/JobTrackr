/*
  LEARNING COMMENT: AWS Services Configuration Module
  - Configures AWS SDK for S3 file storage and other services
  - Handles AWS credentials and region settings
  - Provides reusable AWS service instances for the application
*/

import { S3Client } from '@aws-sdk/client-s3'
import AWS from 'aws-sdk'

/* 
  LEARNING COMMENT: AWS Configuration Variables
  - Loads AWS settings from environment variables
  - Provides defaults for development environment
  - Keeps sensitive credentials in .env file
*/
const AWS_REGION = process.env.AWS_REGION || 'us-east-1'
const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID
const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY
const AWS_S3_BUCKET = process.env.AWS_S3_BUCKET || 'jobtracker-resumes'

/* 
  LEARNING COMMENT: AWS SDK v3 S3 Client
  - Modern AWS SDK v3 for S3 operations
  - More efficient and modular than v2
  - Used for file uploads, downloads, and management
*/
let s3Client

/* 
  LEARNING COMMENT: Legacy AWS SDK v2 (for compatibility)
  - Some libraries (like multer-s3) still use v2
  - We'll configure both versions for maximum compatibility
  - v2 will be phased out gradually
*/
let s3v2

/* 
  LEARNING COMMENT: AWS Configuration Function
  - Sets up AWS services with proper credentials
  - Validates configuration and connectivity
  - Creates reusable service instances
*/
export async function configureAWS() {
  try {
    // Check if AWS credentials are provided
    if (!AWS_ACCESS_KEY_ID || !AWS_SECRET_ACCESS_KEY) {
      console.warn('⚠️  AWS credentials not found - S3 features will be disabled')
      console.warn('🔍 Set AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY in .env file')
      return
    }

    /* 
      LEARNING COMMENT: AWS SDK v3 S3 Client Setup
      - region: AWS region where S3 bucket is located
      - credentials: Access key and secret for authentication
      - Used for modern S3 operations
    */
    s3Client = new S3Client({
      region: AWS_REGION,
      credentials: {
        accessKeyId: AWS_ACCESS_KEY_ID,
        secretAccessKey: AWS_SECRET_ACCESS_KEY
      }
    })

    /* 
      LEARNING COMMENT: AWS SDK v2 Configuration
      - Global configuration for legacy SDK
      - Used by multer-s3 and other v2-compatible libraries
      - Will be migrated to v3 over time
    */
    AWS.config.update({
      accessKeyId: AWS_ACCESS_KEY_ID,
      secretAccessKey: AWS_SECRET_ACCESS_KEY,
      region: AWS_REGION
    })

    // Create v2 S3 instance for multer-s3 compatibility
    s3v2 = new AWS.S3()

    /* 
      LEARNING COMMENT: S3 Bucket Validation
      - Tests if the configured S3 bucket exists and is accessible
      - Provides early error detection for misconfigured buckets
      - Helps with debugging AWS setup issues
    */
    try {
      await s3v2.headBucket({ Bucket: AWS_S3_BUCKET }).promise()
      console.log(`✅ S3 bucket '${AWS_S3_BUCKET}' is accessible`)
    } catch (bucketError) {
      console.warn(`⚠️  S3 bucket '${AWS_S3_BUCKET}' is not accessible:`, bucketError.message)
      console.warn('🔍 Please check bucket name and permissions')
    }

    console.log(`✅ AWS services configured for region: ${AWS_REGION}`)

  } catch (error) {
    console.error('❌ AWS configuration failed:', error.message)
    
    // Provide helpful error messages for common AWS issues
    if (error.message.includes('InvalidAccessKeyId')) {
      console.error('🔍 Suggestion: Check your AWS_ACCESS_KEY_ID')
    } else if (error.message.includes('SignatureDoesNotMatch')) {
      console.error('🔍 Suggestion: Check your AWS_SECRET_ACCESS_KEY')
    } else if (error.message.includes('region')) {
      console.error('🔍 Suggestion: Check your AWS_REGION setting')
    }
    
    throw error
  }
}

/* 
  LEARNING COMMENT: S3 Health Check Function
  - Tests S3 connectivity and permissions
  - Used by health check endpoints
  - Returns S3 service status
*/
export async function checkS3Health() {
  try {
    if (!s3v2) {
      return {
        status: 'disabled',
        message: 'S3 not configured'
      }
    }

    const startTime = Date.now()
    await s3v2.headBucket({ Bucket: AWS_S3_BUCKET }).promise()
    const responseTime = Date.now() - startTime

    return {
      status: 'healthy',
      bucket: AWS_S3_BUCKET,
      region: AWS_REGION,
      responseTime: `${responseTime}ms`
    }
  } catch (error) {
    return {
      status: 'unhealthy',
      error: error.message,
      bucket: AWS_S3_BUCKET
    }
  }
}

/* 
  LEARNING COMMENT: S3 Upload Configuration Helper
  - Provides standard S3 upload settings
  - Used by multer-s3 middleware
  - Centralizes file upload configuration
*/
export function getS3UploadConfig() {
  return {
    s3: s3v2,
    bucket: AWS_S3_BUCKET,
    metadata: function (req, file, cb) {
      cb(null, {
        fieldName: file.fieldname,
        uploadedBy: req.user?.id || 'anonymous',
        uploadedAt: new Date().toISOString()
      })
    },
    key: function (req, file, cb) {
      // Generate unique filename: userId/timestamp-originalname
      const userId = req.user?.id || 'guest'
      const timestamp = Date.now()
      const filename = `${userId}/${timestamp}-${file.originalname}`
      cb(null, filename)
    },
    contentType: function (req, file, cb) {
      cb(null, file.mimetype)
    }
  }
}

/* 
  LEARNING COMMENT: Export AWS Service Instances
  - Makes AWS services available throughout the application
  - Used in controllers and middleware for file operations
  - Provides both v2 and v3 clients for flexibility
*/
export { s3Client, s3v2, AWS_S3_BUCKET, AWS_REGION }

export default {
  s3Client,
  s3v2,
  bucket: AWS_S3_BUCKET,
  region: AWS_REGION,
  configureAWS,
  checkS3Health,
  getS3UploadConfig
}
