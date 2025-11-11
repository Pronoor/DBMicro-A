const db = require('../models');
const { hashPassword, comparePassword } = require('../utils/password.util');
const { generateAccessToken, generateRefreshToken } = require('../utils/jwt.util');
const { Op } = require('sequelize');

class AuthService {
  async register(userData) {
    const { email, username, password, firstName, lastName, phoneNumber } = userData;

    // Check if user exists
    const existingUser = await db.User.findOne({
      where: {
        [Op.or]: [{ email }, { username }]
      }
    });

    if (existingUser) {
      throw new Error('Email or username already exists');
    }

    // Hash password
    const passwordHash = await hashPassword(password);

    // Create user
    const user = await db.User.create({
      email,
      username,
      passwordHash,
      firstName,
      lastName,
      phoneNumber,
      metadata: {}
    });

    // Assign default 'user' role
    const defaultRole = await db.Role.findOne({ where: { roleName: 'user' } });
    if (defaultRole) {
      await db.UserRole.create({
        userId: user.userId,
        roleId: defaultRole.roleId
      });
    }

    return user;
  }

  async login(email, password, appKey, ipAddress, userAgent) {
    // Find user
    const user = await db.User.findOne({
      where: { email, isActive: true }
    });

    if (!user) {
      throw new Error('Invalid credentials');
    }

    // Verify password
    const isValidPassword = await comparePassword(password, user.passwordHash);
    if (!isValidPassword) {
      throw new Error('Invalid credentials');
    }

    // Find application
    const application = await db.Application.findOne({
      where: { appKey, isActive: true }
    });

    if (!application) {
      throw new Error('Invalid application');
    }

    // Generate tokens
    const accessToken = generateAccessToken({
      userId: user.userId,
      email: user.email
    });

    const refreshToken = generateRefreshToken({
      userId: user.userId
    });

    // Create session
    const session = await db.UserSession.create({
      userId: user.userId,
      appId: application.appId,
      sessionToken: accessToken,
      refreshToken,
      ipAddress,
      userAgent,
      expiresAt: new Date(Date.now() + 60 * 60 * 1000) // 1 hour
    });

    // Update last login
    await user.update({ lastLoginAt: new Date() });

    // Log audit
    await db.AuditLog.create({
      userId: user.userId,
      appId: application.appId,
      action: 'login',
      ipAddress
    });

    return {
      user,
      accessToken,
      refreshToken,
      expiresIn: 3600
    };
  }

  async logout(sessionToken) {
    const session = await db.UserSession.findOne({
      where: { sessionToken }
    });

    if (session) {
      await db.AuditLog.create({
        userId: session.userId,
        appId: session.appId,
        action: 'logout'
      });

      await session.destroy();
    }

    return true;
  }

  async refreshToken(refreshToken) {
    const session = await db.UserSession.findOne({
      where: { refreshToken },
      include: [{ model: db.User, as: 'user' }]
    });

    if (!session) {
      throw new Error('Invalid refresh token');
    }

    if (new Date(session.expiresAt) < new Date()) {
      throw new Error('Session expired');
    }

    // Generate new tokens
    const newAccessToken = generateAccessToken({
      userId: session.user.userId,
      email: session.user.email
    });

    const newRefreshToken = generateRefreshToken({
      userId: session.user.userId
    });

    // Update session
    await session.update({
      sessionToken: newAccessToken,
      refreshToken: newRefreshToken,
      expiresAt: new Date(Date.now() + 60 * 60 * 1000)
    });

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
      expiresIn: 3600
    };
  }

  async validateSession(sessionToken) {
    const session = await db.UserSession.findOne({
      where: { sessionToken },
      include: [{
        model: db.User,
        as: 'user',
        attributes: { exclude: ['passwordHash'] }
      }]
    });

    if (!session) {
      return null;
    }

    if (new Date(session.expiresAt) < new Date()) {
      return null;
    }

    return session;
  }
}

module.exports = new AuthService();
