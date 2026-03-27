const { Notification } = require('../models');
const { Op } = require('sequelize');

exports.getAllNotifications = async (req, res) => {
  try {
    const { 
      type,
      target,
      is_active,
      page = 1, 
      limit = 10
    } = req.query;
    
    const whereClause = {};
    
    if (type) {
      whereClause.type = type;
    }
    
    if (target) {
      whereClause.target_audience = target;
    }
    
    if (is_active !== undefined) {
      whereClause.is_active = is_active === 'true';
    }
    
    // Only show active notifications or those not expired
    whereClause[Op.or] = [
      { expires_at: null },
      { expires_at: { [Op.gt]: new Date() } }
    ];
    
    const offset = (page - 1) * limit;
    
    const { count, rows: notifications } = await Notification.findAndCountAll({
      where: whereClause,
      order: [['created_at', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });
    
    res.json({
      success: true,
      data: {
        notifications,
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
      message: 'Failed to fetch notifications',
      error: error.message
    });
  }
};

exports.getNotificationById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const notification = await Notification.findByPk(id);
    
    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }
    
    res.json({
      success: true,
      data: { notification }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch notification',
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
      } else if (target === 'students') {
        req.io.to('students').emit('notification', notification);
      } else if (target === 'teachers') {
        req.io.to('teachers').emit('notification', notification);
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

exports.updateNotification = async (req, res) => {
  try {
    const { id } = req.params;
    const notificationData = req.body;
    
    const notification = await Notification.findByPk(id);
    
    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }
    
    await notification.update(notificationData);
    
    res.json({
      success: true,
      message: 'Notification updated successfully',
      data: { notification }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update notification',
      error: error.message
    });
  }
};

exports.deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;
    
    const notification = await Notification.findByPk(id);
    
    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }
    
    await notification.destroy();
    
    res.json({
      success: true,
      message: 'Notification deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete notification',
      error: error.message
    });
  }
};

exports.getPublicNotifications = async (req, res) => {
  try {
    const notifications = await Notification.findAll({
      where: {
        is_active: true,
        target_audience: 'all',
        [Op.or]: [
          { expires_at: null },
          { expires_at: { [Op.gt]: new Date() } }
        ]
      },
      order: [['created_at', 'DESC']],
      limit: 5
    });
    
    res.json({
      success: true,
      data: { notifications }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch notifications',
      error: error.message
    });
  }
};

exports.getDailyAyah = async (req, res) => {
  try {
    // Get a random ayah notification
    const ayah = await Notification.findOne({
      where: {
        type: 'ayah',
        is_active: true
      },
      order: sequelize.random()
    });
    
    res.json({
      success: true,
      data: { ayah }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch daily ayah',
      error: error.message
    });
  }
};

exports.getDailyHadith = async (req, res) => {
  try {
    // Get a random hadith notification
    const hadith = await Notification.findOne({
      where: {
        type: 'hadith',
        is_active: true
      },
      order: sequelize.random()
    });
    
    res.json({
      success: true,
      data: { hadith }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch daily hadith',
      error: error.message
    });
  }
};
