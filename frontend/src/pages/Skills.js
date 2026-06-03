import { useEffect, useState } from "react";
import axios from "axios";

function Skills() {
  const [skills, setSkills] = useState([]);

  useEffect(() => {
    loadSkills();
  }, []);

  const loadSkills = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/skills"
      );

      setSkills(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="container mt-5">

      <h2>Skills</h2>

      <table className="table table-bordered mt-3">

        <thead>
          <tr>
            <th>ID</th>
            <th>Skill Name</th>
          </tr>
        </thead>

        <tbody>
          {skills.map((skill) => (
            <tr key={skill.id}>
              <td>{skill.id}</td>
              <td>{skill.skill_name}</td>
            </tr>
          ))}
        </tbody>

      </table>

    </div>
  );
}

export default Skills;