const express = require("express");
const router  = express.Router();
const AuditRepository = require("../repositories/AuditRepository");

// ── GET /api/audit
//    Optional query params: entity_type, user_id, action, start_date, end_date, limit, offset
router.get("/", async (req, res) => {
  try {
    const {
      entity_type,
      user_id,
      action,
      start_date,
      end_date,
      limit  = 100,
      offset = 0
    } = req.query;

    const filters = {};
    if (entity_type) filters.entity_type = entity_type;
    if (user_id)     filters.user_id     = parseInt(user_id);
    if (action)      filters.action      = action;
    if (start_date)  filters.start_date  = start_date;
    if (end_date)    filters.end_date    = end_date;

    const logs = await AuditRepository.getAuditLogs(
      filters,
      parseInt(limit),
      parseInt(offset)
    );

    res.json({ success: true, data: logs, count: logs.length });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── GET /api/audit/entity/:type/:id  (history of a specific record)
router.get("/entity/:type/:id", async (req, res) => {
  try {
    const logs = await AuditRepository.getEntityHistory(
      req.params.type,
      req.params.id
    );
    res.json({ success: true, data: logs });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── GET /api/audit/user/:id  (activity of a specific user)
router.get("/user/:id", async (req, res) => {
  try {
    const { limit = 50 } = req.query;
    const logs = await AuditRepository.getUserActivity(
      req.params.id,
      parseInt(limit)
    );
    res.json({ success: true, data: logs });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
