import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import "../App.css";

function EditEmployee() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    phone: "",
    address: "",
    designation: "",
    salary: ""
  });

  useEffect(() => {
    loadEmployee();
  }, [id]);

  const loadEmployee = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `http://localhost:5000/api/employees/${id}`
      );

      setFormData({
        phone: res.data.phone || "",
        address: res.data.address || "",
        designation: res.data.designation || "",
        salary: res.data.salary || ""
      });
      setError("");
    } catch (error) {
      setError("Failed to load employee data");
      console.log(error);
    } finally {
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
    setSubmitting(true);

    try {
      await axios.put(
        `http://localhost:5000/api/employees/${id}`,
        formData
      );

      setSuccess("Employee updated successfully!");
      setTimeout(() => navigate("/employees"), 1500);
    } catch (error) {
      setError(error.response?.data?.message || "Error updating employee");
      console.log(error);
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
            <h1 className="page-title">Edit Employee</h1>
            <p className="page-subtitle">Update employee information</p>
          </div>
        </div>

        {success && <div className="alert alert-success">{success}</div>}
        {error && <div className="alert alert-danger">{error}</div>}

        {loading ? (
          <div className="loading-container">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3 text-muted">Loading employee data...</p>
          </div>
        ) : (
          <div className="card-standard">
            <form onSubmit={handleSubmit}>

              <div className="form-section">
                <h5 className="form-section-title">Contact Information</h5>

                <div className="form-group">
                  <label className="form-label">Phone</label>
                  <input
                    className="form-control"
                    name="phone"
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Address</label>
                  <input
                    className="form-control"
                    name="address"
                    placeholder="Enter address"
                    value={formData.address}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="form-section">
                <h5 className="form-section-title">Professional Information</h5>

                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label className="form-label">Designation</label>
                      <input
                        className="form-control"
                        name="designation"
                        placeholder="e.g., Senior Developer"
                        value={formData.designation}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label className="form-label">Salary</label>
                      <input
                        className="form-control"
                        name="salary"
                        type="number"
                        placeholder="Annual salary"
                        value={formData.salary}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="page-actions" style={{ justifyContent: "flex-end" }}>
                <button
                  className="btn btn-secondary"
                  type="button"
                  onClick={() => navigate("/employees")}
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-warning"
                  type="submit"
                  disabled={submitting}
                >
                  {submitting ? "Updating..." : "Update Employee"}
                </button>
              </div>

            </form>
          </div>
        )}

      </div>

    </div>
  );
}

export default EditEmployee;