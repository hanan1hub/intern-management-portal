const router = require('express').Router();
const { body } = require('express-validator');
const validate = require('../middleware/validate');
const { login } = require('../controllers/authController');

router.post(
  '/login',
  [
    body('username').trim().notEmpty().withMessage('Username is required'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  validate,
  login
);

module.exports = router;
