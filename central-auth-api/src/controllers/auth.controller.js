const authService = require('../services/auth.service');
const { successResponse, errorResponse } = require('../utils/response.util');

/**
 * @swagger
 * /auth/register:
 *   post:
 *     tags: [Authentication]
 *     summary: Register a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - username
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *                 format: password
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               phoneNumber:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Validation error or user already exists
 */
const register = async (req, res) => {
  try {
    const user = await authService.register(req.body);
    return successResponse(res, 201, 'User registered successfully', {
      userId: user.userId,
      email: user.email,
      username: user.username
    });
  } catch (error) {
    return errorResponse(res, 400, error.message);
  }
};

/**
 * @swagger
 * /auth/login:
 *   post:
 *     tags: [Authentication]
 *     summary: User login with application key
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - appKey
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *               appKey:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                 refreshToken:
 *                   type: string
 *                 expiresIn:
 *                   type: number
 *                 user:
 *                   $ref: '#/components/schemas/User'
 */
const login = async (req, res) => {
  try {
    const { email, password, appKey } = req.body;
    const result = await authService.login(
      email,
      password,
      appKey,
      req.ip,
      req.headers['user-agent']
    );

    return successResponse(res, 200, 'Login successful', result);
  } catch (error) {
    return errorResponse(res, 401, error.message);
  }
};

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     tags: [Authentication]
 *     summary: Logout user
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Logout successful
 */
const logout = async (req, res) => {
  try {
    await authService.logout(req.session.sessionToken);
    return successResponse(res, 200, 'Logout successful');
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

/**
 * @swagger
 * /auth/refresh:
 *   post:
 *     tags: [Authentication]
 *     summary: Refresh access token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refreshToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: Token refreshed successfully
 */
const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    const result = await authService.refreshToken(refreshToken);
    return successResponse(res, 200, 'Token refreshed successfully', result);
  } catch (error) {
    return errorResponse(res, 401, error.message);
  }
};

/**
 * @swagger
 * /auth/me:
 *   get:
 *     tags: [Authentication]
 *     summary: Get current user profile
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: User profile
 */
const getCurrentUser = async (req, res) => {
  try {
    return successResponse(res, 200, 'User profile retrieved', req.user);
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

module.exports = {
  register,
  login,
  logout,
  refreshToken,
  getCurrentUser
};
