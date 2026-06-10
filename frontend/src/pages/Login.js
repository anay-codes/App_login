import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "../App.css";

function Login() {
const [form, setForm] = useState({
email: "",
password: ""
});

const [showPassword, setShowPassword] = useState(false);
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
setError ("");


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

  if (res.data.role) {
    localStorage.setItem("role", res.data.role);
  }

  if (res.data.profile) {
    localStorage.setItem(
      "profile",
      JSON.stringify(res.data.profile)
    );
  }

  if (res.data.role === "Admin") {
    navigate("/dashboard");
  } else {
    navigate("/employee-dashboard");
  }

} catch (err) {
  setError(
    err.response?.data?.message ||
    "Login failed. Please check your credentials."
  );
} finally {
  setLoading(false);
}


};

return ( <div className="container"> <div className="row vh-100 justify-content-center align-items-center"> <div className="col-md-5 col-sm-10">


      <div className="card-standard">

        <h2
          className="text-center mb-4"
          style={{
            fontSize: "28px",
            fontWeight: "700"
          }}
        >
          Welcome Back
        </h2>

        {error && (
          <div className="alert alert-danger">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>

          <div className="form-group">
            <label className="form-label">
              Email
            </label>

            <input
              type="email"
              name="email"
              className="form-control"
              placeholder="Enter your email"
              value={form.email}
              onChange={handleChange}
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              Password
            </label>

            <input
              type={showPassword ? "text" : "password"}
              name="password"
              className="form-control"
              placeholder="Enter your password"
              value={form.password}
              onChange={handleChange}
              disabled={loading}
            />

            <div className="mt-2">
              <input
                type="checkbox"
                id="showPassword"
                checked={showPassword}
                onChange={() =>
                  setShowPassword(!showPassword)
                }
              />

              <label
                htmlFor="showPassword"
                style={{
                  marginLeft: "8px",
                  fontSize: "14px"
                }}
              >
                Show Password
              </label>
            </div>
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

        <div className="text-center mb-3">
          <Link
            to="/forgot-password"
            style={{
              color: "#2563eb",
              textDecoration: "none"
            }}
          >
            Forgot Password?
          </Link>
        </div>

        <Link
          to="/signup"
          className="btn btn-success w-100"
        >
          Register as Employee
        </Link>

      </div>

    </div>
  </div>
</div>


);
}

export default Login;
