const { body } = require('express-validator');

exports.markAttendanceRules = [
  body('intern_id').isInt({ gt: 0 }).withMessage('Valid intern ID is required'),
  body('date').isDate().withMessage('Valid date (YYYY-MM-DD) is required'),
  body('status')
    .isIn(['present', 'absent', 'late'])
    .withMessage('Status must be present, absent, or late'),
  body('notes').optional().trim(),
];
