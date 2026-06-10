import { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import "../App.css";

export default function AdminTasks() {
  const [tasks, setTasks] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [showAdd, setShowAdd] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    assigned_to: ""
  });

  useEffect(() => {
    loadTasks();
    loadEmployees();
  }, []);

  const loadTasks = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/tasks", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTasks(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const loadEmployees = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/employees");
      setEmployees(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleCreate = async () => {
    if (!formData.title || !formData.assigned_to) {
      setError("Title and assigned employee are required.");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:5000/api/tasks", formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccess("Task created!");
      setFormData({ title: "", description: "", assigned_to: "" });
      setShowAdd(false);
      loadTasks();
    } catch (error) {
      setError("Failed to create task.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this task?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/tasks/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccess("Task deleted.");
      loadTasks();
    } catch (error) {
      setError("Failed to delete task.");
    }
  };

  return (
    <div className="layout">
      <Sidebar />
      <div className="content-wrapper">

        <div className="page-header">
          <div>
            <h1 className="page-title">Tasks</h1>
            <p className="page-subtitle">Assign and manage employee tasks</p>
          </div>
          <button className="btn btn-primary" onClick={() => setShowAdd(true)}>
            + Create Task
          </button>
        </div>

        {success && <div className="alert alert-success">{success}</div>}
        {error && <div className="alert alert-danger">{error}</div>}

        {/* Add Modal */}
        {showAdd && (
          <div className="modal-overlay">
            <div className="modal-box">
              <h5>Create Task</h5>

              <div className="form-group">
                <label className="form-label">Title *</label>
                <input
                  className="form-control"
                  placeholder="Task title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  className="form-control"
                  placeholder="Task description"
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Assign To *</label>
                <select
                  className="form-control"
                  value={formData.assigned_to}
                  onChange={(e) => setFormData({ ...formData, assigned_to: e.target.value })}
                >
                  <option value="">Select Employee</option>
                  {employees.map((emp) => (
                    <option key={emp.id} value={emp.user_id}>
                      {emp.name} — {emp.designation || "No designation"}
                    </option>
                  ))}
                </select>
              </div>

              <div className="modal-actions">
                <button className="btn btn-secondary" onClick={() => setShowAdd(false)}>Cancel</button>
                <button className="btn btn-primary" onClick={handleCreate}>Create</button>
              </div>
            </div>
          </div>
        )}

        {loading ? (
          <div className="loading-container">
            <div className="spinner-border text-primary" role="status"></div>
          </div>
        ) : tasks.length === 0 ? (
          <div className="card-standard">
            <div className="empty-state">
              <div className="empty-state-title">No tasks created yet.</div>
            </div>
          </div>
        ) : (
          <div className="card-standard">
            <div className="table-wrapper">
              <table className="table-standard">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Description</th>
                    <th>Assigned To</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {tasks.map((task) => (
                    <tr key={task.id}>
                      <td><strong>{task.title}</strong></td>
                      <td>{task.description || "—"}</td>
                      <td>{task.assigned_to_name || "—"}</td>
                      <td>
                        <span style={{
                          padding: "4px 10px",
                          borderRadius: "20px",
                          fontSize: "12px",
                          fontWeight: "600",
                          background: task.status === "done" ? "#d1fae5" : "#fef3c7",
                          color: task.status === "done" ? "#065f46" : "#78350f"
                        }}>
                          {task.status === "done" ? "Done" : "Pending"}
                        </span>
                      </td>
                      <td>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDelete(task.id)}
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