import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';

const AdminAttendance = () => {
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterDate, setFilterDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    fetchAttendance();
  }, [filterDate]);

  const fetchAttendance = async () => {
    try {
      const res = await axios.get(`/api/attendance?start_date=${filterDate}&end_date=${filterDate}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setAttendance(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      await axios.put(`/api/attendance/${id}`, { status: newStatus }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      fetchAttendance();
    } catch (err) {
      alert('Failed to update status');
    }
  };
  const confirmAttendance = async (id) => {
  try {
    await axios.put(
      `/api/attendance/${id}`,
      {
        finalized: true
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      }
    );

    fetchAttendance();
  } catch (err) {
    alert('Failed to confirm attendance');
  }
};

  return (
    <div className="dashboard-layout">   {/* ← Important */}
      <Sidebar />
      <div className="dashboard-content">   {/* ← Important */}
        <h1 className="page-title">Attendance Management</h1>
        <p className="page-subtitle">Track daily attendance and make overrides</p>

        <div className="mb-6">
          <input
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="form-control"
            style={{ width: 'auto', display: 'inline-block' }}
          />
        </div>

        <div className="card-standard">
          <table className="table-standard">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Punch In</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="4" style={{ textAlign: 'center', padding: '40px' }}>Loading...</td></tr>
              ) : attendance.length === 0 ? (
                <tr><td colSpan="4" style={{ textAlign: 'center', padding: '40px' }}>No records found for this date.</td></tr>
              ) : (
                attendance.map(record => (
                  <tr key={record.id}>
                    <td>{record.full_name}</td>
                    <td>{record.punch_in ? new Date(record.punch_in).toLocaleTimeString() : '-'}</td>
                    <td>
                      <span className={`px-3 py-1 rounded-full text-sm ${record.status === 'Present' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {record.status || 'Absent'}
                      </span>
                    </td>
                    <td>
  {record.finalized ? (
    <span className="badge bg-success">
      Confirmed
    </span>
  ) : (
    <div style={{ display: 'flex', gap: '10px' }}>
      <select
        value={record.status || 'Absent'}
        onChange={(e) => updateStatus(record.id, e.target.value)}
        className="form-select"
      >
        <option value="Present">Present</option>
        <option value="Absent">Absent</option>
        <option value="Leave">Leave</option>
      </select>

      <button
        className="btn btn-success"
        onClick={() => confirmAttendance(record.id)}
      >
        Confirm
      </button>
    </div>
  )}
</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminAttendance;