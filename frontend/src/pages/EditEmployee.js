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
  const [departments, setDepartments] = useState([]);

  const [profile, setProfile] = useState(null);
  const [resume, setResume] = useState(null);
  const [document, setDocument] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    department_id: "",
    phone: "",
    address: "",
    designation: "",
    salary: ""
  });

 useEffect(() => {
    loadDepartments();
    loadEmployee();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function loadDepartments() {
    try {
      const res = await axios.get("https://app-login-po50.onrender.com/api/departments");
      setDepartments(res.data);
    } catch (error) {
      console.log(error);
    }
  }

  const loadEmployee = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`https://app-login-po50.onrender.com/api/employees/${id}`);
      const d = res.data;
      setFormData({
        name: d.name || "",
        email: d.email || "",
        department_id: d.department_id || "",
        phone: d.phone || "",
        address: d.address || "",
        designation: d.designation || "",
        salary: d.salary || ""
      });
    } catch (error) {
      setError("Failed to load employee data");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSubmitting(true);

    try {
      // Handle file uploads if any new files selected
      let profile_image = undefined;
      let resume_file = undefined;
      let document_file = undefined;

      if (profile || resume || document) {
        const uploadData = new FormData();
        if (profile) uploadData.append("profile", profile);
        if (resume) uploadData.append("resume", resume);
        if (document) uploadData.append("document", document);

        const uploadRes = await axios.post("https://app-login-po50.onrender.com/api/upload", uploadData);
        profile_image = uploadRes.data.profile_image;
        resume_file = uploadRes.data.resume_file;
        document_file = uploadRes.data.document_file;
      }

      await axios.put(`https://app-login-po50.onrender.com/api/employees/${id}`, {
        ...formData,
        ...(profile_image && { profile_image }),
        ...(resume_file && { resume_file }),
        ...(document_file && { document_file })
      });

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
                <h5 className="form-section-title">Personal Information</h5>

                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label className="form-label">Full Name *</label>
                      <input
                        className="form-control"
                        name="name"
                        placeholder="Full Name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label className="form-label">Email *</label>
                      <input
                        className="form-control"
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label className="form-label">Phone</label>
                      <input
                        className="form-control"
                        name="phone"
                        placeholder="Phone"
                        value={formData.phone}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label className="form-label">Address</label>
                      <input
                        className="form-control"
                        name="address"
                        placeholder="Address"
                        value={formData.address}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="form-section">
                <h5 className="form-section-title">Professional Information</h5>

                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label className="form-label">Department</label>
                      <select
                        className="form-control"
                        name="department_id"
                        value={formData.department_id}
                        onChange={handleChange}
                      >
                        <option value="">Select Department</option>
                        {departments.map((dept) => (
                          <option key={dept.id} value={dept.id}>
                            {dept.department_name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label className="form-label">Designation</label>
                      <input
                        className="form-control"
                        name="designation"
                        placeholder="e.g. Senior Developer"
                        value={formData.designation}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Salary</label>
                  <input
                    className="form-control"
                    type="number"
                    name="salary"
                    placeholder="Salary"
                    value={formData.salary}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="form-section">
                <h5 className="form-section-title">Documents & Attachments</h5>
                <p className="text-muted" style={{ fontSize: "13px" }}>Leave blank to keep existing files.</p>

                <div className="form-group">
                  <label className="form-label">Profile Image</label>
                  <input
                    type="file"
                    className="form-control"
                    accept="image/*"
                    onChange={(e) => setProfile(e.target.files[0])}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Resume</label>
                  <input
                    type="file"
                    className="form-control"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => setResume(e.target.files[0])}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Document</label>
                  <input
                    type="file"
                    className="form-control"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => setDocument(e.target.files[0])}
                  />
                </div>
              </div>

              <div className="page-actions" style={{ justifyContent: "flex-end" }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => navigate("/employees")}
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-warning"
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