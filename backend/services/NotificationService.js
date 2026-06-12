// Notification Service
const NotificationRepository = require("../repositories/NotificationRepository");

class NotificationService {
  async getNotifications(userId, limit = 20, offset = 0) {
    return await NotificationRepository.getUserNotifications(userId, limit, offset);
  }

  async getUnreadCount(userId) {
    return await NotificationRepository.getUnreadNotificationCount(userId);
  }

  async markAsRead(notificationId) {
    const notification = await NotificationRepository.markAsRead(notificationId);
    if (!notification) throw new Error("Notification not found");
    return notification;
  }

  async markAllAsRead(userId) {
    return await NotificationRepository.markAllAsRead(userId);
  }

  async deleteNotification(id) {
    const notification = await NotificationRepository.deleteNotification(id);
    if (!notification) throw new Error("Notification not found");
    return notification;
  }

  async getPreferences(userId) {
    return await NotificationRepository.getNotificationPreferences(userId);
  }

  async updatePreferences(userId, preferences) {
    return await NotificationRepository.updateNotificationPreferences(userId, preferences);
  }

  // Internal method for creating notifications
  async sendNotification(notificationData) {
    return await NotificationRepository.createNotification(notificationData);
  }
}

module.exports = new NotificationService();
