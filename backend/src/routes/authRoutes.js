const router = require('express').Router();
const { body } = require('express-validator');
const validate = require('../middleware/validate');
const auth     = require('../middleware/auth');
const ctrl     = require('../controllers/authController');

router.post(
  '/login',
  [
    body('username').trim().notEmpty().withMessage('Username is required'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  validate,
  ctrl.login
);

router.post(
  '/intern-login',
  [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  validate,
  ctrl.internLogin
);

router.get('/me',      auth, ctrl.getProfile);
router.put(
  '/profile',
  auth,
  [
    body('username').optional().trim().notEmpty().withMessage('Username cannot be empty'),
    body('new_password').optional().isLength({ min: 6 }).withMessage('Min 6 characters'),
    body('current_password').optional().notEmpty(),
  ],
  validate,
  ctrl.updateProfile
);

module.exports = router;
