import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../App.css";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    if (!email) {
      setError("Please enter your email address");
      setLoading(false);
      return;
    }

    setTimeout(() => {
      setSuccess(`Password reset link sent to ${email}. Check your inbox.`);
      setTimeout(() => navigate("/login"), 2000);
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="container">
      <div className="row vh-100 justify-content-center align-items-center">
        <div className="col-md-5 col-sm-8">
          <div className="card-standard">

            <h2 className="text-center mb-4" style={{ fontSize: "24px", fontWeight: "700" }}>
              Forgot Password
            </h2>

            <p className="text-center text-muted" style={{ marginBottom: "20px" }}>
              Enter your email address and we'll send you a reset link.
            </p>

            {error && <div className="alert alert-danger">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}

            <form onSubmit={handleSubmit}>

              <div className="form-group">
                <label className="form-label">Email <span className="required">*</span></label>
                <input
                  type="email"
                  className="form-control"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError("");
                  }}
                  required
                  disabled={loading}
                />
              </div>

              <button
                type="submit"
                className="btn btn-warning w-100"
                disabled={loading}
              >
                {loading ? "Sending..." : "Send Reset Link"}
              </button>

            </form>

            <hr style={{ margin: "20px 0" }} />

            <div className="text-center" style={{ fontSize: "14px" }}>
              <Link to="/login" style={{ color: "#2563eb", textDecoration: "none" }}>
                Back to Login
              </Link>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;