const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Course = sequelize.define('Course', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  title_ar: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  title_ur: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  category: {
    type: DataTypes.ENUM('Quran', 'Arabic', 'Fiqh', 'Sarf', 'Hadith'),
    allowNull: false
  },
  level: {
    type: DataTypes.ENUM('Beginner', 'Intermediate', 'Advanced', 'Specialized'),
    allowNull: false
  },
  duration: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  fee_usd: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  fee_pkr: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  prerequisites: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  description_ar: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  description_ur: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  learning_outcomes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  learning_outcomes_ar: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  learning_outcomes_ur: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  main_books: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  schedule: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  image: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  teacher_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'teachers',
      key: 'id'
    }
  },
  status: {
    type: DataTypes.ENUM('active', 'inactive', 'draft'),
    defaultValue: 'active'
  },
  students_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  sort_order: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
}, {
  tableName: 'courses',
  timestamps: true,
  underscored: true
});

module.exports = Course;
