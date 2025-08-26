// src/models/index.js
import { Sequelize } from 'sequelize';
import ResumeModel from './resume.js';

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
