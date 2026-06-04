import { Navigate, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import "../App.css";

function Dashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [stats, setStats] = useState({
    employees: 0,
    departments: 0,
    skills: 0,
    pendingLeaves: 0,
    approvedLeaves: 0,
    rejectedLeaves: 0,
    employeesOnLeave: 0
  });

  const token = localStorage.getItem("token");

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        "http://localhost:5000/api/dashboard/stats"
      );
      setStats(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return <Navigate to="/login" />;
  }

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="dashboard-layout">

      <div className="sidebar">

        <h3 className="sidebar-title">
          EMS
        </h3>

        <div className="sidebar-nav">
          <button
            className="sidebar-btn active"
            onClick={() => navigate("/dashboard")}
          >
            Dashboard
          </button>

          <button
            className="sidebar-btn"
            onClick={() => navigate("/create-employee")}
          >
            Create Employee
          </button>

          <button
            className="sidebar-btn"
            onClick={() => navigate("/employees")}
          >
            Employee List
          </button>

          <button
            className="sidebar-btn"
            onClick={() => navigate("/departments")}
          >
            Departments
          </button>

          <button
            className="sidebar-btn"
            onClick={() => navigate("/skills")}
          >
            Skills
          </button>

          <button
            className="sidebar-btn"
            onClick={() => navigate("/leave-application")}
          >
            Apply Leave
          </button>

          <button
            className="sidebar-btn"
            onClick={() => navigate("/leave-list")}
          >
            Manage Leaves
          </button>

          <button
            className="sidebar-btn logout-btn"
            onClick={logout}
          >
            Logout
          </button>
        </div>

      </div>

      <div className="dashboard-content">

        <div className="page-header">
          <h1 className="page-title">Employee Management Dashboard</h1>
        </div>

        {loading ? (
          <div className="loading-container">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3 text-muted">Loading dashboard data...</p>
          </div>
        ) : (
          <>
            <div className="stats-grid">

              <div className="stat-card">
                <h5>Total Employees</h5>
                <h2>{stats.employees}</h2>
              </div>

              <div className="stat-card stat-secondary">
                <h5>Departments</h5>
                <h2>{stats.departments}</h2>
              </div>

              <div className="stat-card stat-secondary">
                <h5>Skills</h5>
                <h2>{stats.skills}</h2>
              </div>

              <div className="stat-card stat-warning">
                <h5>Pending Leaves</h5>
                <h2>{stats.pendingLeaves}</h2>
              </div>

              <div className="stat-card stat-secondary">
                <h5>Approved Leaves</h5>
                <h2>{stats.approvedLeaves}</h2>
              </div>

              <div className="stat-card stat-danger">
                <h5>Rejected Leaves</h5>
                <h2>{stats.rejectedLeaves}</h2>
              </div>

              <div className="stat-card stat-warning">
                <h5>Employees On Leave</h5>
                <h2>{stats.employeesOnLeave}</h2>
              </div>

            </div>

            <div className="analytics-box">
              <h4>HR Analytics Overview</h4>

              <p>
                Total Employees: <strong>{stats.employees}</strong>
              </p>

              <p>
                Active Employees:{" "}
                <strong>
                  {stats.employees - stats.employeesOnLeave}
                </strong>
              </p>

              <p>
                Employees Currently On Leave:{" "}
                <strong>{stats.employeesOnLeave}</strong>
              </p>

              <p>
                Pending Leave Requests:{" "}
                <strong>{stats.pendingLeaves}</strong>
              </p>

              <p>
                Approved Leave Requests:{" "}
                <strong>{stats.approvedLeaves}</strong>
              </p>

              <p>
                Rejected Leave Requests:{" "}
                <strong>{stats.rejectedLeaves}</strong>
              </p>
            </div>
          </>
        )}

      </div>

    </div>
  );
}

export default Dashboard;