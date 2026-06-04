import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function CreateEmployee() {
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [resume, setResume] = useState(null);
  const [document, setDocument] = useState(null);

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

      const uploadData = new FormData();

      if (profile) {
        uploadData.append("profile", profile);
      }

      if (resume) {
        uploadData.append("resume", resume);
      }

      if (document) {
        uploadData.append("document", document);
      }

      const uploadResponse = await axios.post(
        "http://localhost:5000/api/upload",
        uploadData
      );

      console.log(uploadResponse.data);

      alert(JSON.stringify(uploadResponse.data));

      await axios.post(
  "http://localhost:5000/api/employees",
  {
    ...formData,
    profile_image: uploadResponse.data.profile_image,
    resume_file: uploadResponse.data.resume_file,
    document_file: uploadResponse.data.document_file
  }
);

      alert("Employee Created Successfully");

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

        <label className="mb-2">Profile Image</label>
        <input
          type="file"
          className="form-control mb-3"
          onChange={(e) => setProfile(e.target.files[0])}
        />

        <label className="mb-2">Resume</label>
        <input
          type="file"
          className="form-control mb-3"
          onChange={(e) => setResume(e.target.files[0])}
        />

        <label className="mb-2">Document</label>
        <input
          type="file"
          className="form-control mb-3"
          onChange={(e) => setDocument(e.target.files[0])}
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