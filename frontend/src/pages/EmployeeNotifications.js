import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NavBar from '../NavBar';   // ← Fixed import

const EmployeeNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const profile = JSON.parse(localStorage.getItem('profile') || '{}');
  const userId = profile.user_id;

  useEffect(() => {
  console.log("userId =", userId);

  if (userId) {
    fetchNotifications();
  }
}, [userId]);
 const fetchNotifications = async () => {
  try {
    const res = await axios.get(
      `/api/notifications?user_id=${userId}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      }
    );

    console.log("Notifications API:", res.data);

    setNotifications(
  Array.isArray(res.data.data)
    ? res.data.data
    : []
);

  } catch (err) {
    console.error('Fetch notifications error:', err);
    setNotifications([]);
  } finally {
    setLoading(false);
  }
};

  const markAsRead = async (id) => {
    try {
      await axios.put(`/api/notifications/${id}/read`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      fetchNotifications();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <NavBar />
      <div className="max-w-4xl mx-auto p-6 pt-20">
        <h1 className="text-3xl font-bold mb-6">My Notifications</h1>

        {loading ? (
          <p className="text-center">Loading...</p>
        ) : notifications.length === 0 ? (
          <p className="text-gray-500 text-center py-10">No notifications yet.</p>
        ) : (
          <div className="space-y-4">
            {notifications.map(notif => (
              <div
                key={notif.id}
                className={`p-5 rounded-xl border shadow-sm ${notif.is_read ? 'bg-gray-50' : 'bg-white border-blue-300'}`}
              >
                <div className="flex justify-between items-start">
                  <h3 className="font-semibold text-lg">{notif.title}</h3>
                  <span className="text-xs text-gray-500">
                    {new Date(notif.created_at).toLocaleString()}
                  </span>
                </div>
                <p className="mt-2 text-gray-700">{notif.message}</p>

                {!notif.is_read && (
                  <button
                    onClick={() => markAsRead(notif.id)}
                    className="mt-4 text-sm font-medium text-blue-600 hover:text-blue-700"
                  >
                    Mark as Read
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeNotifications;