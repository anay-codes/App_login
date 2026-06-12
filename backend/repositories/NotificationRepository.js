// Notification Repository
const pool = require("../config/db");

class NotificationRepository {
  async createNotification(notificationData) {
    const result = await pool.query(
      `INSERT INTO notifications 
       (user_id, title, message, notification_type, related_entity_type, related_entity_id, action_url)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [
        notificationData.user_id,
        notificationData.title,
        notificationData.message,
        notificationData.notification_type,
        notificationData.related_entity_type,
        notificationData.related_entity_id,
        notificationData.action_url
      ]
    );
    return result.rows[0];
  }

  async getUserNotifications(userId, limit = 20, offset = 0) {
    const result = await pool.query(
      `SELECT * FROM notifications 
       WHERE user_id = $1 
       ORDER BY created_at DESC
       LIMIT $2 OFFSET $3`,
      [userId, limit, offset]
    );
    return result.rows;
  }

  async getUnreadNotificationCount(userId) {
    const result = await pool.query(
      "SELECT COUNT(*) as count FROM notifications WHERE user_id = $1 AND is_read = FALSE",
      [userId]
    );
    return parseInt(result.rows[0].count);
  }

  async markAsRead(notificationId) {
    const result = await pool.query(
      `UPDATE notifications 
       SET is_read = TRUE, read_at = CURRENT_TIMESTAMP
       WHERE id = $1
       RETURNING *`,
      [notificationId]
    );
    return result.rows[0];
  }

  async markAllAsRead(userId) {
    await pool.query(
      `UPDATE notifications 
       SET is_read = TRUE, read_at = CURRENT_TIMESTAMP
       WHERE user_id = $1 AND is_read = FALSE`,
      [userId]
    );
    return true;
  }

  async deleteNotification(id) {
    const result = await pool.query("DELETE FROM notifications WHERE id = $1 RETURNING id", [id]);
    return result.rows[0];
  }

  async getNotificationPreferences(userId) {
    const result = await pool.query(
      "SELECT * FROM notification_preferences WHERE user_id = $1",
      [userId]
    );
    return result.rows[0];
  }

  async updateNotificationPreferences(userId, preferences) {
    const result = await pool.query(
      `INSERT INTO notification_preferences 
       (user_id, email_on_leave_approval, email_on_asset_allocation, in_app_notifications)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (user_id) DO UPDATE SET 
       email_on_leave_approval = $2, 
       email_on_asset_allocation = $3, 
       in_app_notifications = $4
       RETURNING *`,
      [
        userId,
        preferences.email_on_leave_approval,
        preferences.email_on_asset_allocation,
        preferences.in_app_notifications
      ]
    );
    return result.rows[0];
  }
}

module.exports = new NotificationRepository();
