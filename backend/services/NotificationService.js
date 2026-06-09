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
    return await NotificationRepository.markAsRead(notificationId);
  }

  async markAllAsRead(userId) {
    return await NotificationRepository.markAllAsRead(userId);
  }

  async deleteNotification(id) {
    return await NotificationRepository.deleteNotification(id);
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
