// Audit logging middleware
const pool = require("../config/db");

const auditLogger = (entityType) => {
  return async (req, res, next) => {
    const originalSend = res.send;
    
    res.send = function(data) {
      if (res.statusCode >= 200 && res.statusCode < 400) {
        // Log successful changes
        if (req.method !== "GET") {
          logAudit(req, entityType, data);
        }
      }
      res.send = originalSend;
      return res.send(data);
    };
    
    next();
  };
};

const logAudit = async (req, entityType, responseData) => {
  try {
    const userId = req.user?.id || null;
    const entityId = req.params.id || null;
    const action = getActionFromMethod(req.method);
    
    // Extract changes from request body
    const changes = req.body;
    
    await pool.query(
      `INSERT INTO audit_logs 
       (user_id, entity_type, entity_id, action, new_values, changes, ip_address, performed_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, CURRENT_TIMESTAMP)`,
      [
        userId,
        entityType,
        entityId,
        action,
        JSON.stringify(responseData),
        JSON.stringify(changes),
        req.ip
      ]
    );
  } catch (error) {
    console.error("Audit logging error:", error);
  }
};

const getActionFromMethod = (method) => {
  const actions = {
    POST: "CREATE",
    PUT: "UPDATE",
    DELETE: "DELETE",
    GET: "READ"
  };
  return actions[method] || "UNKNOWN";
};

module.exports = { auditLogger, logAudit };
