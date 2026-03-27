const { User, Student, Teacher, Course, Blog, Admission, Notification, sequelize } = require('../models');
const { Op } = require('sequelize');

exports.getDashboardStats = async (req, res) => {
  try {
    const today = new Date();
    const thirtyDaysAgo = new Date(today - 30 * 24 * 60 * 60 * 1000);
    
    // Get counts
    const [
      totalStudents,
      totalTeachers,
      totalCourses,
      totalBlogs,
      pendingAdmissions,
      recentStudents,
      recentAdmissions
    ] = await Promise.all([
      Student.count(),
      Teacher.count(),
      Course.count({ where: { status: 'active' } }),
      Blog.count({ where: { status: 'published' } }),
      Admission.count({ where: { status: 'pending' } }),
      Student.count({
        where: {
          created_at: { [Op.gte]: thirtyDaysAgo }
        }
      }),
      Admission.count({
        where: {
          created_at: { [Op.gte]: thirtyDaysAgo }
        }
      })
    ]);
    
    // Get course enrollment stats
    const courseStats = await Course.findAll({
      where: { status: 'active' },
      attributes: ['id', 'title', 'students_count', 'category'],
      order: [['students_count', 'DESC']],
      limit: 5
    });
    
    // Get monthly admissions data
    const monthlyAdmissions = await Admission.findAll({
      attributes: [
        [sequelize.fn('DATE_FORMAT', sequelize.col('created_at'), '%Y-%m'), 'month'],
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      where: {
        created_at: { [Op.gte]: thirtyDaysAgo }
      },
      group: [sequelize.fn('DATE_FORMAT', sequelize.col('created_at'), '%Y-%m')],
      raw: true
    });
    
    res.json({
      success: true,
      data: {
        stats: {
          totalStudents,
          totalTeachers,
          totalCourses,
          totalBlogs,
          pendingAdmissions,
          recentStudents,
          recentAdmissions
        },
        courseStats,
        monthlyAdmissions
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard stats',
      error: error.message
    });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const { 
      role,
      status,
      search,
      page = 1, 
      limit = 20
    } = req.query;
    
    const whereClause = {};
    
    if (role) {
      whereClause.role = role;
    }
    
    if (status) {
      whereClause.status = status;
    }
    
    if (search) {
      whereClause[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } }
      ];
    }
    
    const offset = (page - 1) * limit;
    
    const { count, rows: users } = await User.findAndCountAll({
      where: whereClause,
      attributes: { exclude: ['password'] },
      order: [['created_at', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });
    
    res.json({
      success: true,
      data: {
        users,
        pagination: {
          total: count,
          page: parseInt(page),
          pages: Math.ceil(count / limit),
          limit: parseInt(limit)
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch users',
      error: error.message
    });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const user = await User.findByPk(id, {
      attributes: { exclude: ['password'] },
      include: [
        {
          model: Student,
          as: 'student'
        },
        {
          model: Teacher,
          as: 'teacher'
        }
      ]
    });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    res.json({
      success: true,
      data: { user }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user',
      error: error.message
    });
  }
};

exports.updateUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const user = await User.findByPk(id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Prevent banning yourself
    if (parseInt(id) === req.user.id && status === 'banned') {
      return res.status(400).json({
        success: false,
        message: 'You cannot ban yourself'
      });
    }
    
    await user.update({ status });
    
    res.json({
      success: true,
      message: 'User status updated successfully',
      data: { user }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update user status',
      error: error.message
    });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    
    const user = await User.findByPk(id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Prevent deleting yourself
    if (parseInt(id) === req.user.id) {
      return res.status(400).json({
        success: false,
        message: 'You cannot delete yourself'
      });
    }
    
    await user.destroy();
    
    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete user',
      error: error.message
    });
  }
};

exports.createNotification = async (req, res) => {
  try {
    const notificationData = req.body;
    
    notificationData.created_by = req.user.id;
    
    const notification = await Notification.create(notificationData);
    
    // Emit real-time notification
    if (req.io) {
      const target = notification.target_audience;
      if (target === 'all') {
        req.io.emit('notification', notification);
      } else {
        req.io.to(target).emit('notification', notification);
      }
    }
    
    res.status(201).json({
      success: true,
      message: 'Notification created successfully',
      data: { notification }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create notification',
      error: error.message
    });
  }
};

exports.broadcastMessage = async (req, res) => {
  try {
    const { title, message, type = 'announcement', target = 'all' } = req.body;
    
    // Create notification
    const notification = await Notification.create({
      title,
      message,
      type,
      target_audience: target,
      priority: 'high',
      created_by: req.user.id
    });
    
    // Broadcast via socket.io
    if (req.io) {
      if (target === 'all') {
        req.io.emit('broadcast', notification);
      } else {
        req.io.to(target).emit('broadcast', notification);
      }
    }
    
    res.json({
      success: true,
      message: 'Message broadcast successfully',
      data: { notification }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to broadcast message',
      error: error.message
    });
  }
};
