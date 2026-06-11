import React, { useEffect, useState } from 'react';
import axios from 'axios';
import EmployeeSidebar from "../components/EmployeeSidebar";

export default function MyProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/employees/me", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProfile(res.data);
    } catch (error) {
      setError("Failed to load profile.");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

 return (
  <div className="dashboard-layout">
    <EmployeeSidebar />

    <div className="dashboard-content">
        {loading && <p>Loading...</p>}
        {error && <div className="alert alert-danger">{error}</div>}

        {profile && (
          <div className="card-standard" style={{ maxWidth: "600px" }}>
            <h2 style={{ marginBottom: "24px" }}>My Profile</h2>

            <div className="form-section">
              <h5 className="form-section-title">Personal Information</h5>
              <p><strong>Name:</strong> {profile.name || "—"}</p>
              <p><strong>Email:</strong> {profile.email || "—"}</p>
              <p><strong>Phone:</strong> {profile.phone || "—"}</p>
              <p><strong>Address:</strong> {profile.address || "—"}</p>
            </div>

            <div className="form-section">
              <h5 className="form-section-title">Professional Information</h5>
              <p><strong>Designation:</strong> {profile.designation || "—"}</p>
              <p><strong>Salary:</strong> {profile.salary ? `$${profile.salary}` : "—"}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}