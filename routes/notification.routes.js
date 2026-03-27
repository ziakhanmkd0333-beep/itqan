const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notification.controller');
const { authMiddleware, requireAdmin } = require('../middleware/auth');
const { validate, notificationValidation } = require('../middleware/validators');

// Public routes
router.get('/public', notificationController.getPublicNotifications);
router.get('/daily-ayah', notificationController.getDailyAyah);
router.get('/daily-hadith', notificationController.getDailyHadith);

// Protected routes
router.get('/', authMiddleware, notificationController.getAllNotifications);
router.get('/:id', authMiddleware, notificationController.getNotificationById);

// Admin only routes
router.post('/', authMiddleware, requireAdmin, validate(notificationValidation), notificationController.createNotification);
router.put('/:id', authMiddleware, requireAdmin, notificationController.updateNotification);
router.delete('/:id', authMiddleware, requireAdmin, notificationController.deleteNotification);

module.exports = router;
