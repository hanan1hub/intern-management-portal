const { body } = require('express-validator');

exports.createInternRules = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email')
    .isEmail().withMessage('Valid email is required')
    .normalizeEmail(),
  body('department').trim().notEmpty().withMessage('Department is required'),
  body('joining_date').isDate().withMessage('Valid joining date (YYYY-MM-DD) is required'),
];

exports.updateInternRules = [
  body('name').optional().trim().notEmpty().withMessage('Name cannot be empty'),
  body('email')
    .optional()
    .isEmail().withMessage('Valid email is required')
    .normalizeEmail(),
  body('department').optional().trim().notEmpty().withMessage('Department cannot be empty'),
  body('joining_date').optional().isDate().withMessage('Valid joining date (YYYY-MM-DD) is required'),
];
