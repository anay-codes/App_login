import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

function EditEmployee() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [formData, setFormData] = useState({
    phone: "",
    address: "",
    designation: "",
    salary: ""
  });

  useEffect(() => {
    loadEmployee();
  }, []);

  const loadEmployee = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/employees/${id}`
      );

      setFormData({
        phone: res.data.phone || "",
        address: res.data.address || "",
        designation: res.data.designation || "",
        salary: res.data.salary || ""
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.put(
        `http://localhost:5000/api/employees/${id}`,
        formData
      );

      alert("Employee Updated");

      navigate("/employees");
    } catch (error) {
      console.log(error);
      alert("Error");
    }
  };

  return (
    <div className="container mt-5">
      <h2>Edit Employee</h2>

      <form onSubmit={handleSubmit}>
        <input
          className="form-control mb-3"
          name="phone"
          placeholder="Phone"
          value={formData.phone}
          onChange={handleChange}
        />

        <input
          className="form-control mb-3"
          name="address"
          placeholder="Address"
          value={formData.address}
          onChange={handleChange}
        />

        <input
          className="form-control mb-3"
          name="designation"
          placeholder="Designation"
          value={formData.designation}
          onChange={handleChange}
        />

        <input
          className="form-control mb-3"
          name="salary"
          placeholder="Salary"
          value={formData.salary}
          onChange={handleChange}
        />

        <button
          className="btn btn-warning"
          type="submit"
        >
          Update Employee
        </button>
      </form>
    </div>
  );
}

export default EditEmployee;