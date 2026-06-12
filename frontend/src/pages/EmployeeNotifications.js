import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import EmployeeLayout from "../components/EmployeeLayout";

export default function EmployeeNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const profile = JSON.parse(localStorage.getItem("profile") || "{}");
  const userId = profile.user_id;

  const fetchNotifications = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      return;
    }
    try {
      const res = await axios.get(`/api/notifications?user_id=${userId}`);
      setNotifications(Array.isArray(res.data.data) ? res.data.data : []);
    } catch (error) {
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const markAsRead = async (id) => {
    await axios.put(`/api/notifications/${id}/read`);
    fetchNotifications();
  };

  return (
    <EmployeeLayout>
      <div className="page-header">
        <div>
          <h1 className="page-title">My Notifications</h1>
          <p className="page-subtitle">Updates about leave, tasks, assets, and company activity.</p>
        </div>
      </div>
      {loading ? (
        <div className="loading-container"><div className="spinner-border" /></div>
      ) : notifications.length === 0 ? (
        <div className="card-standard empty-state">No notifications yet.</div>
      ) : (
        <div className="card-standard">
          <ul className="notification-list">
            {notifications.map((notification) => (
              <li className={`notification-item ${notification.is_read ? "" : "unread"}`} key={notification.id}>
                <div>
                  <h3 className="card-title">{notification.title}</h3>
                  <p className="page-subtitle">{notification.message}</p>
                  <small className="text-muted">{new Date(notification.created_at).toLocaleString()}</small>
                </div>
                {!notification.is_read && (
                  <button className="btn btn-sm btn-primary" onClick={() => markAsRead(notification.id)}>
                    Mark read
                  </button>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </EmployeeLayout>
  );
}
