#!/usr/bin/env node

/**
 * Generate a secure JWT secret for production use
 * Run with: node generate-jwt-secret.js
 */

import crypto from 'crypto'

// Generate a secure random string for JWT secret
const jwtSecret = crypto.randomBytes(64).toString('hex')

console.log('🔐 Generated JWT Secret for Production:')
console.log('')
console.log(`JWT_SECRET=${jwtSecret}`)
console.log('')
console.log('✅ Copy this to your Railway environment variables')
console.log('⚠️  Keep this secret secure and never share it!')
console.log('')
console.log('To use in Railway:')
console.log('1. Go to your Railway project dashboard')
console.log('2. Click on your backend service')
console.log('3. Go to Variables tab')
console.log('4. Add JWT_SECRET with the value above')
