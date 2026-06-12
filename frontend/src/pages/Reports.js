import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import "../App.css";

export default function Reports() {
  const [reportType, setReportType] = useState("employees");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deptStats, setDeptStats] = useState([]);

  useEffect(() => {
    loadReport();
    if (reportType === "employees") {
      loadDeptStats();
    }
  }, [reportType]);

  const loadReport = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`https://app-login-po50.onrender.com/api/reports/${reportType}?format=json`);
      setData(res.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadDeptStats = async () => {
    try {
      const res = await axios.get("https://app-login-po50.onrender.com/api/reports/department-stats");
      setDeptStats(res.data.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDownloadCSV = () => {
    window.open(`https://app-login-po50.onrender.com/api/reports/${reportType}?format=csv`, '_blank');
  };

  const renderTableHeaders = () => {
    if (data.length === 0) return null;
    return Object.keys(data[0]).map(key => <th key={key}>{key.replace(/_/g, ' ').toUpperCase()}</th>);
  };

  const renderTableRows = () => {
    return data.map((row, index) => (
      <tr key={index}>
        {Object.values(row).map((val, i) => (
          <td key={i}>{val !== null && typeof val === 'object' ? JSON.stringify(val) : String(val)}</td>
        ))}
      </tr>
    ));
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="dashboard-content">
        <div className="page-header">
          <div>
            <h1 className="page-title">Enterprise Reports</h1>
            <p className="page-subtitle">Exportable analytics and system reports</p>
          </div>
          <div className="page-actions">
            <button className="btn btn-success" onClick={handleDownloadCSV} disabled={data.length === 0}>
              Download CSV
            </button>
          </div>
        </div>

        <div style={{ marginBottom: "20px", display: "flex", gap: "10px" }}>
          <button 
            className={`btn ${reportType === "employees" ? "btn-primary" : "btn-secondary"}`}
            onClick={() => setReportType("employees")}
          >
            Employee Report
          </button>
          <button 
            className={`btn ${reportType === "leaves" ? "btn-primary" : "btn-secondary"}`}
            onClick={() => setReportType("leaves")}
          >
            Leave Report
          </button>
          <button 
            className={`btn ${reportType === "assets" ? "btn-primary" : "btn-secondary"}`}
            onClick={() => setReportType("assets")}
          >
            Asset Report
          </button>
        </div>

        {reportType === "employees" && deptStats.length > 0 && (
          <div className="card-standard" style={{ marginBottom: "24px" }}>
            <h5 className="form-section-title">Department Statistics</h5>
            <div className="stats-grid">
              {deptStats.map(dept => (
                <div key={dept.id} className="stat-card stat-secondary" style={{ padding: "16px" }}>
                  <h5>{dept.department_name}</h5>
                  <h2>{dept.employee_count} <small style={{fontSize: "14px", color: "#6b7280"}}>Employees</small></h2>
                  <p style={{margin: 0, fontSize: "12px", color: "#6b7280"}}>{dept.active_allocations} Active Assets</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {loading ? (
          <div className="loading-container">
            <div className="spinner-border text-primary" role="status"></div>
          </div>
        ) : (
          <div className="card-standard">
            <div className="table-wrapper">
              <table className="table-standard" style={{ fontSize: "12px" }}>
                <thead>
                  <tr>{renderTableHeaders()}</tr>
                </thead>
                <tbody>
                  {renderTableRows()}
                  {data.length === 0 && (
                    <tr>
                      <td colSpan="10" className="text-center py-4 text-muted">No data available for this report.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
