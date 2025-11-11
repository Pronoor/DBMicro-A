const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const passwordController = require('../controllers/password.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const { validateRegister, validateLogin } = require('../middlewares/validation.middleware');
const { auditLog } = require('../middlewares/audit.middleware');
const Joi = require('joi');
const { validateRequest } = require('../utils/validation.util');

// Validation schemas for password operations
const changePasswordSchema = Joi.object({
  oldPassword: Joi.string().required(),
  newPassword: Joi.string().min(8).required()
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .message('Password must contain uppercase, lowercase, number and special character')
});

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: User authentication and authorization
 */

// Authentication routes
router.post('/register', validateRegister, auditLog('register', 'user'), authController.register);
router.post('/login', validateLogin, authController.login);
router.post('/logout', authenticate, auditLog('logout'), authController.logout);
router.post('/refresh', authController.refreshToken);
router.get('/me', authenticate, authController.getCurrentUser);

// Password management routes (also under /auth for convenience)
router.post('/change-password', 
  authenticate, 
  validateRequest(changePasswordSchema),
  auditLog('password_change', 'user'), 
  passwordController.changePassword
);

module.exports = router;

