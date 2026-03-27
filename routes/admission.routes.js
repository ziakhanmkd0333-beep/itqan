const express = require('express');
const router = express.Router();
const admissionController = require('../controllers/admission.controller');
const { authMiddleware, requireAdmin } = require('../middleware/auth');
const { validate, admissionValidation } = require('../middleware/validators');

// Public routes - for submitting applications
router.post('/student', validate(admissionValidation), admissionController.createStudentAdmission);
router.post('/teacher', validate(admissionValidation), admissionController.createTeacherAdmission);

// Protected admin routes
router.get('/', authMiddleware, requireAdmin, admissionController.getAllAdmissions);
router.get('/:id', authMiddleware, requireAdmin, admissionController.getAdmissionById);
router.put('/:id/status', authMiddleware, requireAdmin, admissionController.updateAdmissionStatus);

module.exports = router;
