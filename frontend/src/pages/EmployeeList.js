import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function EmployeeList() {
  const [employees, setEmployees] = useState([]);
  const navigate = useNavigate();

  const deleteEmployee = async (id) => {
  try {
    await axios.delete(
      `http://localhost:5000/api/employees/${id}`
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
    try {
      const res = await axios.get(
        "http://localhost:5000/api/employees"
      );

      setEmployees(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Employee List</h2>

      <table className="table table-bordered">
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
                    src={`http://localhost:5000/uploads/${emp.profile_image}`}
                    alt="profile"
                    width="60"
                    height="60"
                    style={{
                      objectFit: "cover",
                      borderRadius: "50%"
                    }}
                  />
                ) : (
                  "No Image"
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
                    href={`http://localhost:5000/uploads/${emp.resume_file}`}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-primary btn-sm"
                  >
                    Resume
                  </a>
                ) : (
                  "N/A"
                )}
              </td>

              <td>
                {emp.document_file ? (
                  <a
                    href={`http://localhost:5000/uploads/${emp.document_file}`}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-secondary btn-sm"
                  >
                    Document
                  </a>
                ) : (
                  "N/A"
                )}
              </td>

              <td>
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

              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default EmployeeList;