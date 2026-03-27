const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Student = sequelize.define('Student', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  father_name: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  whatsapp: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  date_of_birth: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  gender: {
    type: DataTypes.ENUM('male', 'female'),
    allowNull: true
  },
  course_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'courses',
      key: 'id'
    }
  },
  study_mode: {
    type: DataTypes.ENUM('one-to-one', 'group'),
    defaultValue: 'one-to-one'
  },
  preferred_time: {
    type: DataTypes.ENUM('morning', 'afternoon', 'evening', 'night'),
    defaultValue: 'morning'
  },
  weekly_availability: {
    type: DataTypes.JSON,
    allowNull: true
  },
  applied_for: {
    type: DataTypes.ENUM('Nazra', 'Tajweed', 'Hifz', 'Arabic', 'Fiqh', 'Hadith'),
    allowNull: true
  },
  additional_message: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  enrollment_status: {
    type: DataTypes.ENUM('pending', 'approved', 'rejected', 'completed'),
    defaultValue: 'pending'
  },
  progress: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  address: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'students',
  timestamps: true,
  underscored: true
});

module.exports = Student;
