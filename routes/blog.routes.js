const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blog.controller');
const { authMiddleware, requireAdmin } = require('../middleware/auth');
const { validate, blogValidation } = require('../middleware/validators');

// Public routes
router.get('/', blogController.getAllBlogs);
router.get('/featured', blogController.getFeaturedBlogs);
router.get('/slug/:slug', blogController.getBlogBySlug);
router.get('/:id', blogController.getBlogById);

// Protected admin routes
router.post('/', authMiddleware, requireAdmin, validate(blogValidation), blogController.createBlog);
router.put('/:id', authMiddleware, requireAdmin, validate(blogValidation), blogController.updateBlog);
router.delete('/:id', authMiddleware, requireAdmin, blogController.deleteBlog);

module.exports = router;
