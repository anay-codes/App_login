import React from "react";
import { Link } from "react-router-dom";
import ThemeToggle from "../components/ThemeToggle";

export default function Home() {
  return (
    <div className="public-page">
      <header className="public-nav">
        <Link className="brand" to="/">Workforce EMS</Link>
        <nav>
          <ThemeToggle />
          <Link className="btn btn-secondary" to="/login">Sign in</Link>
          <Link className="btn btn-primary" to="/signup">Create account</Link>
        </nav>
      </header>
      <main>
        <section className="hero-section">
          <div>
            <span className="eyebrow">Employee management, simplified</span>
            <h1>One reliable workspace for your people operations.</h1>
            <p>Manage employees, attendance, leave, tasks, assets, reports, and company communication from a single professional system.</p>
            <div className="hero-actions">
              <Link className="btn btn-primary" to="/login">Open workspace</Link>
              <Link className="btn btn-secondary" to="/signup">Register employee</Link>
            </div>
          </div>
          <div className="product-preview">
            <div className="preview-header"><span>Workforce overview</span><span className="status-pill success">Live</span></div>
            <div className="preview-metrics">
              <div><small>People</small><strong>Centralized</strong></div>
              <div><small>Attendance</small><strong>Daily</strong></div>
              <div><small>Reports</small><strong>Actionable</strong></div>
              <div><small>Access</small><strong>Role based</strong></div>
            </div>
          </div>
        </section>
        <section className="public-section">
          <div className="section-heading"><span className="eyebrow">Core capabilities</span><h2>Everything HR teams need to stay organized.</h2></div>
          <div className="feature-grid">
            <article><h3>People operations</h3><p>Maintain employee, department, and skills records with a consistent workflow.</p></article>
            <article><h3>Daily workforce</h3><p>Track attendance, leave, tasks, assets, and notifications without switching tools.</p></article>
            <article><h3>Operational visibility</h3><p>Use dashboards, reports, and audit logs to understand activity and make decisions.</p></article>
          </div>
        </section>
        <section className="cta-section">
          <div><span className="eyebrow">Ready for work</span><h2>Bring your employee operations into one workspace.</h2></div>
          <Link className="btn btn-primary" to="/login">Sign in to EMS</Link>
        </section>
      </main>
    </div>
  );
}
