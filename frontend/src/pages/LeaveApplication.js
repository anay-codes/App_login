import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import "../App.css";

function LeaveApplication() {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [leaveTypes, setLeaveTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [daysRequested, setDaysRequested] = useState(0);

  const [formData, setFormData] = useState({
    employee_id: "",
    leave_type_id: "",
    from_date: "",
    to_date: "",
    reason: ""
  });

  useEffect(() => {
    loadEmployees();
    loadLeaveTypes();
  }, []);

  useEffect(() => {
    if (formData.from_date && formData.to_date) {
      const from = new Date(formData.from_date);
      const to = new Date(formData.to_date);
      const days = Math.ceil((to - from) / (1000 * 60 * 60 * 24)) + 1;
      setDaysRequested(days > 0 ? days : 0);
    } else {
      setDaysRequested(0);
    }
  }, [formData.from_date, formData.to_date]);

  const loadEmployees = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/employees");
      setEmployees(res.data);
    } catch (err) {
      console.error("Error loading employees", err);
      setError("Failed to load employees");
    }
  };

  const loadLeaveTypes = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/leaves/leave-types");
      setLeaveTypes(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Error loading leave types", err);
      setError("Failed to load leave types");
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!formData.employee_id || !formData.leave_type_id || !formData.from_date || !formData.to_date) {
      setError("Please fill in all required fields.");
      return;
    }

    if (daysRequested <= 0) {
      setError("Invalid date range. End date must be after start date.");
      return;
    }

    setSubmitting(true);
    try {
      await axios.post("http://localhost:5000/api/leaves/apply", {
        employee_id: parseInt(formData.employee_id),
        leave_type_id: parseInt(formData.leave_type_id),
        from_date: formData.from_date,
        to_date: formData.to_date,
        reason: formData.reason
      });

      setSuccess("Leave application submitted successfully!");
      setTimeout(() => navigate("/leave-list"), 1500);
    } catch (err) {
      console.error(err);
      if (err.response && err.response.data) {
        setError(err.response.data.message || "Error submitting leave application");
      } else {
        setError("Error submitting leave application. Please check remaining balance.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="layout">

      <Sidebar />
      <div className="content-wrapper">

        <div className="page-header">
          <div>
            <h1 className="page-title">Apply for Leave</h1>
            <p className="page-subtitle">Submit a new leave application</p>
          </div>
        </div>

        {success && <div className="alert alert-success">{success}</div>}
        {error && <div className="alert alert-danger">{error}</div>}

        {loading ? (
          <div className="loading-container">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3 text-muted">Loading data...</p>
          </div>
        ) : (
          <div className="card-standard" style={{ maxWidth: "700px" }}>
            <form onSubmit={handleSubmit}>

              <div className="form-section">
                <h5 className="form-section-title">Leave Details</h5>

                <div className="form-group">
                  <label className="form-label">
                    Employee <span className="required">*</span>
                  </label>
                  <select
                    className="form-select"
                    name="employee_id"
                    value={formData.employee_id}
                    onChange={handleChange}
                    required
                  >
                    <option value="">-- Select Employee --</option>
                    {employees.map((emp) => (
                      <option key={emp.id} value={emp.id}>
                        {emp.name} ({emp.email}) - {emp.department_name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">
                    Leave Type <span className="required">*</span>
                  </label>
                  <select
                    className="form-select"
                    name="leave_type_id"
                    value={formData.leave_type_id}
                    onChange={handleChange}
                    required
                  >
                    <option value="">-- Select Leave Type --</option>
                    {leaveTypes.map((type) => (
                      <option key={type.id} value={type.id}>
                        {type.leave_name} (Max: {type.total_days} days)
                      </option>
                    ))}
                  </select>
                </div>

                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label className="form-label">
                        Start Date <span className="required">*</span>
                      </label>
                      <input
                        type="date"
                        className="form-control"
                        name="from_date"
                        value={formData.from_date}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="form-group">
                      <label className="form-label">
                        End Date <span className="required">*</span>
                      </label>
                      <input
                        type="date"
                        className="form-control"
                        name="to_date"
                        value={formData.to_date}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                </div>

                {daysRequested > 0 && (
                  <div className="alert alert-info">
                    <strong>Days Requested:</strong> {daysRequested} day{daysRequested > 1 ? "s" : ""}
                  </div>
                )}

                <div className="form-group">
                  <label className="form-label">Reason</label>
                  <textarea
                    className="form-control"
                    name="reason"
                    rows="3"
                    placeholder="Provide a reason for the leave application..."
                    value={formData.reason}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="page-actions" style={{ justifyContent: "flex-end" }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => navigate("/leave-list")}
                  disabled={submitting}
                >
                  View Leave List
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => navigate("/dashboard")}
                  disabled={submitting}
                >
                  Dashboard
                </button>
                <button
                  type="submit"
                  className="btn btn-success"
                  disabled={submitting}
                >
                  {submitting ? "Applying..." : "Apply Leave"}
                </button>
              </div>

            </form>
          </div>
        )}

      </div>

    </div>
  );
}

export default LeaveApplication;
