import { useEffect, useState } from "react";
import axios from "axios";

function Departments() {
  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    loadDepartments();
  }, []);

  const loadDepartments = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/departments"
      );

      setDepartments(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="container mt-5">

      <h2>Departments</h2>

      <table className="table table-bordered mt-3">

        <thead>
          <tr>
            <th>ID</th>
            <th>Department Name</th>
          </tr>
        </thead>

        <tbody>
          {departments.map((dept) => (
            <tr key={dept.id}>
              <td>{dept.id}</td>
              <td>{dept.department_name}</td>
            </tr>
          ))}
        </tbody>

      </table>

    </div>
  );
}

export default Departments;