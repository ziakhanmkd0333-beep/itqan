const express = require('express');
const router = express.Router();
const uploadController = require('../controllers/upload.controller');
const { authMiddleware } = require('../middleware/auth');

// Single file upload
router.post('/image', authMiddleware, uploadController.uploadSingle('image'), uploadController.uploadImage);
router.post('/profile', authMiddleware, uploadController.uploadSingle('profile_image'), uploadController.uploadImage);
router.post('/course-image', authMiddleware, uploadController.uploadSingle('course_image'), uploadController.uploadImage);
router.post('/blog-image', authMiddleware, uploadController.uploadSingle('blog_image'), uploadController.uploadImage);

// Document uploads
router.post('/cv', authMiddleware, uploadController.uploadSingle('cv_file'), uploadController.uploadDocument);
router.post('/certificate', authMiddleware, uploadController.uploadSingle('certificates'), uploadController.uploadDocument);

// Multiple file uploads
router.post('/multiple', authMiddleware, uploadController.uploadMultiple('files', 5), uploadController.uploadMultipleFiles);

// File deletion
router.delete('/:filename', authMiddleware, uploadController.deleteFile);

module.exports = router;
