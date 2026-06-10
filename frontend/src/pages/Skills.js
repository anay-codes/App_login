import { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import "../App.css";

function Skills() {
  const [skills, setSkills] = useState([]);
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
    loadSkills();
  }, []);

  const loadSkills = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:5000/api/skills");
      setSkills(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    if (!newName.trim()) return;
    try {
      await axios.post("http://localhost:5000/api/skills", {
        skill_name: newName
      });
      setSuccess("Skill added.");
      setNewName("");
      setShowAdd(false);
      loadSkills();
    } catch (error) {
      setError("Failed to add skill.");
    }
  };

  const handleEditOpen = (skill) => {
    setEditId(skill.id);
    setEditName(skill.skill_name);
    setShowEdit(true);
  };

  const handleEdit = async () => {
    if (!editName.trim()) return;
    try {
      await axios.put(`http://localhost:5000/api/skills/${editId}`, {
        skill_name: editName
      });
      setSuccess("Skill updated.");
      setShowEdit(false);
      loadSkills();
    } catch (error) {
      setError("Failed to update skill.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this skill?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/skills/${id}`);
      setSuccess("Skill deleted.");
      loadSkills();
    } catch (error) {
      setError("Failed to delete skill.");
    }
  };

  return (
    <div className="layout">
      <Sidebar />
      <div className="content-wrapper">

        <div className="page-header">
          <div>
            <h1 className="page-title">Skills</h1>
            <p className="page-subtitle">Manage available skills</p>
          </div>
          <button className="btn btn-primary" onClick={() => setShowAdd(true)}>
            + Add Skill
          </button>
        </div>

        {success && <div className="alert alert-success">{success}</div>}
        {error && <div className="alert alert-danger">{error}</div>}

        {/* Add Modal */}
        {showAdd && (
          <div className="modal-overlay">
            <div className="modal-box">
              <h5>Add Skill</h5>
              <input
                className="form-control"
                placeholder="Skill Name"
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
              <h5>Edit Skill</h5>
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
            <div className="stat-card stat-secondary">
              <h5>Total Skills</h5>
              <h2>{skills.length}</h2>
            </div>
          </div>
        )}

        {loading ? (
          <div className="loading-container">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3 text-muted">Loading skills...</p>
          </div>
        ) : skills.length === 0 ? (
          <div className="card-standard">
            <div className="empty-state">
              <div className="empty-state-title">No Skills Found</div>
            </div>
          </div>
        ) : (
          <div className="card-standard">
            <div className="table-wrapper">
              <table className="table-standard">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Skill Name</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {skills.map((skill) => (
                    <tr key={skill.id}>
                      <td><strong>#{skill.id}</strong></td>
                      <td>{skill.skill_name}</td>
                      <td>
                        <button
                          className="btn btn-warning btn-sm"
                          style={{ marginRight: "8px" }}
                          onClick={() => handleEditOpen(skill)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDelete(skill.id)}
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

export default Skills;