const db = require('../models');

const auditLog = (action, resourceType = null) => {
  return async (req, res, next) => {
    const originalJson = res.json.bind(res);

    res.json = async function (data) {
      try {
        // Only log successful operations (2xx status codes)
        if (res.statusCode >= 200 && res.statusCode < 300) {
          await db.AuditLog.create({
            userId: req.user?.userId,
            appId: req.session?.appId,
            action,
            resourceType,
            resourceId: req.params?.id || data?.data?.id,
            oldValues: req.originalBody,
            newValues: data?.data,
            ipAddress: req.ip
          });
        }
      } catch (error) {
        console.error('Audit log error:', error);
      }

      return originalJson(data);
    };

    // Store original body for audit comparison
    req.originalBody = { ...req.body };
    next();
  };
};

module.exports = {
  auditLog
};
