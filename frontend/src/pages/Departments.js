import { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import "../App.css";

function Departments() {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // For add modal
  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState("");

  // For edit modal
  const [showEdit, setShowEdit] = useState(false);
  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState("");

  useEffect(() => {
    loadDepartments();
  }, []);

  const loadDepartments = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:5000/api/departments");
      setDepartments(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    if (!newName.trim()) return;
    try {
      await axios.post("http://localhost:5000/api/departments", {
        department_name: newName
      });
      setSuccess("Department added.");
      setNewName("");
      setShowAdd(false);
      loadDepartments();
    } catch (error) {
      setError("Failed to add department.");
    }
  };

  const handleEditOpen = (dept) => {
    setEditId(dept.id);
    setEditName(dept.department_name);
    setShowEdit(true);
  };

  const handleEdit = async () => {
    if (!editName.trim()) return;
    try {
      await axios.put(`http://localhost:5000/api/departments/${editId}`, {
        department_name: editName
      });
      setSuccess("Department updated.");
      setShowEdit(false);
      loadDepartments();
    } catch (error) {
      setError("Failed to update department.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this department?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/departments/${id}`);
      setSuccess("Department deleted.");
      loadDepartments();
    } catch (error) {
      setError("Failed to delete department.");
    }
  };

  return (
    <div className="layout">
      <Sidebar />
      <div className="content-wrapper">

        <div className="page-header">
          <div>
            <h1 className="page-title">Departments</h1>
            <p className="page-subtitle">Manage departments in the organization</p>
          </div>
          <button className="btn btn-primary" onClick={() => setShowAdd(true)}>
            + Add Department
          </button>
        </div>

        {success && <div className="alert alert-success">{success}</div>}
        {error && <div className="alert alert-danger">{error}</div>}

        {/* Add Modal */}
        {showAdd && (
          <div className="modal-overlay">
            <div className="modal-box">
              <h5>Add Department</h5>
              <input
                className="form-control"
                placeholder="Department Name"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
              />
              <div className="modal-actions">
                <button className="btn btn-secondary" onClick={() => setShowAdd(false)}>Cancel</button>
                <button className="btn btn-primary" onClick={handleAdd}>Add</button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Modal */}
        {showEdit && (
          <div className="modal-overlay">
            <div className="modal-box">
              <h5>Edit Department</h5>
              <input
                className="form-control"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
              />
              <div className="modal-actions">
                <button className="btn btn-secondary" onClick={() => setShowEdit(false)}>Cancel</button>
                <button className="btn btn-warning" onClick={handleEdit}>Update</button>
              </div>
            </div>
          </div>
        )}

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
            </div>
          </div>
        ) : (
          <div className="card-standard">
            <div className="table-wrapper">
              <table className="table-standard">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Department Name</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {departments.map((dept) => (
                    <tr key={dept.id}>
                      <td><strong>#{dept.id}</strong></td>
                      <td>{dept.department_name}</td>
                      <td>
                        <button
                          className="btn btn-warning btn-sm"
                          style={{ marginRight: "8px" }}
                          onClick={() => handleEditOpen(dept)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDelete(dept.id)}
                        >
                          Delete
                        </button>
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

export default Departments;