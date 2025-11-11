const db = require('../models');
const crypto = require('crypto');
const { hashPassword } = require('../utils/password.util');

class ApplicationService {
  async getAllApplications(filters = {}) {
    const where = {};
    
    if (filters.isActive !== undefined) {
      where.isActive = filters.isActive;
    }

    const applications = await db.Application.findAll({
      where,
      attributes: { exclude: ['appSecret'] }, // Don't expose secret
      order: [['createdAt', 'DESC']]
    });

    return applications;
  }

  async getApplicationById(appId) {
    const application = await db.Application.findByPk(appId, {
      attributes: { exclude: ['appSecret'] }
    });

    if (!application) {
      throw new Error('Application not found');
    }

    return application;
  }

  async createApplication(appData) {
    const { appName, description, config } = appData;

    // Check if app already exists
    const existingApp = await db.Application.findOne({ where: { appName } });
    if (existingApp) {
      throw new Error('Application already exists');
    }

    // Generate unique app key and secret
    const appKey = `${appName.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`;
    const appSecret = crypto.randomBytes(32).toString('hex');
    const hashedSecret = await hashPassword(appSecret);

    const application = await db.Application.create({
      appName,
      appKey,
      appSecret: hashedSecret,
      description,
      config: config || {},
      isActive: true
    });

    // Return secret only once during creation
    return {
      ...application.toJSON(),
      appSecret // Only shown during creation
    };
  }

  async updateApplication(appId, updateData) {
    const application = await db.Application.findByPk(appId);

    if (!application) {
      throw new Error('Application not found');
    }

    // Don't allow updating appKey or appSecret directly
    delete updateData.appKey;
    delete updateData.appSecret;

    await application.update(updateData);
    return application;
  }

  async deleteApplication(appId) {
    const application = await db.Application.findByPk(appId);

    if (!application) {
      throw new Error('Application not found');
    }

    await application.destroy();
    return true;
  }

  async regenerateAppSecret(appId) {
    const application = await db.Application.findByPk(appId);

    if (!application) {
      throw new Error('Application not found');
    }

    const newSecret = crypto.randomBytes(32).toString('hex');
    const hashedSecret = await hashPassword(newSecret);

    await application.update({ appSecret: hashedSecret });

    return {
      appKey: application.appKey,
      appSecret: newSecret // Return new secret
    };
  }
}

module.exports = new ApplicationService();
