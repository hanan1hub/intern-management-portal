const router = require('express').Router();
const { body } = require('express-validator');
const validate = require('../middleware/validate');
const auth     = require('../middleware/auth');
const ctrl     = require('../controllers/authController');

router.post('/login', [
  body('username').trim().notEmpty().withMessage('Username is required'),
  body('password').notEmpty().withMessage('Password is required'),
], validate, ctrl.login);

router.post('/intern-login', [
  body('email').trim().notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
], validate, ctrl.internLogin);

router.get('/me',      auth, ctrl.getProfile);
router.put('/profile', auth, [
  body('username').optional().trim().notEmpty().withMessage('Username cannot be empty'),
  body('email').optional({ nullable: true }).trim().isEmail().withMessage('Valid email is required'),
  body('new_password').optional().isLength({ min: 6 }).withMessage('Min 6 characters'),
  body('current_password').optional().notEmpty(),
], validate, ctrl.updateProfile);

router.post('/forgot-password', [
  body('email').trim().isEmail().withMessage('Please enter a valid email address'),
], validate, ctrl.forgotPassword);

router.post('/reset-password', [
  body('token').notEmpty().withMessage('Reset token is required'),
  body('new_password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
], validate, ctrl.resetPassword);

module.exports = router;
