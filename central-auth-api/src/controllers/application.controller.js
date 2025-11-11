const applicationService = require('../services/application.service');
const { successResponse, errorResponse } = require('../utils/response.util');

/**
 * @swagger
 * /applications:
 *   get:
 *     tags: [Applications]
 *     summary: Get all applications
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: isActive
 *         schema:
 *           type: boolean
 *     responses:
 *       200:
 *         description: Applications retrieved successfully
 */
const getAllApplications = async (req, res) => {
  try {
    const filters = { isActive: req.query.isActive };
    const applications = await applicationService.getAllApplications(filters);
    return successResponse(res, 200, 'Applications retrieved successfully', applications);
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

/**
 * @swagger
 * /applications/{id}:
 *   get:
 *     tags: [Applications]
 *     summary: Get application by ID
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
 *         description: Application retrieved successfully
 */
const getApplicationById = async (req, res) => {
  try {
    const application = await applicationService.getApplicationById(req.params.id);
    return successResponse(res, 200, 'Application retrieved successfully', application);
  } catch (error) {
    return errorResponse(res, 404, error.message);
  }
};

/**
 * @swagger
 * /applications:
 *   post:
 *     tags: [Applications]
 *     summary: Create new application
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - appName
 *             properties:
 *               appName:
 *                 type: string
 *                 example: My New App
 *               description:
 *                 type: string
 *               config:
 *                 type: object
 *     responses:
 *       201:
 *         description: Application created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 appKey:
 *                   type: string
 *                 appSecret:
 *                   type: string
 *                   description: Only shown once during creation
 */
const createApplication = async (req, res) => {
  try {
    const application = await applicationService.createApplication(req.body);
    return successResponse(res, 201, 'Application created successfully. Save the appSecret - it will not be shown again!', application);
  } catch (error) {
    return errorResponse(res, 400, error.message);
  }
};

/**
 * @swagger
 * /applications/{id}:
 *   put:
 *     tags: [Applications]
 *     summary: Update application
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
 *               description:
 *                 type: string
 *               config:
 *                 type: object
 *               isActive:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Application updated successfully
 */
const updateApplication = async (req, res) => {
  try {
    const application = await applicationService.updateApplication(req.params.id, req.body);
    return successResponse(res, 200, 'Application updated successfully', application);
  } catch (error) {
    return errorResponse(res, 400, error.message);
  }
};

/**
 * @swagger
 * /applications/{id}:
 *   delete:
 *     tags: [Applications]
 *     summary: Delete application
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
 *         description: Application deleted successfully
 */
const deleteApplication = async (req, res) => {
  try {
    await applicationService.deleteApplication(req.params.id);
    return successResponse(res, 200, 'Application deleted successfully');
  } catch (error) {
    return errorResponse(res, 404, error.message);
  }
};

/**
 * @swagger
 * /applications/{id}/regenerate-secret:
 *   post:
 *     tags: [Applications]
 *     summary: Regenerate application secret
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
 *         description: Secret regenerated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 appKey:
 *                   type: string
 *                 appSecret:
 *                   type: string
 */
const regenerateSecret = async (req, res) => {
  try {
    const result = await applicationService.regenerateAppSecret(req.params.id);
    return successResponse(res, 200, 'Secret regenerated successfully. Save the new secret - it will not be shown again!', result);
  } catch (error) {
    return errorResponse(res, 404, error.message);
  }
};

module.exports = {
  getAllApplications,
  getApplicationById,
  createApplication,
  updateApplication,
  deleteApplication,
  regenerateSecret
};