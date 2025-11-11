const db = require('../models');
const crypto = require('crypto');
const { hashPassword } = require('../utils/password.util');
const { Op } = require('sequelize');

class PasswordService {
  /**
   * Generate password reset token
   */
  async requestPasswordReset(email) {
    const user = await db.User.findOne({ where: { email } });

    if (!user) {
      // Don't reveal if email exists
      return { success: true, message: 'If email exists, reset link will be sent' };
    }

    // Generate secure token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    // Create reset token record (expires in 1 hour)
    await db.PasswordResetToken.create({
      userId: user.userId,
      token: hashedToken,
      expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
      isUsed: false
    });

    // In production, send email here
    // await emailService.sendPasswordResetEmail(user.email, resetToken);

    return {
      success: true,
      message: 'Password reset link sent to email',
      // Only return token in development for testing
      ...(process.env.NODE_ENV === 'development' && { resetToken })
    };
  }

  /**
   * Verify reset token
   */
  async verifyResetToken(token) {
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const resetToken = await db.PasswordResetToken.findOne({
      where: {
        token: hashedToken,
        isUsed: false,
        expiresAt: { [Op.gt]: new Date() }
      },
      include: [{
        model: db.User,
        as: 'user',
        attributes: ['userId', 'email']
      }]
    });

    if (!resetToken) {
      throw new Error('Invalid or expired reset token');
    }

    return resetToken;
  }

  /**
   * Reset password with token
   */
  async resetPassword(token, newPassword) {
    const resetToken = await this.verifyResetToken(token);

    // Hash new password
    const passwordHash = await hashPassword(newPassword);

    // Update user password
    await db.User.update(
      { passwordHash },
      { where: { userId: resetToken.userId } }
    );

    // Mark token as used
    await resetToken.update({ isUsed: true });

    // Invalidate all user sessions
    await db.UserSession.destroy({
      where: { userId: resetToken.userId }
    });

    // Audit log
    await db.AuditLog.create({
      userId: resetToken.userId,
      action: 'password_reset',
      resourceType: 'user'
    });

    return { success: true, message: 'Password reset successfully' };
  }

  /**
   * Change password (authenticated user)
   */
  async changePassword(userId, oldPassword, newPassword) {
    const user = await db.User.findByPk(userId);

    if (!user) {
      throw new Error('User not found');
    }

    // Verify old password
    const { comparePassword } = require('../utils/password.util');
    const isValid = await comparePassword(oldPassword, user.passwordHash);

    if (!isValid) {
      throw new Error('Current password is incorrect');
    }

    // Hash new password
    const passwordHash = await hashPassword(newPassword);

    // Update password
    await user.update({ passwordHash });

    // Audit log
    await db.AuditLog.create({
      userId,
      action: 'password_change',
      resourceType: 'user'
    });

    return { success: true, message: 'Password changed successfully' };
  }
}

module.exports = new PasswordService();
