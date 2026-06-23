const { body } = require('express-validator');

exports.createTaskRules = [
  body('intern_id').isInt({ gt: 0 }).withMessage('Valid intern ID is required'),
  body('title').trim().notEmpty().withMessage('Task title is required'),
  body('description').optional().trim(),
];

exports.updateTaskRules = [
  body('status')
    .isIn(['pending', 'completed'])
    .withMessage('Status must be pending or completed'),
];
