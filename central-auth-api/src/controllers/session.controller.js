const db = require('../models');
const { successResponse, errorResponse } = require('../utils/response.util');
const { Op } = require('sequelize');

/**
 * @swagger
 * /sessions:
 *   get:
 *     tags: [Sessions]
 *     summary: Get current user's active sessions
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Sessions retrieved successfully
 */
const getMySessions = async (req, res) => {
  try {
    const sessions = await db.UserSession.findAll({
      where: {
        userId: req.user.userId,
        expiresAt: { [Op.gt]: new Date() }
      },
      include: [{
        model: db.Application,
        as: 'application',
        attributes: ['appId', 'appName', 'appKey']
      }],
      order: [['lastActivityAt', 'DESC']]
    });

    return successResponse(res, 200, 'Sessions retrieved successfully', sessions);
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

/**
 * @swagger
 * /sessions/{id}:
 *   delete:
 *     tags: [Sessions]
 *     summary: Terminate a specific session
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Session terminated successfully
 */
const terminateSession = async (req, res) => {
  try {
    const session = await db.UserSession.findOne({
      where: {
        sessionId: req.params.id,
        userId: req.user.userId
      }
    });

    if (!session) {
      return errorResponse(res, 404, 'Session not found');
    }

    await session.destroy();

    // Audit log
    await db.AuditLog.create({
      userId: req.user.userId,
      action: 'session_terminated',
      resourceType: 'session',
      resourceId: req.params.id
    });

    return successResponse(res, 200, 'Session terminated successfully');
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

/**
 * @swagger
 * /sessions/terminate-all:
 *   post:
 *     tags: [Sessions]
 *     summary: Terminate all sessions except current
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: All other sessions terminated
 */
const terminateAllSessions = async (req, res) => {
  try {
    const deleted = await db.UserSession.destroy({
      where: {
        userId: req.user.userId,
        sessionId: { [Op.ne]: req.session.sessionId }
      }
    });

    // Audit log
    await db.AuditLog.create({
      userId: req.user.userId,
      action: 'all_sessions_terminated',
      resourceType: 'session',
      newValues: { terminated_count: deleted }
    });

    return successResponse(res, 200, `${deleted} session(s) terminated successfully`);
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

module.exports = {
  getMySessions,
  terminateSession,
  terminateAllSessions
};
