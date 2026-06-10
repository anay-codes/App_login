import { useEffect, useState } from "react";
import axios from "axios";
import NavBar from "../NavBar";

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState("");

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/tasks/my", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTasks(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const markDone = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(`http://localhost:5000/api/tasks/${id}/done`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccess("Task marked as done!");
      loadTasks();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <NavBar />
      <div style={{ padding: "32px" }}>
        <div className="page-header">
          <div>
            <h1 className="page-title">My Tasks</h1>
            <p className="page-subtitle">Tasks assigned to you</p>
          </div>
        </div>

        {success && <div className="alert alert-success">{success}</div>}

        {loading ? (
          <p>Loading...</p>
        ) : tasks.length === 0 ? (
          <div className="card-standard">
            <div className="empty-state">
              <div className="empty-state-title">No tasks assigned yet.</div>
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
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {tasks.map((task) => (
                    <tr key={task.id}>
                      <td><strong>{task.title}</strong></td>
                      <td>{task.description || "—"}</td>
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
                        {task.status !== "done" && (
                          <button
                            className="btn btn-success btn-sm"
                            onClick={() => markDone(task.id)}
                          >
                            Mark Done
                          </button>
                        )}
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