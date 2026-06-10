import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "../App.css";

function Signup() {
const [form, setForm] = useState({
name: "",
email: "",
password: "",
confirmPassword: ""
});

const [showPassword, setShowPassword] = useState(false);
const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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
  setError("Please fill all required fields");
  setLoading(false);
  return;
}

if (form.password.length < 6) {
  setError("Password must be at least 6 characters");
  setLoading(false);
  return;
}

if (form.password !== form.confirmPassword) {
  setError("Passwords do not match");
  setLoading(false);
  return;
}

try {
  await axios.post(
    "http://localhost:5000/api/auth/signup",
    {
      name: form.name,
      email: form.email,
      password: form.password
    }
  );

  setSuccess(
    "Account created successfully! Redirecting to login..."
  );

  setTimeout(() => {
    navigate("/login");
  }, 1500);

} catch (err) {
  setError(
    err.response?.data?.message ||
    "Registration failed"
  );
} finally {
  setLoading(false);
}


};

return ( <div className="container"> <div className="row vh-100 justify-content-center align-items-center"> <div className="col-md-6 col-sm-10">


      <div className="card-standard">

        <h2
          className="text-center mb-4"
          style={{
            fontSize: "28px",
            fontWeight: "700"
          }}
        >
          Create Employee Account
        </h2>

        {error && (
          <div className="alert alert-danger">
            {error}
          </div>
        )}

        {success && (
          <div className="alert alert-success">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit}>

          <div className="form-group">
            <label className="form-label">
              Full Name
            </label>

            <input
              type="text"
              name="name"
              className="form-control"
              placeholder="Enter your full name"
              value={form.name}
              onChange={handleChange}
              disabled={loading}
            />
          </div>

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
              placeholder="Enter password"
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
                style={{ marginLeft: "8px" }}
              >
                Show Password
              </label>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">
              Confirm Password
            </label>

            <input
              type={
                showConfirmPassword
                  ? "text"
                  : "password"
              }
              name="confirmPassword"
              className="form-control"
              placeholder="Confirm password"
              value={form.confirmPassword}
              onChange={handleChange}
              disabled={loading}
            />

            <div className="mt-2">
              <input
                type="checkbox"
                id="showConfirmPassword"
                checked={showConfirmPassword}
                onChange={() =>
                  setShowConfirmPassword(
                    !showConfirmPassword
                  )
                }
              />

              <label
                htmlFor="showConfirmPassword"
                style={{ marginLeft: "8px" }}
              >
                Show Confirm Password
              </label>
            </div>
          </div>

          <button
            className="btn btn-success w-100"
            type="submit"
            disabled={loading}
          >
            {loading
              ? "Creating Account..."
              : "Register"}
          </button>

        </form>

        <hr style={{ margin: "20px 0" }} />

        <Link
          to="/login"
          className="btn btn-primary w-100"
        >
          Back To Login
        </Link>

      </div>

    </div>
  </div>
</div>


);
}

export default Signup;
