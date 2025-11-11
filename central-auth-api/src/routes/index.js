const express = require('express');
const router = express.Router();

// Import all route modules
const authRoutes = require('./auth.routes');
const passwordRoutes = require('./password.routes');
const userRoutes = require('./user.routes');
const roleRoutes = require('./role.routes');
const permissionRoutes = require('./permission.routes');
const applicationRoutes = require('./application.routes');
const sessionRoutes = require('./session.routes');

/**
 * @swagger
 * /:
 *   get:
 *     tags: [Health Check]
 *     summary: API health check
 *     responses:
 *       200:
 *         description: API is running
 */
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Central Authentication API is running',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    endpoints: {
      documentation: '/api-docs',
      health: '/api/v1/health',
      authentication: '/api/v1/auth',
      passwordManagement: '/api/v1/password',
      users: '/api/v1/users',
      roles: '/api/v1/roles',
      permissions: '/api/v1/permissions',
      applications: '/api/v1/applications',
      sessions: '/api/v1/sessions'
    }
  });
});

/**
 * @swagger
 * /health:
 *   get:
 *     tags: [Health Check]
 *     summary: Detailed health check with database status
 *     responses:
 *       200:
 *         description: API health status
 */
router.get('/health', async (req, res) => {
  const db = require('../models');
  
  try {
    await db.sequelize.authenticate();
    
    res.json({
      success: true,
      status: 'healthy',
      timestamp: new Date().toISOString(),
      services: {
        api: 'operational',
        database: 'connected'
      }
    });
  } catch (error) {
    res.status(503).json({
      success: false,
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      services: {
        api: 'operational',
        database: 'disconnected'
      },
      error: error.message
    });
  }
});

// Mount all routes
router.use('/auth', authRoutes);
router.use('/password', passwordRoutes);
router.use('/users', userRoutes);
router.use('/roles', roleRoutes);
router.use('/permissions', permissionRoutes);
router.use('/applications', applicationRoutes);
router.use('/sessions', sessionRoutes);

module.exports = router;
