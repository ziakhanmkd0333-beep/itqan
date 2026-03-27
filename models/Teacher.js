const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Teacher = sequelize.define('Teacher', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  full_name: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true
  },
  phone: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  country: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  city: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  highest_qualification: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  field_of_study: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  institution_name: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  year_of_completion: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  total_experience: {
    type: DataTypes.ENUM('1 Year', '2-3 Years', '5+ Years', '10+ Years'),
    allowNull: true
  },
  teaching_type: {
    type: DataTypes.ENUM('Online', 'Physical', 'Both'),
    allowNull: true
  },
  previously_taught_subjects: {
    type: DataTypes.JSON,
    allowNull: true
  },
  primary_specialization: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  secondary_specialization: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  languages_known: {
    type: DataTypes.JSON,
    allowNull: true
  },
  preferred_teaching_language: {
    type: DataTypes.ENUM('English', 'Urdu', 'Arabic', 'Hindi', 'Punjabi', 'Bengali', 'Persian'),
    defaultValue: 'English'
  },
  available_days: {
    type: DataTypes.JSON,
    allowNull: true
  },
  available_time_slots: {
    type: DataTypes.JSON,
    allowNull: true
  },
  device_type: {
    type: DataTypes.ENUM('Mobile', 'Laptop', 'Tablet'),
    allowNull: true
  },
  internet_quality: {
    type: DataTypes.ENUM('Excellent', 'Good', 'Average'),
    allowNull: true
  },
  cv_file: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  certificates: {
    type: DataTypes.JSON,
    allowNull: true
  },
  why_teach_at_itqan: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  short_bio: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  application_status: {
    type: DataTypes.ENUM('pending', 'approved', 'rejected'),
    defaultValue: 'pending'
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: true
  }
}, {
  tableName: 'teachers',
  timestamps: true,
  underscored: true
});

module.exports = Teacher;
