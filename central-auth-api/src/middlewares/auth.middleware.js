const { verifyAccessToken } = require('../utils/jwt.util');
const { errorResponse } = require('../utils/response.util');
const db = require('../models');

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return errorResponse(res, 401, 'Access token required');
    }

    const token = authHeader.substring(7);
    const decoded = verifyAccessToken(token);

    // Check if session exists and is valid
    const session = await db.UserSession.findOne({
      where: {
        sessionToken: token,
        userId: decoded.userId
      },
      include: [{
        model: db.User,
        as: 'user',
        attributes: { exclude: ['passwordHash'] }
      }]
    });

    if (!session) {
      return errorResponse(res, 401, 'Invalid session');
    }

    if (new Date(session.expiresAt) < new Date()) {
      return errorResponse(res, 401, 'Session expired');
    }

    if (!session.user.isActive) {
      return errorResponse(res, 401, 'User account is inactive');
    }

    // Update last activity
    await session.update({ lastActivityAt: new Date() });

    req.user = session.user;
    req.session = session;
    next();
  } catch (error) {
    return errorResponse(res, 401, 'Invalid or expired token', error.message);
  }
};

const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next();
    }

    const token = authHeader.substring(7);
    const decoded = verifyAccessToken(token);

    const session = await db.UserSession.findOne({
      where: {
        sessionToken: token,
        userId: decoded.userId
      },
      include: [{
        model: db.User,
        as: 'user',
        attributes: { exclude: ['passwordHash'] }
      }]
    });

    if (session && new Date(session.expiresAt) >= new Date()) {
      req.user = session.user;
      req.session = session;
    }

    next();
  } catch (error) {
    next();
  }
};

module.exports = {
  authenticate,
  optionalAuth
};
