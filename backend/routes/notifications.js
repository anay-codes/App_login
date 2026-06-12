const express = require("express");
const router  = express.Router();
const NotificationService = require("../services/NotificationService");
const pool = require("../config/db");

const canAccessUser = (req, userId) =>
  req.user.role === "Admin" || Number(req.user.id) === Number(userId);

const canAccessNotification = async (req, notificationId) => {
  if (req.user.role === "Admin") return true;
  const result = await pool.query(
    "SELECT user_id FROM notifications WHERE id = $1",
    [notificationId]
  );
  return result.rows[0]?.user_id === req.user.id;
};

// ── GET /api/notifications?user_id=&limit=&offset=
router.get("/", async (req, res) => {
  try {
    const { user_id, limit = 20, offset = 0 } = req.query;
    if (!user_id) return res.status(400).json({ success: false, message: "user_id required" });
    if (!canAccessUser(req, user_id)) return res.status(403).json({ success: false, message: "Access denied" });
    const notifications = await NotificationService.getNotifications(
      parseInt(user_id),
      parseInt(limit),
      parseInt(offset)
    );
    res.json({ success: true, data: notifications });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── GET /api/notifications/unread-count?user_id=
router.get("/unread-count", async (req, res) => {
  try {
    const { user_id } = req.query;
    if (!user_id) return res.status(400).json({ success: false, message: "user_id required" });
    if (!canAccessUser(req, user_id)) return res.status(403).json({ success: false, message: "Access denied" });
    const count = await NotificationService.getUnreadCount(parseInt(user_id));
    res.json({ success: true, count });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── PUT /api/notifications/:id/read
router.put("/:id/read", async (req, res) => {
  try {
    if (!(await canAccessNotification(req, req.params.id))) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }
    const notification = await NotificationService.markAsRead(req.params.id);
    res.json({ success: true, message: "Marked as read", data: notification });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── PUT /api/notifications/mark-all-read  (body: { user_id })
router.put("/mark-all-read", async (req, res) => {
  try {
    const { user_id } = req.body;
    if (!user_id) return res.status(400).json({ success: false, message: "user_id required" });
    if (!canAccessUser(req, user_id)) return res.status(403).json({ success: false, message: "Access denied" });
    await NotificationService.markAllAsRead(parseInt(user_id));
    res.json({ success: true, message: "All notifications marked as read" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── DELETE /api/notifications/:id
router.delete("/:id", async (req, res) => {
  try {
    if (!(await canAccessNotification(req, req.params.id))) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }
    await NotificationService.deleteNotification(req.params.id);
    res.json({ success: true, message: "Notification deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/notifications/broadcast  (admin sends to all employees)
router.post("/broadcast", async (req, res) => {
  try {
    if (req.user.role !== "Admin") {
      return res.status(403).json({ success: false, message: "Access denied" });
    }
    const { title, message } = req.body;
    if (!title || !message) 
      return res.status(400).json({ success: false, message: "title and message required" });

    const employees = await pool.query(
      "SELECT DISTINCT user_id FROM employee_profiles WHERE user_id IS NOT NULL"
    );

    const promises = employees.rows.map(emp =>
      NotificationService.sendNotification({
        user_id: emp.user_id,
        title,
        message,
        notification_type: "GENERAL"
      })
    );

    await Promise.all(promises);
    res.json({ success: true, message: "Notification sent to all employees" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
