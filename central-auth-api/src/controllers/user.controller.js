const userService = require('../services/user.service');
const { successResponse, errorResponse, paginatedResponse } = require('../utils/response.util');

/**
 * @swagger
 * /users:
 *   get:
 *     tags: [Users]
 *     summary: Get all users (paginated)
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *       - in: query
 *         name: isActive
 *         schema:
 *           type: boolean
 *     responses:
 *       200:
 *         description: Users retrieved successfully
 */
const getAllUsers = async (req, res) => {
  try {
    const filters = {
      isActive: req.query.isActive,
      isVerified: req.query.isVerified,
      search: req.query.search
    };

    const pagination = {
      page: parseInt(req.query.page) || 1,
      limit: parseInt(req.query.limit) || 10
    };

    const result = await userService.getAllUsers(filters, pagination);

    return paginatedResponse(
      res,
      200,
      'Users retrieved successfully',
      result.users,
      result.pagination
    );
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     tags: [Users]
 *     summary: Get user by ID
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
 *         description: User retrieved successfully
 *       404:
 *         description: User not found
 */
const getUserById = async (req, res) => {
  try {
    const user = await userService.getUserById(req.params.id);
    return successResponse(res, 200, 'User retrieved successfully', user);
  } catch (error) {
    return errorResponse(res, 404, error.message);
  }
};

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     tags: [Users]
 *     summary: Update user
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               phoneNumber:
 *                 type: string
 *               metadata:
 *                 type: object
 *     responses:
 *       200:
 *         description: User updated successfully
 */
const updateUser = async (req, res) => {
  try {
    const user = await userService.updateUser(req.params.id, req.body);
    return successResponse(res, 200, 'User updated successfully', user);
  } catch (error) {
    return errorResponse(res, 400, error.message);
  }
};

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     tags: [Users]
 *     summary: Delete user
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
 *         description: User deleted successfully
 */
const deleteUser = async (req, res) => {
  try {
    await userService.deleteUser(req.params.id);
    return successResponse(res, 200, 'User deleted successfully');
  } catch (error) {
    return errorResponse(res, 404, error.message);
  }
};

/**
 * @swagger
 * /users/{id}/roles:
 *   post:
 *     tags: [Users]
 *     summary: Assign role to user
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - roleId
 *             properties:
 *               roleId:
 *                 type: string
 *                 format: uuid
 *               expiresAt:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       200:
 *         description: Role assigned successfully
 */
const assignRole = async (req, res) => {
  try {
    const { roleId, expiresAt } = req.body;
    const userRole = await userService.assignRole(
      req.params.id,
      roleId,
      expiresAt,
      req.user.userId
    );
    return successResponse(res, 200, 'Role assigned successfully', userRole);
  } catch (error) {
    return errorResponse(res, 400, error.message);
  }
};

/**
 * @swagger
 * /users/{id}/roles/{roleId}:
 *   delete:
 *     tags: [Users]
 *     summary: Remove role from user
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *       - in: path
 *         name: roleId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Role removed successfully
 */
const removeRole = async (req, res) => {
  try {
    await userService.removeRole(req.params.id, req.params.roleId);
    return successResponse(res, 200, 'Role removed successfully');
  } catch (error) {
    return errorResponse(res, 404, error.message);
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  assignRole,
  removeRole
};
