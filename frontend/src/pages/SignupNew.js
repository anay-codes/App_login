import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import ThemeToggle from "../components/ThemeToggle";

export default function Signup() {
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    if (!form.name.trim() || !form.email.trim() || !form.password) return setError("Complete all required fields.");
    if (form.password.length < 8) return setError("Password must contain at least 8 characters.");
    if (form.password !== form.confirmPassword) return setError("Passwords do not match.");
    setLoading(true);
    try {
      await axios.post("/api/auth/signup", { name: form.name.trim(), email: form.email.trim(), password: form.password });
      setSuccess("Account created. Redirecting to sign in...");
      setTimeout(() => navigate("/login"), 900);
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-brand-panel">
        <Link className="brand" to="/">Workforce EMS</Link>
        <div><span className="eyebrow">Employee registration</span><h1>Join your organization’s employee workspace.</h1><p>Create your account to manage attendance, leave requests, assigned tasks, assets, and notifications.</p></div>
      </div>
      <main className="auth-form-panel">
        <div className="auth-toolbar"><ThemeToggle /></div>
        <div className="auth-card">
          <span className="eyebrow">New account</span><h2>Create employee account</h2><p className="page-subtitle">Your HR team can complete employment details later.</p>
          {error && <div className="alert alert-danger">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-group"><label className="form-label">Full name</label><input className="form-control" autoComplete="name" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} /></div>
            <div className="form-group"><label className="form-label">Email address</label><input type="email" className="form-control" autoComplete="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} /></div>
            <div className="form-group"><label className="form-label">Password</label><input type="password" className="form-control" autoComplete="new-password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} /></div>
            <div className="form-group"><label className="form-label">Confirm password</label><input type="password" className="form-control" autoComplete="new-password" value={form.confirmPassword} onChange={(event) => setForm({ ...form, confirmPassword: event.target.value })} /></div>
            <button className="btn btn-primary w-100" disabled={loading}>{loading ? "Creating account..." : "Create account"}</button>
          </form>
          <div className="auth-links"><span>Already registered? <Link to="/login">Sign in</Link></span></div>
        </div>
      </main>
    </div>
  );
}
