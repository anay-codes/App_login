import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import "../App.css";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Hardcoding user_id=1 for admin as example, normally derived from token
  const userId = 1;

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:5000/api/notifications?user_id=${userId}`);
      setNotifications(res.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/notifications/${id}/read`);
      loadNotifications();
    } catch (err) {
      alert("Error marking as read");
    }
  };

  const markAllAsRead = async () => {
    try {
      await axios.put("http://localhost:5000/api/notifications/mark-all-read", { user_id: userId });
      loadNotifications();
    } catch (err) {
      alert("Error marking all as read");
    }
  };

  const deleteNotification = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/notifications/${id}`);
      loadNotifications();
    } catch (err) {
      alert("Error deleting notification");
    }
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="dashboard-content">
        <div className="page-header">
          <div>
            <h1 className="page-title">Notifications</h1>
            <p className="page-subtitle">View system alerts and updates</p>
          </div>
          <div className="page-actions">
            <button className="btn btn-secondary" onClick={markAllAsRead}>Mark All as Read</button>
          </div>
        </div>

        {loading ? (
          <div className="loading-container">
            <div className="spinner-border text-primary" role="status"></div>
          </div>
        ) : (
          <div className="card-standard">
            {notifications.length === 0 ? (
              <p className="text-center text-muted py-4">No notifications found.</p>
            ) : (
              <ul style={{ listStyleType: 'none', padding: 0 }}>
                {notifications.map(notif => (
                  <li key={notif.id} style={{ 
                    padding: '16px', 
                    borderBottom: '1px solid #eee', 
                    background: notif.is_read ? '#fff' : '#f0fdf4',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <div>
                      <h5 style={{ margin: '0 0 8px 0' }}>{notif.title} {!notif.is_read && <span className="badge bg-success">New</span>}</h5>
                      <p style={{ margin: '0 0 4px 0', color: '#555' }}>{notif.message}</p>
                      <small className="text-muted">{new Date(notif.created_at).toLocaleString()}</small>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      {!notif.is_read && (
                        <button className="btn btn-sm btn-primary" onClick={() => markAsRead(notif.id)}>Mark Read</button>
                      )}
                      <button className="btn btn-sm btn-danger" onClick={() => deleteNotification(notif.id)}>Delete</button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
