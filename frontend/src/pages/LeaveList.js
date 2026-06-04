import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function LeaveList() {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    loadLeaves();
  }, []);

  const loadLeaves = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5000/api/leaves");
      setLeaves(res.data);
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
    if (remarks === null) return; // user cancelled prompt

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
    if (remarks === null) return; // user cancelled prompt

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
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Leave Requests</h2>
        <div>
          <button
            className="btn btn-success me-2"
            onClick={() => navigate("/leave-application")}
          >
            Apply Leave
          </button>
          <button
            className="btn btn-dark"
            onClick={() => navigate("/dashboard")}
          >
            Dashboard
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center mt-5">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : error ? (
        <div className="alert alert-danger">{error}</div>
      ) : leaves.length === 0 ? (
        <div className="alert alert-info text-center">No leave requests found.</div>
      ) : (
        <div className="table-responsive">
          <table className="table table-bordered table-striped mt-3">
            <thead>
              <tr>
                <th>ID</th>
                <th>Employee Name</th>
                <th>Email</th>
                <th>Leave Type</th>
                <th>From Date</th>
                <th>To Date</th>
                <th>Total Days</th>
                <th>Reason</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {leaves.map((leave) => (
                <tr key={leave.id}>
                  <td>{leave.id}</td>
                  <td>{leave.employee_name}</td>
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
                      <div className="d-flex gap-2">
                        <button
                          className="btn btn-sm btn-success"
                          onClick={() => handleApprove(leave.id)}
                        >
                          Approve
                        </button>
                        <button
                          className="btn btn-sm btn-danger"
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
      )}
    </div>
  );
}

export default LeaveList;
