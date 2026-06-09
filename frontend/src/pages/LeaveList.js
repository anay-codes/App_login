import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import "../App.css";

function LeaveList() {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    pending: 0,
    approved: 0,
    rejected: 0
  });

  useEffect(() => {
    loadLeaves();
  }, []);

  const loadLeaves = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:5000/api/leaves");
      setLeaves(res.data);

      const pending = res.data.filter(l => l.status === "Pending").length;
      const approved = res.data.filter(l => l.status === "Approved").length;
      const rejected = res.data.filter(l => l.status === "Rejected").length;

      setStats({ pending, approved, rejected });
      setError("");
    } catch (err) {
      console.error("Error loading leaves", err);
      setError("Failed to fetch leave requests.");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    const remarks = window.prompt("Enter remarks for approval (optional):", "Approved");
    if (remarks === null) return;

    try {
      await axios.put(`http://localhost:5000/api/leaves/approve/${id}`, { remarks });
      alert("Leave request approved successfully!");
      loadLeaves();
    } catch (err) {
      console.error(err);
      alert(err.response?.data || "Error approving leave");
    }
  };

  const handleReject = async (id) => {
    const remarks = window.prompt("Enter remarks for rejection (optional):", "Rejected");
    if (remarks === null) return;

    try {
      await axios.put(`http://localhost:5000/api/leaves/reject/${id}`, { remarks });
      alert("Leave request rejected.");
      loadLeaves();
    } catch (err) {
      console.error(err);
      alert(err.response?.data || "Error rejecting leave");
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleDateString();
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "Approved":
        return "badge bg-success text-white";
      case "Rejected":
        return "badge bg-danger text-white";
      case "Pending":
      default:
        return "badge bg-warning text-dark";
    }
  };

  return (
    <div className="layout">

      <Sidebar />
      <div className="content-wrapper">

        <div className="page-header">
          <div>
            <h1 className="page-title">Leave Management</h1>
            <p className="page-subtitle">View and manage leave requests</p>
          </div>
          <div className="page-actions">
            <button
              className="btn btn-success"
              onClick={() => navigate("/leave-application")}
            >
              + Apply Leave
            </button>
          </div>
        </div>

        {!loading && !error && (
          <div className="stats-grid" style={{ marginBottom: "30px" }}>
            <div className="stat-card stat-warning">
              <h5>Pending</h5>
              <h2>{stats.pending}</h2>
            </div>
            <div className="stat-card stat-secondary">
              <h5>Approved</h5>
              <h2>{stats.approved}</h2>
            </div>
            <div className="stat-card stat-danger">
              <h5>Rejected</h5>
              <h2>{stats.rejected}</h2>
            </div>
          </div>
        )}

        {loading ? (
          <div className="loading-container">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3 text-muted">Loading leave requests...</p>
          </div>
        ) : error ? (
          <div className="alert alert-danger">{error}</div>
        ) : leaves.length === 0 ? (
          <div className="card-standard">
            <div className="empty-state">
              <div className="empty-state-title">No Leave Requests</div>
              <div className="empty-state-description">
                There are no leave requests in the system yet.
              </div>
              <div className="empty-state-action">
                <button
                  className="btn btn-primary"
                  onClick={() => navigate("/leave-application")}
                >
                  Apply Leave
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="card-standard">
            <div className="table-wrapper">
              <table className="table-standard">
                <thead>
                  <tr>
                    <th>Employee Name</th>
                    <th>Email</th>
                    <th>Leave Type</th>
                    <th>From Date</th>
                    <th>To Date</th>
                    <th>Days</th>
                    <th>Reason</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {leaves.map((leave) => (
                    <tr key={leave.id}>
                      <td><strong>{leave.employee_name}</strong></td>
                      <td>{leave.employee_email}</td>
                      <td>{leave.leave_name}</td>
                      <td>{formatDate(leave.from_date)}</td>
                      <td>{formatDate(leave.to_date)}</td>
                      <td>{leave.total_days}</td>
                      <td>{leave.reason || "N/A"}</td>
                      <td>
                        <span className={getStatusBadgeClass(leave.status)}>
                          {leave.status}
                        </span>
                      </td>
                      <td>
                        {leave.status === "Pending" ? (
                          <div className="table-action-buttons">
                            <button
                              className="btn btn-success btn-sm"
                              onClick={() => handleApprove(leave.id)}
                            >
                              Approve
                            </button>
                            <button
                              className="btn btn-danger btn-sm"
                              onClick={() => handleReject(leave.id)}
                            >
                              Reject
                            </button>
                          </div>
                        ) : (
                          <span className="text-muted">No Actions</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>

    </div>
  );
}

export default LeaveList;
