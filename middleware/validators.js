const { body, validationResult } = require('express-validator');

const validate = (validations) => {
  return async (req, res, next) => {
    await Promise.all(validations.map(validation => validation.run(req)));
    
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }
    
    res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  };
};

// Disposable email domains to block
const disposableDomains = [
  'mailinator.com', 'tempmail.com', 'guerrillamail.com',
  'throwaway.com', 'yopmail.com', 'temp-mail.org',
  'fakeinbox.com', 'sharklasers.com', 'getairmail.com',
  '10minutemail.com', 'burnermail.io', 'tempmailaddress.com',
  'mailnesia.com', 'tempinbox.com', 'kasmail.com',
  'spamgourmet.com', 'binkmail.com', 'mailcatch.com',
  'discard.email', 'discardmail.com', 'getnada.com',
  'temp-mail.io', 'temporary-mail.net', 'fakemail.net',
  'fake-email.pm', 'tempmail.plus', 'tempmail.ninja'
];

const isDisposableEmail = (email) => {
  const domain = email.split('@')[1]?.toLowerCase();
  return disposableDomains.includes(domain);
};

const registerValidation = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email')
    .custom((value) => {
      if (isDisposableEmail(value)) {
        throw new Error('Disposable email addresses are not allowed');
      }
      return true;
    }),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters')
    .matches(/^(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one uppercase letter and one number'),
  body('role')
    .optional()
    .isIn(['STUDENT', 'TEACHER'])
    .withMessage('Invalid role specified')
];

const loginValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

const courseValidation = [
  body('title')
    .trim()
    .isLength({ min: 3, max: 255 })
    .withMessage('Title must be between 3 and 255 characters'),
  body('category')
    .isIn(['Quran', 'Arabic', 'Fiqh', 'Sarf', 'Hadith'])
    .withMessage('Invalid category'),
  body('level')
    .isIn(['Beginner', 'Intermediate', 'Advanced', 'Specialized'])
    .withMessage('Invalid level'),
  body('duration')
    .trim()
    .notEmpty()
    .withMessage('Duration is required'),
  body('description')
    .trim()
    .isLength({ min: 10 })
    .withMessage('Description must be at least 10 characters')
];

const blogValidation = [
  body('title')
    .trim()
    .isLength({ min: 3, max: 255 })
    .withMessage('Title must be between 3 and 255 characters'),
  body('content')
    .trim()
    .isLength({ min: 10 })
    .withMessage('Content must be at least 10 characters'),
  body('slug')
    .optional()
    .trim()
    .matches(/^[a-z0-9-]+$/)
    .withMessage('Slug can only contain lowercase letters, numbers, and hyphens')
];

const admissionValidation = [
  body('type')
    .isIn(['student', 'teacher'])
    .withMessage('Type must be student or teacher'),
  body('full_name')
    .trim()
    .isLength({ min: 2, max: 255 })
    .withMessage('Full name is required'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email')
    .custom((value) => {
      if (isDisposableEmail(value)) {
        throw new Error('Disposable email addresses are not allowed');
      }
      return true;
    }),
  body('phone')
    .optional()
    .trim()
    .isLength({ min: 5, max: 50 })
    .withMessage('Phone number is invalid')
];

const notificationValidation = [
  body('title')
    .trim()
    .isLength({ min: 3, max: 255 })
    .withMessage('Title must be between 3 and 255 characters'),
  body('message')
    .trim()
    .isLength({ min: 5 })
    .withMessage('Message must be at least 5 characters'),
  body('type')
    .optional()
    .isIn(['ayah', 'hadith', 'course', 'update', 'announcement', 'admission'])
    .withMessage('Invalid notification type')
];

module.exports = {
  validate,
  registerValidation,
  loginValidation,
  courseValidation,
  blogValidation,
  admissionValidation,
  notificationValidation,
  isDisposableEmail
};
