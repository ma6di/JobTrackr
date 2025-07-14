// Quick test script to check database and create test user
import { PrismaClient } from '@prisma/client'
import { hashPassword } from './src/utils/auth.js'

const prisma = new PrismaClient()

async function testAuth() {
  try {
    console.log('🔍 Checking existing users...')
    
    // Check all users
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        createdAt: true
      }
    })
    
    console.log(`Found ${users.length} users:`)
    users.forEach(user => {
      console.log(`- ${user.email} (${user.firstName} ${user.lastName})`)
    })
    
    // Update the existing user's password to a known value
    if (users.length > 0) {
      console.log('\n🔄 Updating user password to: Test123!')
      
      const hashedPassword = await hashPassword('Test123!')
      
      const updatedUser = await prisma.user.update({
        where: { email: 'mahdi.cheraghali@gmail.com' },
        data: { password: hashedPassword },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true
        }
      })
      
      console.log('✅ Password updated for user:')
      console.log(`- Email: ${updatedUser.email}`)
      console.log(`- New Password: Test123!`)
      console.log(`- Name: ${updatedUser.firstName} ${updatedUser.lastName}`)
    }
    
    // Create a test user if none exist
    if (users.length === 0) {
      console.log('\n🆕 Creating test user...')
      
      const hashedPassword = await hashPassword('Test123!')
      
      const testUser = await prisma.user.create({
        data: {
          email: 'test@example.com',
          password: hashedPassword,
          firstName: 'Test',
          lastName: 'User',
          phone: '555-0123',
          location: 'San Francisco, CA'
        },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          createdAt: true
        }
      })
      
      console.log('✅ Test user created:')
      console.log(`- Email: ${testUser.email}`)
      console.log(`- Password: Test123!`)
      console.log(`- Name: ${testUser.firstName} ${testUser.lastName}`)
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message)
  } finally {
    await prisma.$disconnect()
  }
}

testAuth()
