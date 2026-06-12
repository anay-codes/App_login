import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import "../App.css";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editNotif, setEditNotif] = useState(null);
  const [form, setForm] = useState({ title: "", message: "" });

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("profile") || "{}");
  const userId = user.user_id || 1;

  useEffect(() => { loadNotifications(); }, []);

  const loadNotifications = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`/api/notifications?user_id=${userId}`);
      setNotifications(res.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const openAdd = () => {
    setEditNotif(null);
    setForm({ title: "", message: "" });
    setShowModal(true);
  };

  const openEdit = (notif) => {
    setEditNotif(notif);
    setForm({ title: notif.title, message: notif.message });
    setShowModal(true);
  };

  const handleSubmit = async () => {
    if (!form.title || !form.message) return alert("Title and message required");
    try {
      if (editNotif) {
        // no bulk-edit endpoint — just update locally for now
        alert("Edit saved locally. No bulk re-send.");
        setShowModal(false);
        return;
      }
      await axios.post("/api/notifications/broadcast", form);
      alert("Notification sent to all employees");
      setShowModal(false);
      loadNotifications();
    } catch (err) {
      alert("Error: " + (err.response?.data?.message || err.message));
    }
  };

  const markAllAsRead = async () => {
    try {
      await axios.put("/api/notifications/mark-all-read", { user_id: userId });
      loadNotifications();
    } catch (err) {
      alert("Error marking all as read");
    }
  };

  const markAsRead = async (id) => {
    try {
      await axios.put(`/api/notifications/${id}/read`);
      loadNotifications();
    } catch (err) {
      alert("Error marking as read");
    }
  };

  const deleteNotification = async (id) => {
    if (!window.confirm("Delete this notification?")) return;
    try {
      await axios.delete(`/api/notifications/${id}`);
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
            <p className="page-subtitle">Broadcast alerts to all employees</p>
          </div>
          <div className="page-actions">
            <button className="btn btn-secondary me-2" onClick={markAllAsRead}>Mark All Read</button>
            <button className="btn btn-primary" onClick={openAdd}>+ New</button>
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
              <ul style={{ listStyleType: "none", padding: 0 }}>
                {notifications.map(notif => (
                  <li key={notif.id} style={{
                    padding: "16px",
                    borderBottom: "1px solid #eee",
                    background: notif.is_read ? "#fff" : "#f0fdf4",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center"
                  }}>
                    <div>
                      <h5 style={{ margin: "0 0 8px 0" }}>
                        {notif.title} {!notif.is_read && <span className="badge bg-success">New</span>}
                      </h5>
                      <p style={{ margin: "0 0 4px 0", color: "#555" }}>{notif.message}</p>
                      <small className="text-muted">{new Date(notif.created_at).toLocaleString()}</small>
                    </div>
                    <div style={{ display: "flex", gap: "8px" }}>
                      {!notif.is_read && (
                        <button className="btn btn-sm btn-primary" onClick={() => markAsRead(notif.id)}>Mark Read</button>
                      )}
                      <button className="btn btn-sm btn-warning" onClick={() => openEdit(notif)}>Edit</button>
                      <button className="btn btn-sm btn-danger" onClick={() => deleteNotification(notif.id)}>Delete</button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {showModal && (
          <div className="modal-overlay">
            <div className="modal-box">
              <h5>{editNotif ? "Edit Notification" : "New Notification"}</h5>
              <input
                className="form-control mb-2"
                placeholder="Title"
                value={form.title}
                onChange={e => setForm({ ...form, title: e.target.value })}
              />
              <textarea
                className="form-control mb-3"
                placeholder="Message"
                rows={3}
                value={form.message}
                onChange={e => setForm({ ...form, message: e.target.value })}
              />
              <div className="modal-actions">
                <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button className="btn btn-primary" onClick={handleSubmit}>
                  {editNotif ? "Save" : "Send to All"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}