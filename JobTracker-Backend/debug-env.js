#!/usr/bin/env node

console.log('🔍 Railway Environment Debug')
console.log('===========================')
console.log('NODE_ENV:', process.env.NODE_ENV)
console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'SET' : 'NOT SET')
console.log('DATABASE_URL value:', process.env.DATABASE_URL)
console.log('PORT:', process.env.PORT)
console.log('JWT_SECRET:', process.env.JWT_SECRET ? 'SET' : 'NOT SET')
console.log('===========================')

// Show all environment variables that might be database-related
console.log('\n🔍 All Database-Related Environment Variables:')
Object.keys(process.env)
  .filter(key => key.toLowerCase().includes('database') || 
                 key.toLowerCase().includes('postgres') || 
                 key.toLowerCase().includes('db'))
  .forEach(key => {
    console.log(`${key}:`, process.env[key])
  })

console.log('\n🔍 All Railway Environment Variables:')
Object.keys(process.env)
  .filter(key => key.startsWith('RAILWAY_'))
  .forEach(key => {
    console.log(`${key}:`, process.env[key])
  })

if (process.env.DATABASE_URL) {
  try {
    const url = new URL(process.env.DATABASE_URL)
    console.log('\n📊 Database Connection Details:')
    console.log('Database host:', url.hostname)
    console.log('Database port:', url.port)
    console.log('Database name:', url.pathname)
    console.log('Database user:', url.username)
  } catch (e) {
    console.log('❌ Invalid DATABASE_URL format:', e.message)
  }
} else {
  console.log('\n❌ DATABASE_URL not found in environment')
}
