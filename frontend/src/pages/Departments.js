import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../App.css";

function Departments() {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadDepartments();
  }, []);

  const loadDepartments = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        "http://localhost:5000/api/departments"
      );
      setDepartments(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="layout">

      <div className="sidebar">
        <h3 className="sidebar-title">EMS</h3>

        <div className="sidebar-nav">
          <button className="sidebar-btn" onClick={() => navigate("/dashboard")}>
            Dashboard
          </button>
          <button className="sidebar-btn" onClick={() => navigate("/create-employee")}>
            Create Employee
          </button>
          <button className="sidebar-btn" onClick={() => navigate("/employees")}>
            Employee List
          </button>
          <button className="sidebar-btn active" onClick={() => navigate("/departments")}>
            Departments
          </button>
          <button className="sidebar-btn" onClick={() => navigate("/skills")}>
            Skills
          </button>
          <button className="sidebar-btn" onClick={() => navigate("/leave-application")}>
            Apply Leave
          </button>
          <button className="sidebar-btn" onClick={() => navigate("/leave-list")}>
            Manage Leaves
          </button>
          <button
            className="sidebar-btn logout-btn"
            onClick={() => {
              localStorage.removeItem("token");
              navigate("/login");
            }}
          >
            Logout
          </button>
        </div>
      </div>

      <div className="content-wrapper">

        <div className="page-header">
          <div>
            <h1 className="page-title">Departments</h1>
            <p className="page-subtitle">View all departments in the organization</p>
          </div>
        </div>

        {!loading && (
          <div className="stats-grid" style={{ marginBottom: "30px", maxWidth: "300px" }}>
            <div className="stat-card">
              <h5>Total Departments</h5>
              <h2>{departments.length}</h2>
            </div>
          </div>
        )}

        {loading ? (
          <div className="loading-container">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3 text-muted">Loading departments...</p>
          </div>
        ) : departments.length === 0 ? (
          <div className="card-standard">
            <div className="empty-state">
              <div className="empty-state-title">No Departments Found</div>
              <div className="empty-state-description">
                There are no departments in the system.
              </div>
            </div>
          </div>
        ) : (
          <div className="card-standard">
            <div className="table-wrapper">
              <table className="table-standard">
                <thead>
                  <tr>
                    <th>Department ID</th>
                    <th>Department Name</th>
                  </tr>
                </thead>

                <tbody>
                  {departments.map((dept) => (
                    <tr key={dept.id}>
                      <td><strong>#{dept.id}</strong></td>
                      <td>{dept.department_name}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>

    </div>
  );
}

export default Departments;