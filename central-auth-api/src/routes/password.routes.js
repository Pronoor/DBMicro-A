const express = require('express');
const router = express.Router();
const passwordController = require('../controllers/password.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const { auditLog } = require('../middlewares/audit.middleware');
const Joi = require('joi');
const { validateRequest } = require('../utils/validation.util');

// Validation schemas
const forgotPasswordSchema = Joi.object({
  email: Joi.string().email().required()
});

const resetPasswordSchema = Joi.object({
  token: Joi.string().required(),
  newPassword: Joi.string().min(8).required()
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .message('Password must contain uppercase, lowercase, number and special character')
});

const changePasswordSchema = Joi.object({
  oldPassword: Joi.string().required(),
  newPassword: Joi.string().min(8).required()
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .message('Password must contain uppercase, lowercase, number and special character')
});

/**
 * @swagger
 * tags:
 *   name: Password Management
 *   description: Password reset and change operations
 */

router.post(
  '/forgot-password',
  validateRequest(forgotPasswordSchema),
  passwordController.forgotPassword
);

router.post(
  '/verify-reset-token',
  passwordController.verifyResetToken
);

router.post(
  '/reset-password',
  validateRequest(resetPasswordSchema),
  auditLog('password_reset', 'user'),
  passwordController.resetPassword
);

router.post(
  '/change-password',
  authenticate,
  validateRequest(changePasswordSchema),
  auditLog('password_change', 'user'),
  passwordController.changePassword
);

module.exports = router;
