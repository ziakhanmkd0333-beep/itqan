const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const { authMiddleware, requireAdmin, requireSuperAdmin } = require('../middleware/auth');

// Dashboard
router.get('/dashboard', authMiddleware, requireAdmin, adminController.getDashboardStats);

// Users management
router.get('/users', authMiddleware, requireAdmin, adminController.getAllUsers);
router.get('/users/:id', authMiddleware, requireAdmin, adminController.getUserById);
router.put('/users/:id/status', authMiddleware, requireAdmin, adminController.updateUserStatus);
router.delete('/users/:id', authMiddleware, requireSuperAdmin, adminController.deleteUser);

// Stats
router.get('/stats', authMiddleware, requireAdmin, adminController.getDashboardStats);

// Notifications
router.post('/notifications', authMiddleware, requireAdmin, adminController.createNotification);
router.post('/broadcast', authMiddleware, requireAdmin, adminController.broadcastMessage);

module.exports = router;
