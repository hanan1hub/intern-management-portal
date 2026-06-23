const router = require('express').Router();
const { body } = require('express-validator');
const validate = require('../middleware/validate');
const auth = require('../middleware/auth');
const { login, getProfile, updateProfile } = require('../controllers/authController');

router.post(
  '/login',
  [
    body('username').trim().notEmpty().withMessage('Username is required'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  validate,
  login
);

router.get('/me', auth, getProfile);

router.put(
  '/profile',
  auth,
  [
    body('username').optional().trim().notEmpty().withMessage('Username cannot be empty'),
    body('new_password')
      .optional()
      .isLength({ min: 6 })
      .withMessage('New password must be at least 6 characters'),
    body('current_password').optional().notEmpty(),
  ],
  validate,
  updateProfile
);

module.exports = router;
