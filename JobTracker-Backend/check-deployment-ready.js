#!/usr/bin/env node

/**
 * Pre-deployment validation script
 * Checks if the backend is ready for Railway deployment
 */

import fs from 'fs'
import path from 'path'

console.log('🔍 JobTracker Backend - Railway Deployment Readiness Check\n')

const checks = [
  {
    name: 'package.json exists and has required scripts',
    check: () => {
      try {
        const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'))
        return pkg.scripts.start && pkg.scripts.build && pkg.scripts.postinstall
      } catch {
        return false
      }
    }
  },
  {
    name: 'Prisma schema uses PostgreSQL',
    check: () => {
      try {
        const schema = fs.readFileSync('prisma/schema.prisma', 'utf8')
        return schema.includes('provider = "postgresql"')
      } catch {
        return false
      }
    }
  },
  {
    name: 'PostgreSQL driver (pg) is installed',
    check: () => {
      try {
        const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'))
        return pkg.dependencies.pg || pkg.devDependencies.pg
      } catch {
        return false
      }
    }
  },
  {
    name: 'railway.json configuration exists',
    check: () => fs.existsSync('railway.json')
  },
  {
    name: 'Dockerfile exists',
    check: () => fs.existsSync('Dockerfile')
  },
  {
    name: '.dockerignore exists',
    check: () => fs.existsSync('.dockerignore')
  },
  {
    name: '.gitignore exists',
    check: () => fs.existsSync('.gitignore')
  },
  {
    name: 'Server port is configurable',
    check: () => {
      try {
        const server = fs.readFileSync('src/server.js', 'utf8')
        return server.includes('process.env.PORT')
      } catch {
        return false
      }
    }
  },
  {
    name: 'Environment example files exist',
    check: () => fs.existsSync('.env.example')
  }
]

let allPassed = true

checks.forEach(({ name, check }) => {
  const passed = check()
  console.log(`${passed ? '✅' : '❌'} ${name}`)
  if (!passed) allPassed = false
})

console.log('\n' + '='.repeat(60))

if (allPassed) {
  console.log('🎉 All checks passed! Your backend is ready for Railway deployment.')
  console.log('\n📋 Next steps:')
  console.log('1. Push your code to GitHub')
  console.log('2. Go to railway.app and create a new project')
  console.log('3. Connect your GitHub repository')
  console.log('4. Add PostgreSQL service')
  console.log('5. Set environment variables')
  console.log('6. Deploy!')
  console.log('\n📖 See RAILWAY-DEPLOYMENT-CHECKLIST.md for detailed instructions')
} else {
  console.log('❌ Some checks failed. Please fix the issues above before deploying.')
}

console.log('\n🔗 Helpful links:')
console.log('• Railway: https://railway.app')
console.log('• Documentation: ./RAILWAY-DEPLOYMENT-GUIDE.md')
console.log('• Checklist: ./RAILWAY-DEPLOYMENT-CHECKLIST.md')
