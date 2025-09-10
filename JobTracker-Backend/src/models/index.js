// src/models/index.js
import { Sequelize } from 'sequelize';
import ResumeModel from './resume.js';

// Debug environment variables
console.log('Environment variables check:', {
  NODE_ENV: process.env.NODE_ENV,
  DATABASE_URL_exists: !!process.env.DATABASE_URL,
  DATABASE_URL_length: process.env.DATABASE_URL?.length || 0
});

// Validate DATABASE_URL exists
if (!process.env.DATABASE_URL) {
  console.error('❌ DATABASE_URL environment variable is not set!');
  console.error('Available environment variables:', Object.keys(process.env).filter(key => key.includes('DATABASE') || key.includes('DB')));
  process.exit(1);
}

// You may need to adjust the DB connection below
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres', // or 'mysql', 'sqlite', etc.
  logging: false,
});

const Resume = ResumeModel(sequelize);

const db = {
  sequelize,
  Sequelize,
  Resume,
};

export default db;
