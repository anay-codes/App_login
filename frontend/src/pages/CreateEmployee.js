import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function CreateEmployee() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    user_id: "",
    department_id: "",
    phone: "",
    address: "",
    designation: "",
    salary: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post(
        "http://localhost:5000/api/employees",
        formData
      );

      alert("Employee Created");

      navigate("/employees");
    } catch (error) {
      console.log(error);
      alert("Error");
    }
  };

  return (
    <div className="container mt-5">

      <h2>Create Employee</h2>

      <form onSubmit={handleSubmit}>

        <input
          className="form-control mb-3"
          name="user_id"
          placeholder="User ID"
          onChange={handleChange}
        />

        <input
          className="form-control mb-3"
          name="department_id"
          placeholder="Department ID"
          onChange={handleChange}
        />

        <input
          className="form-control mb-3"
          name="phone"
          placeholder="Phone"
          onChange={handleChange}
        />

        <input
          className="form-control mb-3"
          name="address"
          placeholder="Address"
          onChange={handleChange}
        />

        <input
          className="form-control mb-3"
          name="designation"
          placeholder="Designation"
          onChange={handleChange}
        />

        <input
          className="form-control mb-3"
          name="salary"
          placeholder="Salary"
          onChange={handleChange}
        />

        <button
          className="btn btn-success"
          type="submit"
        >
          Create Employee
        </button>

      </form>

    </div>
  );
}

export default CreateEmployee;