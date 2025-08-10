// Script to check existing users in the database
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function checkUsers() {
  try {
    console.log('Checking users in database...')
    
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        createdAt: true,
        // Don't select password for security
      }
    })
    
    console.log('Found users:')
    console.table(users)
    
    if (users.length === 0) {
      console.log('\n❌ No users found in database!')
      console.log('This explains why login is not working.')
      console.log('\nTo fix this, you need to:')
      console.log('1. Start the backend server')
      console.log('2. Register a new user via the registration page')
      console.log('3. Or use the test-user-creation.html file')
    } else {
      console.log(`\n✅ Found ${users.length} user(s) in database`)
      console.log('If login still fails, it might be a password issue.')
    }
    
  } catch (error) {
    console.error('Error checking users:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkUsers()
