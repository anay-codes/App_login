import { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "../App.css";

function Signup() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    address: "",
    designation: "",
    department_id: ""
  });
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/departments");
        setDepartments(res.data);
      } catch (e) {
        // ignore
      }
    };
    fetchDepartments();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    if (!form.name || !form.email || !form.password) {
      setError("Please fill in name, email and password");
      setLoading(false);
      return;
    }

    if (form.password.length < 6) {
      setError("Password must be at least 6 characters");
      setLoading(false);
      return;
    }

    if (!form.department_id) {
      setError("Please select a department");
      setLoading(false);
      return;
    }

    try {
      const payload = {
        name: form.name,
        email: form.email,
        password: form.password,
        phone: form.phone || null,
        address: form.address || null,
        designation: form.designation || null,
        department_id: form.department_id || null
      };

      await axios.post("http://localhost:5000/api/auth/signup", payload);

      setSuccess("Account created successfully! Redirecting to login...");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="row vh-100 justify-content-center align-items-center">
        <div className="col-md-6 col-sm-10">
          <div className="card-standard">

            <h2 className="text-center mb-4" style={{ fontSize: "24px", fontWeight: "700" }}>
              Create Account
            </h2>

            {error && <div className="alert alert-danger">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}

            <form onSubmit={handleSubmit}>

              <div className="form-group">
                <label className="form-label">Full Name <span className="required">*</span></label>
                <input
                  type="text"
                  name="name"
                  placeholder="Enter your full name"
                  className="form-control"
                  value={form.name}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Email <span className="required">*</span></label>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  className="form-control"
                  value={form.email}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
              </div>

              <div className="form-row">
                <div className="form-group col-md-6">
                  <label className="form-label">Password <span className="required">*</span></label>
                  <input
                    type="password"
                    name="password"
                    placeholder="Enter password (min 6 characters)"
                    className="form-control"
                    value={form.password}
                    onChange={handleChange}
                    required
                    disabled={loading}
                  />
                </div>
                <div className="form-group col-md-6">
                  <label className="form-label">Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Enter phone"
                    className="form-control"
                    value={form.phone}
                    onChange={handleChange}
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Address</label>
                <input
                  className="form-control"
                  name="address"
                  placeholder="Enter your address"
                  value={form.address}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>

              <div className="form-row">
                <div className="form-group col-md-6">
                  <label className="form-label">Designation</label>
                  <input
                    className="form-control"
                    name="designation"
                    placeholder="e.g., Senior Developer"
                    value={form.designation}
                    onChange={handleChange}
                    disabled={loading}
                  />
                </div>
                <div className="form-group col-md-6">
                  <label className="form-label">Department <span className="required">*</span></label>
                  <select name="department_id" className="form-control" value={form.department_id} onChange={handleChange} disabled={loading}>
                    <option value="">Select Department</option>
                    {departments.map(d => (
                      <option key={d.id} value={d.id}>{d.department_name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <button
                className="btn btn-success w-100"
                type="submit"
                disabled={loading}
              >
                {loading ? "Creating Account..." : "Register"}
              </button>

            </form>

            <hr style={{ margin: "20px 0" }} />

            <div className="text-center" style={{ fontSize: "14px" }}>
              Already have an account?{" "}
              <Link to="/login" style={{ color: "#2563eb", fontWeight: "600", textDecoration: "none" }}>
                Login
              </Link>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;
