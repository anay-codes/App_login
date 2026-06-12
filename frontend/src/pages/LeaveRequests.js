import { useEffect, useState } from "react";
import axios from "axios";
import EmployeeSidebar from "../components/EmployeeSidebar";

export default function LeaveRequests() {
  const [leaveTypes, setLeaveTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    leave_type_id: "",
    from_date: "",
    to_date: "",
    reason: ""
  });

  const profile = JSON.parse(localStorage.getItem("profile") || "null");
  const employee_id = profile?.id;

  useEffect(() => {
    loadLeaveTypes();
  }, []);

  const loadLeaveTypes = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/leaves/leave-types");
      setLeaveTypes(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!employee_id) {
      setError("Employee profile not found. Please login again.");
      return;
    }

    setLoading(true);
    try {
      await axios.post("http://localhost:5000/api/leaves/apply", {
        ...formData,
        employee_id
      });
      setSuccess("Leave applied successfully!");
      setFormData({ leave_type_id: "", from_date: "", to_date: "", reason: "" });
    } catch (error) {
      setError(error.response?.data || "Failed to apply for leave.");
    } finally {
      setLoading(false);
    }
  };

 return (
  <div className="dashboard-layout">
    <EmployeeSidebar/>
    <div className="dashboard-content">
          <div>
            <h1 className="page-title">Apply for Leave</h1>
            <p className="page-subtitle">Submit a new leave request</p>
          </div>
        </div>

        {success && <div className="alert alert-success">{success}</div>}
        {error && <div className="alert alert-danger">{error}</div>}

        <div className="card-standard" style={{ maxWidth: "600px" }}>
          <form onSubmit={handleSubmit}>
            <div className="form-section">
              <h5 className="form-section-title">Leave Details</h5>

              <div className="form-group">
                <label className="form-label">Leave Type *</label>
                <select
                  className="form-control"
                  value={formData.leave_type_id}
                  onChange={(e) => setFormData({ ...formData, leave_type_id: e.target.value })}
                  required
                >
                  <option value="">Select Leave Type</option>
                  {leaveTypes.map((lt) => (
                    <option key={lt.id} value={lt.id}>
                      {lt.leave_name} ({lt.total_days} days)
                    </option>
                  ))}
                </select>
              </div>

              <div className="row">
                <div className="col-md-6">
                  <div className="form-group">
                    <label className="form-label">From Date *</label>
                    <input
                      type="date"
                      className="form-control"
                      value={formData.from_date}
                      onChange={(e) => setFormData({ ...formData, from_date: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group">
                    <label className="form-label">To Date *</label>
                    <input
                      type="date"
                      className="form-control"
                      value={formData.to_date}
                      onChange={(e) => setFormData({ ...formData, to_date: e.target.value })}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Reason</label>
                <textarea
                  className="form-control"
                  rows={3}
                  placeholder="Reason for leave"
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                />
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? "Submitting..." : "Apply Leave"}
              </button>
            </div>
          </form>
        </div>
      </div>
  );
}