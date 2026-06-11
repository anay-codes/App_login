import React from "react";
import NavBar from "../NavBar";
import EmployeeSidebar from "../components/EmployeeSidebar";

export default function EmployeeDashboard() {
  return (
    <div className="dashboard-layout">
      

      <EmployeeSidebar />

      <div className="dashboard-content">
        <h1 className="page-title">Employee Dashboard</h1>
        <p className="page-subtitle">Welcome back</p>
      </div>
    </div>
  );
}