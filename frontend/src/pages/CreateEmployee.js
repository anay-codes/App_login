import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../App.css";

function CreateEmployee() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const [profile, setProfile] = useState(null);
  const [resume, setResume] = useState(null);
  const [document, setDocument] = useState(null);

  const [formData, setFormData] = useState({
    user_id: "",
    department_id: "",
    phone: "",
    address: "",
    designation: "",
    salary: ""
  });

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

    if (!formData.user_id || !formData.department_id) {
      setError("User ID and Department ID are required.");
      return;
    }

    setLoading(true);
    try {
      const uploadData = new FormData();

      if (profile) uploadData.append("profile", profile);
      if (resume) uploadData.append("resume", resume);
      if (document) uploadData.append("document", document);

      const uploadResponse = await axios.post(
        "https://app-login-po50.onrender.com/api/upload",
        uploadData
      );

      await axios.post("https://app-login-po50.onrender.com/api/employees", {
        ...formData,
        profile_image: uploadResponse.data.profile_image,
        resume_file: uploadResponse.data.resume_file,
        document_file: uploadResponse.data.document_file
      });

      setSuccess("Employee created successfully!");
      setTimeout(() => navigate("/employees"), 1500);
    } catch (error) {
      setError(error.response?.data?.message || "Error creating employee");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="layout">

      <div className="sidebar">
        <h3 className="sidebar-title">EMS</h3>

        <div className="sidebar-nav">
          <button className="sidebar-btn" onClick={() => navigate("/dashboard")}>
            Dashboard
          </button>
          <button className="sidebar-btn active" onClick={() => navigate("/create-employee")}>
            Create Employee
          </button>
          <button className="sidebar-btn" onClick={() => navigate("/employees")}>
            Employee List
          </button>
          <button className="sidebar-btn" onClick={() => navigate("/departments")}>
            Departments
          </button>
          <button className="sidebar-btn" onClick={() => navigate("/skills")}>
            Skills
          </button>
          <button className="sidebar-btn" onClick={() => navigate("/leave-application")}>
            Apply Leave
          </button>
          <button className="sidebar-btn" onClick={() => navigate("/leave-list")}>
            Manage Leaves
          </button>
          <button
            className="sidebar-btn logout-btn"
            onClick={() => {
              localStorage.removeItem("token");
              navigate("/login");
            }}
          >
            Logout
          </button>
        </div>
      </div>

      <div className="content-wrapper">

        <div className="page-header">
          <div>
            <h1 className="page-title">Create Employee</h1>
            <p className="page-subtitle">Add a new employee to the system</p>
          </div>
        </div>

        {success && <div className="alert alert-success">{success}</div>}
        {error && <div className="alert alert-danger">{error}</div>}

        <div className="card-standard">
          <form onSubmit={handleSubmit}>

            <div className="form-section">
              <h5 className="form-section-title">Personal Information</h5>

              <div className="row">
                <div className="col-md-6">
                  <div className="form-group">
                    <label className="form-label">
                      User ID <span className="required">*</span>
                    </label>
                    <input
                      className="form-control"
                      name="user_id"
                      placeholder="e.g., EMP001"
                      value={formData.user_id}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group">
                    <label className="form-label">
                      Phone <span className="required">*</span>
                    </label>
                    <input
                      className="form-control"
                      name="phone"
                      type="tel"
                      placeholder="+1 (555) 000-0000"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Address</label>
                <input
                  className="form-control"
                  name="address"
                  placeholder="Enter employee address"
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
                    <label className="form-label">
                      Department ID <span className="required">*</span>
                    </label>
                    <input
                      className="form-control"
                      name="department_id"
                      type="number"
                      placeholder="Department ID"
                      value={formData.department_id}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
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
              </div>

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

            <div className="form-section">
              <h5 className="form-section-title">Documents & Attachments</h5>

              <div className="form-group">
                <label className="form-label">Profile Image</label>
                <input
                  type="file"
                  className="form-control"
                  accept="image/*"
                  onChange={(e) => setProfile(e.target.files[0])}
                />
                {profile && <p className="form-text">✓ {profile.name}</p>}
              </div>

              <div className="form-group">
                <label className="form-label">Resume</label>
                <input
                  type="file"
                  className="form-control"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => setResume(e.target.files[0])}
                />
                {resume && <p className="form-text">✓ {resume.name}</p>}
              </div>

              <div className="form-group">
                <label className="form-label">Document</label>
                <input
                  type="file"
                  className="form-control"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => setDocument(e.target.files[0])}
                />
                {document && <p className="form-text">✓ {document.name}</p>}
              </div>
            </div>

            <div className="page-actions" style={{ justifyContent: "flex-end" }}>
              <button
                className="btn btn-secondary"
                type="button"
                onClick={() => navigate("/employees")}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                className="btn btn-primary"
                type="submit"
                disabled={loading}
              >
                {loading ? "Creating..." : "Create Employee"}
              </button>
            </div>

          </form>
        </div>

      </div>

    </div>
  );
}

export default CreateEmployee;