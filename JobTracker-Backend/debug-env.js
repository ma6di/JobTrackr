#!/usr/bin/env node

console.log('🔍 Railway Environment Debug')
console.log('===========================')
console.log('NODE_ENV:', process.env.NODE_ENV)
console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'SET' : 'NOT SET')
console.log('DATABASE_URL value:', process.env.DATABASE_URL)
console.log('PORT:', process.env.PORT)
console.log('JWT_SECRET:', process.env.JWT_SECRET ? 'SET' : 'NOT SET')
console.log('===========================')

if (process.env.DATABASE_URL) {
  try {
    const url = new URL(process.env.DATABASE_URL)
    console.log('Database host:', url.hostname)
    console.log('Database port:', url.port)
    console.log('Database name:', url.pathname)
  } catch (e) {
    console.log('❌ Invalid DATABASE_URL format:', e.message)
  }
} else {
  console.log('❌ DATABASE_URL not found in environment')
}
