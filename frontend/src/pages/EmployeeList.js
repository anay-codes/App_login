import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import "../App.css";

function EmployeeList() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const deleteEmployee = async (id) => {
    try {
      await axios.delete(
        `https://app-login-po50.onrender.com/api/employees/${id}`
      );
      loadEmployees();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        "https://app-login-po50.onrender.com/api/employees"
      );
      setEmployees(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="layout">

      <Sidebar />
      <div className="content-wrapper">

        <div className="page-header">
          <div>
            <h1 className="page-title">Employee List</h1>
            <p className="page-subtitle">Manage and view all employees</p>
          </div>
          <div className="page-actions">
            <button
              className="btn btn-primary"
              onClick={() => navigate("/create-employee")}
            >
              + Create Employee
            </button>
          </div>
        </div>

        {loading ? (
          <div className="loading-container">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3 text-muted">Loading employees...</p>
          </div>
        ) : employees.length === 0 ? (
          <div className="card-standard">
            <div className="empty-state">
              <div className="empty-state-title">No Employees Found</div>
              <div className="empty-state-description">
                There are no employees in the system yet. Create one to get started.
              </div>
              <div className="empty-state-action">
                <button
                  className="btn btn-primary"
                  onClick={() => navigate("/create-employee")}
                >
                  Create First Employee
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="card-standard">
            <div className="table-wrapper">
              <table className="table-standard">
                <thead>
                  <tr>
                    <th>Profile</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Department</th>
                    <th>Phone</th>
                    <th>Designation</th>
                    <th>Salary</th>
                    <th>Resume</th>
                    <th>Document</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {employees.map((emp) => (
                    <tr key={emp.id}>
                      <td>
                        {emp.profile_image ? (
                          <img
                            src={`https://app-login-po50.onrender.com/uploads/${emp.profile_image}`}
                            alt="profile"
                            className="table-image"
                          />
                        ) : (
                          <span className="text-muted">No Image</span>
                        )}
                      </td>

                      <td>{emp.name}</td>
                      <td>{emp.email}</td>
                      <td>{emp.department_name}</td>
                      <td>{emp.phone}</td>
                      <td>{emp.designation}</td>
                      <td>{emp.salary}</td>

                      <td>
                        {emp.resume_file ? (
                          <a
                            href={`https://app-login-po50.onrender.com/uploads/${emp.resume_file}`}
                            target="_blank"
                            rel="noreferrer"
                            className="btn btn-primary btn-sm"
                          >
                            Resume
                          </a>
                        ) : (
                          <span className="text-muted">N/A</span>
                        )}
                      </td>

                      <td>
                        {emp.document_file ? (
                          <a
                            href={`https://app-login-po50.onrender.com/uploads/${emp.document_file}`}
                            target="_blank"
                            rel="noreferrer"
                            className="btn btn-secondary btn-sm"
                          >
                            Document
                          </a>
                        ) : (
                          <span className="text-muted">N/A</span>
                        )}
                      </td>

                      <td>
                        <div className="table-action-buttons">
                          <button
                            className="btn btn-warning btn-sm"
                            onClick={() =>
                              navigate(`/edit-employee/${emp.id}`)
                            }
                          >
                            Edit
                          </button>

                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => deleteEmployee(emp.id)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
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

export default EmployeeList;