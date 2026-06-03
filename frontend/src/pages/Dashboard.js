import { Navigate, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

function Dashboard() {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    employees: 0,
    departments: 0,
    skills: 0
  });

  const token = localStorage.getItem("token");

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/dashboard/stats"
      );

      setStats(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  if (!token) {
    return <Navigate to="/login" />;
  }

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="container mt-5">
      <div className="card shadow p-4">

        <h1 className="text-center">
          Employee Management Dashboard
        </h1>

        <div className="row mt-4">

          <div className="col-md-4">
            <div className="card text-center p-3">
              <h5>Total Employees</h5>
              <h2>{stats.employees}</h2>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card text-center p-3">
              <h5>Total Departments</h5>
              <h2>{stats.departments}</h2>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card text-center p-3">
              <h5>Total Skills</h5>
              <h2>{stats.skills}</h2>
            </div>
          </div>

        </div>

        <button
  className="btn btn-success mt-4 me-2"
  onClick={() => navigate("/create-employee")}
>
  Create Employee
</button>

        <button
  className="btn btn-primary mt-4 me-2"
  onClick={() => navigate("/employees")}
>
  View Employees
</button>


<button
  className="btn btn-warning mt-4 me-2"
  onClick={() => navigate("/departments")}
>
  Departments
</button>

<button
  className="btn btn-info mt-4 me-2"
  onClick={() => navigate("/skills")}
>
  Skills
</button>

        <button
          className="btn btn-danger mt-4"
          onClick={logout}
        >
          Logout
        </button>

      </div>
    </div>
  );
}

export default Dashboard;