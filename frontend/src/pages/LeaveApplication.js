import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function LeaveApplication() {
  const navigate = useNavigate();

  const [employees, setEmployees] = useState([]);
  const [leaveTypes, setLeaveTypes] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

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

  const loadEmployees = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/employees");
      setEmployees(res.data);
    } catch (err) {
      console.error("Error loading employees", err);
    }
  };

  const loadLeaveTypes = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/leaves/leave-types");
      setLeaveTypes(res.data);
    } catch (err) {
      console.error("Error loading leave types", err);
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

    try {
      await axios.post("http://localhost:5000/api/leaves/apply", {
        employee_id: parseInt(formData.employee_id),
        leave_type_id: parseInt(formData.leave_type_id),
        from_date: formData.from_date,
        to_date: formData.to_date,
        reason: formData.reason
      });

      setSuccess("Leave applied successfully!");
      alert("Leave Application Submitted Successfully");
      navigate("/leave-list");
    } catch (err) {
      console.error(err);
      if (err.response && err.response.data) {
        setError(err.response.data);
      } else {
        setError("Error submitting leave application. Please check remaining balance.");
      }
    }
  };

  return (
    <div className="container mt-5">
      <div className="card shadow p-4" style={{ maxWidth: "600px", margin: "0 auto" }}>
        <h2 className="mb-4 text-center">Apply for Leave</h2>

        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Employee <span className="text-danger">*</span></label>
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

          <div className="mb-3">
            <label className="form-label">Leave Type <span className="text-danger">*</span></label>
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
            <div className="col-md-6 mb-3">
              <label className="form-label">Start Date <span className="text-danger">*</span></label>
              <input
                type="date"
                className="form-control"
                name="from_date"
                value={formData.from_date}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label">End Date <span className="text-danger">*</span></label>
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

          <div className="mb-3">
            <label className="form-label">Reason</label>
            <textarea
              className="form-control"
              name="reason"
              rows="3"
              placeholder="Provide a reason for the leave application..."
              value={formData.reason}
              onChange={handleChange}
            ></textarea>
          </div>

          <div className="d-flex justify-content-between mt-4">
            <button type="submit" className="btn btn-success px-4">
              Apply Leave
            </button>
            <div>
              <button
                type="button"
                className="btn btn-secondary me-2"
                onClick={() => navigate("/leave-list")}
              >
                Leave List
              </button>
              <button
                type="button"
                className="btn btn-dark"
                onClick={() => navigate("/dashboard")}
              >
                Dashboard
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LeaveApplication;
