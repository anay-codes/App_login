import React from "react";
import EmployeeLayout from "../components/EmployeeLayout";

export default function EmployeeDashboard() {
  const profile = JSON.parse(localStorage.getItem("profile") || "{}");
  return (
    <EmployeeLayout>
      <div className="page-header">
        <div>
          <h1 className="page-title">Employee Dashboard</h1>
          <p className="page-subtitle">Welcome back{profile.designation ? `, ${profile.designation}` : ""}.</p>
        </div>
      </div>
      <div className="stats-grid">
        <div className="stat-card"><h5>Attendance</h5><h2>Today</h2><p className="page-subtitle">Open attendance to punch in</p></div>
        <div className="stat-card stat-secondary"><h5>Task Progress</h5><h2>View</h2><p className="page-subtitle">Review assigned work</p></div>
        <div className="stat-card stat-warning"><h5>My Assets</h5><h2>View</h2><p className="page-subtitle">Check allocated equipment</p></div>
      </div>
      <div className="dashboard-grid">
        <section className="card-standard dashboard-panel">
          <h2 className="card-title">Quick actions</h2>
          <div className="page-actions" style={{ marginTop: 20 }}>
            <a className="btn btn-primary" href="/mark-attendance">Mark attendance</a>
            <a className="btn btn-secondary" href="/leave-requests">Apply for leave</a>
            <a className="btn btn-secondary" href="/tasks">View tasks</a>
          </div>
        </section>
        <section className="card-standard dashboard-panel">
          <h2 className="card-title">Workspace overview</h2>
          <p className="page-subtitle">Use the sidebar to access your profile, leave history, assets, notifications, and attendance.</p>
        </section>
      </div>
    </EmployeeLayout>
  );
}
