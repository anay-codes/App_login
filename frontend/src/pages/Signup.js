import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "../App.css";

function Signup() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

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
      setError("Please fill in all fields");
      setLoading(false);
      return;
    }

    if (form.password.length < 6) {
      setError("Password must be at least 6 characters");
      setLoading(false);
      return;
    }

    try {
      const res = await axios.post(
        "/api/auth/signup",
        form
      );

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
        <div className="col-md-5 col-sm-8">
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
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Password <span className="required">*</span></label>
                <input
                  type="password"
                  name="password"
                  placeholder="Enter password (min 6 characters)"
                  className="form-control"
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
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