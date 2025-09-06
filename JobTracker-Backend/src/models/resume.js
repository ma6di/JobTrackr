// src/models/resume.js
import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const Resume = sequelize.define('Resume', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    originalName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    fileName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    s3Url: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    cloudinaryUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    cloudinaryPublicId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    fileContent: {
      type: DataTypes.BLOB('long'),
      allowNull: true,
      comment: 'Binary file content when Cloudinary is not available'
    },
    fileSize: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    mimeType: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    resumeType: {
      type: DataTypes.STRING,
      defaultValue: 'general',
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false,
    },
    downloadCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false,
    },
  }, {
    timestamps: true,
    tableName: 'resumes',
  });

  return Resume;
};
