import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import AdminLayout from "../components/AdminLayout";

export default function AdminAttendance() {
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filterDate, setFilterDate] = useState(new Date().toISOString().split("T")[0]);

  const fetchAttendance = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get(`/api/attendance?start_date=${filterDate}&end_date=${filterDate}`);
      setAttendance(Array.isArray(res.data) ? res.data : []);
    } catch (requestError) {
      setError(requestError.response?.data?.error || "Attendance records could not be loaded.");
    } finally {
      setLoading(false);
    }
  }, [filterDate]);

  useEffect(() => {
    fetchAttendance();
  }, [fetchAttendance]);

  const updateAttendance = async (id, updates) => {
    try {
      await axios.put(`/api/attendance/${id}`, updates);
      fetchAttendance();
    } catch (requestError) {
      setError(requestError.response?.data?.error || "Attendance could not be updated.");
    }
  };

  return (
    <AdminLayout>
      <div className="page-header">
        <div>
          <h1 className="page-title">Attendance Management</h1>
          <p className="page-subtitle">Review employee punch-ins and finalize daily status.</p>
        </div>
        <input type="date" value={filterDate} onChange={(event) => setFilterDate(event.target.value)} className="form-control date-filter" />
      </div>
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="card-standard">
        <div className="table-wrapper">
          <table className="table-standard">
            <thead><tr><th>Employee</th><th>Punch in</th><th>Status</th><th>Review</th></tr></thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="4" className="table-message">Loading attendance...</td></tr>
              ) : attendance.length === 0 ? (
                <tr><td colSpan="4" className="table-message">No punch-ins found for this date.</td></tr>
              ) : attendance.map((record) => (
                <tr key={record.id}>
                  <td><strong>{record.full_name}</strong><div className="page-subtitle">{record.designation || "Employee"}</div></td>
                  <td>{record.punch_in ? new Date(record.punch_in).toLocaleTimeString() : "-"}</td>
                  <td><span className={`status-pill ${record.status === "Present" ? "success" : record.status === "Leave" ? "warning" : "danger"}`}>{record.status || "Absent"}</span></td>
                  <td>
                    {record.finalized ? <span className="status-pill success">Confirmed</span> : (
                      <div className="attendance-actions">
                        <select value={record.status || "Absent"} onChange={(event) => updateAttendance(record.id, { status: event.target.value })} className="form-select">
                          <option value="Present">Present</option><option value="Absent">Absent</option><option value="Leave">Leave</option>
                        </select>
                        <button className="btn btn-success btn-sm" onClick={() => updateAttendance(record.id, { finalized: true })}>Confirm</button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
