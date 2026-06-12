import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import "../App.css";

export default function AuditLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({ entity_type: "", action: "" });

  useEffect(() => {
    loadLogs();
  }, [filters]);

  const loadLogs = async () => {
    setLoading(true);
    try {
      let url = "https://app-login-po50.onrender.com/api/audit?";
      if (filters.entity_type) url += `entity_type=${filters.entity_type}&`;
      if (filters.action) url += `action=${filters.action}&`;
      
      const res = await axios.get(url);
      setLogs(res.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="dashboard-content">
        <div className="page-header">
          <div>
            <h1 className="page-title">Audit Logs</h1>
            <p className="page-subtitle">Track system changes and user activity</p>
          </div>
        </div>

        <div className="card-standard" style={{ marginBottom: "20px" }}>
          <div style={{ display: "flex", gap: "16px" }}>
            <div className="form-group" style={{ margin: 0, flex: 1 }}>
              <label className="form-label">Entity Type</label>
              <select className="form-select" name="entity_type" value={filters.entity_type} onChange={handleFilterChange}>
                <option value="">All Entities</option>
                <option value="Asset">Asset</option>
                <option value="AssetAllocation">AssetAllocation</option>
                <option value="Leave">Leave</option>
                <option value="Employee">Employee</option>
              </select>
            </div>
            <div className="form-group" style={{ margin: 0, flex: 1 }}>
              <label className="form-label">Action</label>
              <select className="form-select" name="action" value={filters.action} onChange={handleFilterChange}>
                <option value="">All Actions</option>
                <option value="CREATE">Create</option>
                <option value="UPDATE">Update</option>
                <option value="DELETE">Delete</option>
              </select>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="loading-container">
            <div className="spinner-border text-primary" role="status"></div>
          </div>
        ) : (
          <div className="card-standard">
            <div className="table-wrapper">
              <table className="table-standard">
                <thead>
                  <tr>
                    <th>Timestamp</th>
                    <th>User ID</th>
                    <th>Entity</th>
                    <th>Action</th>
                    <th>IP Address</th>
                    <th>Changes Data</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map(log => (
                    <tr key={log.id}>
                      <td>{new Date(log.performed_at).toLocaleString()}</td>
                      <td>{log.user_id || 'System'}</td>
                      <td><strong>{log.entity_type}</strong> <small className="text-muted">(ID: {log.entity_id})</small></td>
                      <td>
                        <span className={`badge ${log.action === 'CREATE' ? 'bg-success' : log.action === 'DELETE' ? 'bg-danger' : 'bg-primary'}`}>
                          {log.action}
                        </span>
                      </td>
                      <td>{log.ip_address}</td>
                      <td>
                        <div style={{ maxHeight: "100px", overflowY: "auto", fontSize: "11px", background: "#f8f9fa", padding: "8px", borderRadius: "4px" }}>
                          <pre style={{ margin: 0 }}>{JSON.stringify(log.changes || log.new_values, null, 2)}</pre>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {logs.length === 0 && (
                    <tr>
                      <td colSpan="6" className="text-center py-4 text-muted">No audit logs found.</td>
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
