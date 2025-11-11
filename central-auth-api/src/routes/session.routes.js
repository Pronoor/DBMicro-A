const express = require('express');
const router = express.Router();
const sessionController = require('../controllers/session.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const { auditLog } = require('../middlewares/audit.middleware');

/**
 * @swagger
 * tags:
 *   name: Sessions
 *   description: Session management
 */

router.get(
  '/',
  authenticate,
  sessionController.getMySessions
);

router.delete(
  '/:id',
  authenticate,
  auditLog('terminate_session', 'session'),
  sessionController.terminateSession
);

router.post(
  '/terminate-all',
  authenticate,
  auditLog('terminate_all_sessions', 'session'),
  sessionController.terminateAllSessions
);

module.exports = router;