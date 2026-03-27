const express = require('express');
const router = express.Router();
const courseController = require('../controllers/course.controller');
const { authMiddleware, requireAdmin } = require('../middleware/auth');
const { validate, courseValidation } = require('../middleware/validators');

// Public routes
router.get('/', courseController.getAllCourses);
router.get('/categories', courseController.getCategories);
router.get('/levels', courseController.getLevels);
router.get('/:id', courseController.getCourseById);

// Protected admin routes
router.post('/', authMiddleware, requireAdmin, validate(courseValidation), courseController.createCourse);
router.put('/:id', authMiddleware, requireAdmin, validate(courseValidation), courseController.updateCourse);
router.delete('/:id', authMiddleware, requireAdmin, courseController.deleteCourse);

module.exports = router;
