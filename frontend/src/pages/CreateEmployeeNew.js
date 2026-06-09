import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
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
    // user_id removed; admin can provide name/email/password to create associated user
    name: "",
    email: "",
    password: "",
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

    // require name,email,password so backend can create user
    if (!formData.name || !formData.email || !formData.password || !formData.department_id) {
      setError("Name, email, password and department are required.");
      return;
    }

    setLoading(true);
    try {
      const uploadData = new FormData();

      if (profile) uploadData.append("profile", profile);
      if (resume) uploadData.append("resume", resume);
      if (document) uploadData.append("document", document);

      const uploadResponse = await axios.post(
        "http://localhost:5000/api/upload",
        uploadData
      );

      await axios.post("http://localhost:5000/api/employees", {
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

      <Sidebar />
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
                      Full Name <span className="required">*</span>
                    </label>
                    <input
                      className="form-control"
                      name="name"
                      placeholder="Full name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group">
                    <label className="form-label">
                      Email <span className="required">*</span>
                    </label>
                    <input
                      className="form-control"
                      name="email"
                      type="email"
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
                    <label className="form-label">Password <span className="required">*</span></label>
                    <input
                      className="form-control"
                      name="password"
                      type="password"
                      placeholder="Password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group">
                    <label className="form-label">Phone</label>
                    <input
                      className="form-control"
                      name="phone"
                      type="tel"
                      placeholder="Phone"
                      value={formData.phone}
                      onChange={handleChange}
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
