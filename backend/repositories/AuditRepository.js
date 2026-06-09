// Audit Log Repository
const pool = require("../config/db");

class AuditRepository {
  async logChange(auditData) {
    const result = await pool.query(
      `INSERT INTO audit_logs 
       (user_id, entity_type, entity_id, action, old_values, new_values, changes, ip_address, additional_data)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
      [
        auditData.user_id,
        auditData.entity_type,
        auditData.entity_id,
        auditData.action,
        JSON.stringify(auditData.old_values || {}),
        JSON.stringify(auditData.new_values || {}),
        JSON.stringify(auditData.changes || {}),
        auditData.ip_address,
        JSON.stringify(auditData.additional_data || {})
      ]
    );
    return result.rows[0];
  }

  async getAuditLogs(filters = {}, limit = 100, offset = 0) {
    let query = "SELECT * FROM audit_logs WHERE 1=1";
    const values = [];
    let paramCount = 0;

    if (filters.entity_type) {
      paramCount++;
      query += ` AND entity_type = $${paramCount}`;
      values.push(filters.entity_type);
    }

    if (filters.user_id) {
      paramCount++;
      query += ` AND user_id = $${paramCount}`;
      values.push(filters.user_id);
    }

    if (filters.action) {
      paramCount++;
      query += ` AND action = $${paramCount}`;
      values.push(filters.action);
    }

    if (filters.start_date) {
      paramCount++;
      query += ` AND performed_at >= $${paramCount}`;
      values.push(filters.start_date);
    }

    if (filters.end_date) {
      paramCount++;
      query += ` AND performed_at <= $${paramCount}`;
      values.push(filters.end_date);
    }

    query += ` ORDER BY performed_at DESC LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}`;
    values.push(limit, offset);

    const result = await pool.query(query, values);
    return result.rows;
  }

  async getEntityHistory(entityType, entityId) {
    const result = await pool.query(
      `SELECT * FROM audit_logs 
       WHERE entity_type = $1 AND entity_id = $2
       ORDER BY performed_at DESC`,
      [entityType, entityId]
    );
    return result.rows;
  }

  async getUserActivity(userId, limit = 50) {
    const result = await pool.query(
      `SELECT * FROM audit_logs 
       WHERE user_id = $1
       ORDER BY performed_at DESC
       LIMIT $2`,
      [userId, limit]
    );
    return result.rows;
  }
}

module.exports = new AuditRepository();
