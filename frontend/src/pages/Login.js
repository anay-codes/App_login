import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "../App.css";

function Login() {
  const [form, setForm] = useState({
    email: "",
    password: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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

    if (!form.email || !form.password) {
      setError("Please enter both email and password");
      setLoading(false);
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        form
      );

      localStorage.setItem("token", res.data.token);
      // Save role/profile if provided
      if (res.data.role) localStorage.setItem("role", res.data.role);
      if (res.data.profile) localStorage.setItem("profile", JSON.stringify(res.data.profile));

      if (res.data.role === 'Admin') {
        navigate('/dashboard');
      } else {
        navigate('/employee-dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please check your credentials.");
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
              Welcome Back
            </h2>

            {error && <div className="alert alert-danger">{error}</div>}

            <form onSubmit={handleSubmit}>

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

              <div className="form-group">
                <label className="form-label">Password <span className="required">*</span></label>
                <input
                  type="password"
                  name="password"
                  placeholder="Enter your password"
                  className="form-control"
                  value={form.password}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary w-100"
                disabled={loading}
              >
                {loading ? "Logging in..." : "Login"}
              </button>

            </form>

            <hr style={{ margin: "20px 0" }} />

            <div className="text-center mb-2">
              <Link to="/forgot-password" style={{ color: "#2563eb", textDecoration: "none", fontSize: "14px" }}>
                Forgot Password?
              </Link>
            </div>

            <div className="text-center" style={{ fontSize: "14px" }}>
              Don't have an account?{" "}
              <Link to="/signup" style={{ color: "#2563eb", fontWeight: "600", textDecoration: "none" }}>
                Register
              </Link>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;