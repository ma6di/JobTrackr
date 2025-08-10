// Script to check password hashes and potentially update them
import { PrismaClient } from '@prisma/client'
import { hashPassword, verifyPassword } from './src/utils/auth.js'

const prisma = new PrismaClient()

async function checkPasswords() {
  try {
    console.log('Checking password hashes...')
    
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        password: true, // We need this to check the hash
        firstName: true,
        lastName: true,
      }
    })
    
    console.log(`Found ${users.length} users`)
    
    for (const user of users) {
      console.log(`\nChecking user: ${user.email}`)
      console.log(`Password hash length: ${user.password.length}`)
      console.log(`Starts with $2b$ (bcrypt): ${user.password.startsWith('$2b$')}`)
      
      // Test common passwords
      const commonPasswords = [
        'password',
        'password123',
        '123456',
        'Password123!',
        'TestPass123!',
        'test123',
        'admin',
        'qwerty'
      ]
      
      console.log('Testing common passwords:')
      for (const testPassword of commonPasswords) {
        try {
          const isValid = await verifyPassword(testPassword, user.password)
          if (isValid) {
            console.log(`✅ FOUND WORKING PASSWORD: "${testPassword}" for ${user.email}`)
          }
        } catch (error) {
          // Silent - just means password doesn't match
        }
      }
    }
    
  } catch (error) {
    console.error('Error checking passwords:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkPasswords()
