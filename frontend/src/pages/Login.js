import { useState } from "react";
import api from "../api";
import { Link, useLocation, useNavigate } from "react-router-dom";
import ThemeToggle from "../components/ThemeToggle";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!form.email.trim() || !form.password) return setError("Enter your email and password.");
    setLoading(true);
    setError("");
    try {
      const { data } = await api.post("/api/auth/login", form);
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);
      localStorage.setItem("profile", JSON.stringify(data.profile || {}));
      const requested = location.state?.from?.pathname;
      navigate(requested || (data.role === "Admin" ? "/dashboard" : "/employee-dashboard"), { replace: true });
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Login failed. Check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-brand-panel">
        <Link className="brand" to="/">Workforce EMS</Link>
        <div><span className="eyebrow">Secure employee operations</span><h1>Welcome back to your workforce workspace.</h1><p>Access attendance, leave, tasks, assets, reports, and employee operations from one reliable system.</p></div>
      </div>
      <main className="auth-form-panel">
        <div className="auth-toolbar"><ThemeToggle /></div>
        <div className="auth-card">
          <span className="eyebrow">Account access</span>
          <h2>Sign in</h2>
          <p className="page-subtitle">Use your registered work account.</p>
          {error && <div className="alert alert-danger">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-group"><label className="form-label" htmlFor="email">Email address</label><input id="email" type="email" className="form-control" autoComplete="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} disabled={loading} /></div>
            <div className="form-group"><label className="form-label" htmlFor="password">Password</label><input id="password" type={showPassword ? "text" : "password"} className="form-control" autoComplete="current-password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} disabled={loading} /></div>
            <label className="form-check-label auth-check"><input type="checkbox" className="form-check-input" checked={showPassword} onChange={() => setShowPassword((value) => !value)} /> Show password</label>
            <button type="submit" className="btn btn-primary w-100" disabled={loading}>{loading ? "Signing in..." : "Sign in"}</button>
          </form>
          <div className="auth-links"><Link to="/forgot-password">Forgot password?</Link><span>New employee? <Link to="/signup">Create an account</Link></span></div>
        </div>
      </main>
    </div>
  );
}
