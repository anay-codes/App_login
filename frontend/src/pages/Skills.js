import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import "../App.css";

function Skills() {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadSkills();
  }, []);

  const loadSkills = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        "http://localhost:5000/api/skills"
      );
      setSkills(res.data);
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
            <h1 className="page-title">Skills</h1>
            <p className="page-subtitle">View all available skills</p>
          </div>
        </div>

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
              <div className="empty-state-description">
                There are no skills in the system.
              </div>
            </div>
          </div>
        ) : (
          <div className="card-standard">
            <div className="table-wrapper">
              <table className="table-standard">
                <thead>
                  <tr>
                    <th>Skill ID</th>
                    <th>Skill Name</th>
                  </tr>
                </thead>

                <tbody>
                  {skills.map((skill) => (
                    <tr key={skill.id}>
                      <td><strong>#{skill.id}</strong></td>
                      <td>{skill.skill_name}</td>
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