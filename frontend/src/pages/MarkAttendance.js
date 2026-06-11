import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NavBar from '../NavBar';

const MarkAttendance = () => {
  const [todayAttendance, setTodayAttendance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  const profile = JSON.parse(localStorage.getItem('profile') || '{}');
  const employeeId = profile.id;

  useEffect(() => {
    fetchTodayAttendance();
  }, []);

  const fetchTodayAttendance = async () => {
    try {
      const res = await axios.get(`/api/attendance/today?employee_id=${employeeId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setTodayAttendance(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePunchIn = async () => {
    try {
      const res = await axios.post('/api/attendance/punch-in', {
        employee_id: employeeId
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      
      setTodayAttendance(res.data);
      setMessage('✅ Successfully punched in!');
      setTimeout(() => setMessage(''), 4000);
    } catch (err) {
      setMessage('❌ ' + (err.response?.data?.error || 'Failed to punch in'));
    }
  };

  return (
    <div className="dashboard-layout">
      <NavBar />
      <div className="dashboard-content">
        <h1 className="page-title">Mark Attendance</h1>
        <p className="page-subtitle">Today: {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>

        {message && (
          <div className={`alert ${message.includes('✅') ? 'alert-success' : 'alert-danger'}`}>
            {message}
          </div>
        )}

        <div className="card-standard text-center" style={{ maxWidth: '500px', margin: '0 auto' }}>
          {loading ? (
            <p>Loading today's record...</p>
            ) : todayAttendance && todayAttendance.punch_in ? (
  <div>
    {todayAttendance.finalized ? (
      <>
        <div className="text-5xl mb-4">
          {todayAttendance.status === 'Present' ? '✅' : '❌'}
        </div>

        <h2 className="text-3xl font-bold mb-2">
          {todayAttendance.status === 'Present' && 'Attendance Confirmed: Present'}
          {todayAttendance.status === 'Absent' && 'Marked Absent by Admin'}
          {todayAttendance.status === 'Leave' && 'Leave Approved'}
        </h2>

        <p className="text-lg text-gray-600">
          Finalized by Admin
        </p>
      </>
    ) : (
      <>
        <div className="text-5xl mb-4">⏳</div>

        <h2 className="text-3xl font-bold text-warning mb-2">
          Attendance Pending Review
        </h2>

        <p className="text-lg text-gray-600">
          Punched in at: <strong>{new Date(todayAttendance.punch_in).toLocaleTimeString()}</strong>
        </p>
      </>
    )}
  </div>
) : (
            <div>
              <div className="text-5xl mb-6">🕒</div>
              <button
                onClick={handlePunchIn}
                className="btn btn-primary text-xl px-16 py-6 rounded-2xl font-semibold"
              >
                Punch In Now
              </button>
              <p className="text-sm text-gray-500 mt-6">You can only punch in once per day</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MarkAttendance;