const passwordService = require('../services/password.service');
const { successResponse, errorResponse } = require('../utils/response.util');

/**
 * @swagger
 * /password/forgot-password:
 *   post:
 *     tags: [Password Management]
 *     summary: Request password reset
 *     description: Send password reset link to user's email
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *     responses:
 *       200:
 *         description: Reset link sent (always returns success)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     resetToken:
 *                       type: string
 *                       description: Only in development mode
 */
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const result = await passwordService.requestPasswordReset(email);
    return successResponse(res, 200, result.message, result);
  } catch (error) {
    return errorResponse(res, 400, error.message);
  }
};

/**
 * @swagger
 * /password/verify-reset-token:
 *   post:
 *     tags: [Password Management]
 *     summary: Verify password reset token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *             properties:
 *               token:
 *                 type: string
 *     responses:
 *       200:
 *         description: Token is valid
 *       400:
 *         description: Invalid or expired token
 */
const verifyResetToken = async (req, res) => {
  try {
    const { token } = req.body;
    await passwordService.verifyResetToken(token);
    return successResponse(res, 200, 'Token is valid');
  } catch (error) {
    return errorResponse(res, 400, error.message);
  }
};

/**
 * @swagger
 * /password/reset-password:
 *   post:
 *     tags: [Password Management]
 *     summary: Reset password with token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *               - newPassword
 *             properties:
 *               token:
 *                 type: string
 *               newPassword:
 *                 type: string
 *                 format: password
 *                 minLength: 8
 *     responses:
 *       200:
 *         description: Password reset successfully
 *       400:
 *         description: Invalid token or password
 */
const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    const result = await passwordService.resetPassword(token, newPassword);
    return successResponse(res, 200, result.message);
  } catch (error) {
    return errorResponse(res, 400, error.message);
  }
};

/**
 * @swagger
 * /password/change-password:
 *   post:
 *     tags: [Password Management]
 *     summary: Change password (authenticated user)
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - oldPassword
 *               - newPassword
 *             properties:
 *               oldPassword:
 *                 type: string
 *                 format: password
 *               newPassword:
 *                 type: string
 *                 format: password
 *                 minLength: 8
 *     responses:
 *       200:
 *         description: Password changed successfully
 *       400:
 *         description: Invalid old password
 */
const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const result = await passwordService.changePassword(
      req.user.userId,
      oldPassword,
      newPassword
    );
    return successResponse(res, 200, result.message);
  } catch (error) {
    return errorResponse(res, 400, error.message);
  }
};

module.exports = {
  forgotPassword,
  verifyResetToken,
  resetPassword,
  changePassword
};