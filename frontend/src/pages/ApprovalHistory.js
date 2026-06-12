import { useEffect, useState } from "react";
import axios from "axios";
import EmployeeLayout from "../components/EmployeeLayout";

export default function ApprovalHistory() {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const profile = JSON.parse(localStorage.getItem("profile") || "null");
  const employee_id = profile?.id;

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `/api/leaves/my/${employee_id}`
      );
      setLeaves(res.data);
    } catch (error) {
      setError("Failed to load history.");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (d) => d ? new Date(d).toLocaleDateString() : "—";

  return (
    <EmployeeLayout>
        <div className="page-header">
          <div>
            <h1 className="page-title">Approval History</h1>
            <p className="page-subtitle">Your leave request history</p>
          </div>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        {loading ? (
          <p>Loading...</p>
        ) : leaves.length === 0 ? (
          <div className="card-standard">
            <div className="empty-state">
              <div className="empty-state-title">No leave requests found.</div>
            </div>
          </div>
        ) : (
          <div className="card-standard">
            <div className="table-wrapper">
              <table className="table-standard">
                <thead>
                  <tr>
                    <th>Leave Type</th>
                    <th>From</th>
                    <th>To</th>
                    <th>Days</th>
                    <th>Reason</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {leaves.map((leave) => (
                    <tr key={leave.id}>
                      <td>{leave.leave_name}</td>
                      <td>{formatDate(leave.from_date)}</td>
                      <td>{formatDate(leave.to_date)}</td>
                      <td>{leave.total_days}</td>
                      <td>{leave.reason || "—"}</td>
                      <td>
                        <span style={{
                          padding: "4px 10px",
                          borderRadius: "20px",
                          fontSize: "12px",
                          fontWeight: "600",
                          background: leave.status === "Approved" ? "#d1fae5" : leave.status === "Rejected" ? "#fee2e2" : "#fef3c7",
                          color: leave.status === "Approved" ? "#065f46" : leave.status === "Rejected" ? "#7f1d1d" : "#78350f"
                        }}>
                          {leave.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
    </EmployeeLayout>
  );
}
