import { Navigate, Link } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import AdminLayout from "../components/AdminLayout";
import "../App.css";

const initialStats = {
  employees: 0,
  departments: 0,
  skills: 0,
  pendingLeaves: 0,
  approvedLeaves: 0,
  rejectedLeaves: 0,
  employeesOnLeave: 0,
  totalAssets: 0,
  allocatedAssets: 0,
  availableAssets: 0
};

function Dashboard() {
  const [stats, setStats] = useState(initialStats);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const token = localStorage.getItem("token");

  const loadStats = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get("/api/dashboard/stats");
      setStats(res.data);
    } catch (requestError) {
      setError("Dashboard data could not be loaded. Confirm that the backend is running.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  if (!token) return <Navigate to="/login" />;

  const employees = Number(stats.employees) || 0;
  const activeEmployees = Math.max(0, employees - Number(stats.employeesOnLeave || 0));
  const attendanceRate = employees ? Math.round((activeEmployees / employees) * 100) : 0;
  const leaveTotal = Number(stats.pendingLeaves) + Number(stats.approvedLeaves) + Number(stats.rejectedLeaves);
  const leaveSegments = [
    { label: "Approved", value: Number(stats.approvedLeaves), className: "success" },
    { label: "Pending", value: Number(stats.pendingLeaves), className: "warning" },
    { label: "Rejected", value: Number(stats.rejectedLeaves), className: "danger" }
  ];

  return (
    <AdminLayout>
      <div className="page-header">
        <div>
          <h1 className="page-title">Admin Dashboard</h1>
          <p className="page-subtitle">Workforce, leave, attendance, and asset overview.</p>
        </div>
        <div className="page-actions">
          <button className="btn btn-secondary" onClick={loadStats}>Refresh</button>
          <Link className="btn btn-primary" to="/create-employee">Add employee</Link>
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}
      {loading ? (
        <div className="loading-container"><div className="spinner-border" /></div>
      ) : (
        <>
          <div className="metric-grid">
            <div className="metric-card"><span>Employees</span><strong>{employees}</strong><small>{activeEmployees} currently active</small></div>
            <div className="metric-card"><span>Pending leave</span><strong>{stats.pendingLeaves}</strong><small>Requests awaiting review</small></div>
            <div className="metric-card"><span>Attendance</span><strong>{attendanceRate}%</strong><small>Available workforce today</small></div>
            <div className="metric-card"><span>Available assets</span><strong>{stats.availableAssets}</strong><small>of {stats.totalAssets} total assets</small></div>
          </div>

          <div className="dashboard-grid">
            <section className="card-standard dashboard-panel dashboard-panel-wide">
              <div className="card-header"><h2 className="card-title">Attendance overview</h2><Link to="/attendance">Manage</Link></div>
              <div className="chart-row">
                <div className="donut-chart" style={{ "--value": `${attendanceRate * 3.6}deg` }}>
                  <span>{attendanceRate}%</span>
                </div>
                <div>
                  <p className="dashboard-value">{activeEmployees} active employees</p>
                  <p className="page-subtitle">{stats.employeesOnLeave} employees currently on approved leave.</p>
                  <div className="legend"><span className="legend-dot success" />Active <span className="legend-dot warning" />On leave</div>
                </div>
              </div>
            </section>

            <section className="card-standard dashboard-panel">
              <div className="card-header"><h2 className="card-title">Leave statistics</h2><Link to="/leave-list">Review</Link></div>
              {leaveSegments.map((item) => (
                <div className="bar-stat" key={item.label}>
                  <div><span>{item.label}</span><strong>{item.value}</strong></div>
                  <div className="progress-track"><div className={`progress-value ${item.className}`} style={{ width: `${leaveTotal ? (item.value / leaveTotal) * 100 : 0}%` }} /></div>
                </div>
              ))}
            </section>

            <section className="card-standard dashboard-panel">
              <div className="card-header"><h2 className="card-title">Organization</h2></div>
              <div className="compact-stat"><span>Departments</span><strong>{stats.departments}</strong></div>
              <div className="compact-stat"><span>Tracked skills</span><strong>{stats.skills}</strong></div>
              <div className="compact-stat"><span>Allocated assets</span><strong>{stats.allocatedAssets}</strong></div>
            </section>

            <section className="card-standard dashboard-panel dashboard-panel-wide">
              <div className="card-header"><h2 className="card-title">Quick actions</h2></div>
              <div className="quick-action-grid">
                <Link to="/employees">Manage employees</Link>
                <Link to="/leave-list">Review leave</Link>
                <Link to="/attendance">Attendance</Link>
                <Link to="/notifications">Send notification</Link>
                <Link to="/admin-tasks">Assign task</Link>
                <Link to="/reports">Open reports</Link>
              </div>
            </section>

            <section className="card-standard dashboard-panel">
              <div className="card-header"><h2 className="card-title">Notifications</h2><Link to="/notifications">Open</Link></div>
              <p className="page-subtitle">Broadcast company updates and review your notification history.</p>
              <Link className="btn btn-primary" to="/notifications">Notification center</Link>
            </section>
          </div>
        </>
      )}
    </AdminLayout>
  );
}

export default Dashboard;
