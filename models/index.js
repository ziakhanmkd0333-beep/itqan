const sequelize = require('../config/database');

// Import models
const User = require('./User');
const Student = require('./Student');
const Teacher = require('./Teacher');
const Course = require('./Course');
const Blog = require('./Blog');
const Admission = require('./Admission');
const Notification = require('./Notification');

// Define associations
User.hasOne(Student, { foreignKey: 'user_id', as: 'student' });
Student.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

User.hasOne(Teacher, { foreignKey: 'user_id', as: 'teacher' });
Teacher.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

User.hasMany(Blog, { foreignKey: 'author_id', as: 'blogs' });
Blog.belongsTo(User, { foreignKey: 'author_id', as: 'author' });

User.hasMany(Admission, { foreignKey: 'reviewed_by', as: 'reviewedAdmissions' });
Admission.belongsTo(User, { foreignKey: 'reviewed_by', as: 'reviewer' });

User.hasMany(Notification, { foreignKey: 'created_by', as: 'createdNotifications' });
Notification.belongsTo(User, { foreignKey: 'created_by', as: 'creator' });

Student.belongsTo(Course, { foreignKey: 'course_id', as: 'course' });
Course.hasMany(Student, { foreignKey: 'course_id', as: 'students' });

Teacher.hasMany(Course, { foreignKey: 'teacher_id', as: 'courses' });
Course.belongsTo(Teacher, { foreignKey: 'teacher_id', as: 'teacher' });

module.exports = {
  sequelize,
  User,
  Student,
  Teacher,
  Course,
  Blog,
  Admission,
  Notification
};
