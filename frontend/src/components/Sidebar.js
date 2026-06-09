import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../App.css";

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname;

  const isActive = (route) => {
    if (route === "/dashboard") return path === "/dashboard";
    return path.startsWith(route);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("profile");
    navigate("/login");
  };

  const navItems = [
    { label: "Dashboard", route: "/dashboard" },
    { label: "Create Employee", route: "/create-employee" },
    { label: "Employee List", route: "/employees" },
    { label: "Departments", route: "/departments" },
    { label: "Skills", route: "/skills" },
    { label: "Apply Leave", route: "/leave-application" },
    { label: "Manage Leaves", route: "/leave-list" },
    { label: "Assets", route: "/assets" },
    { label: "Notifications", route: "/notifications" },
    { label: "Audit Logs", route: "/audit-logs" },
    { label: "Reports", route: "/reports" },
  ];

  return (
    <div className="sidebar">
      <h3 className="sidebar-title">EMS</h3>
      <div className="sidebar-nav">
        {navItems.map((item) => (
          <button
            key={item.route}
            className={`sidebar-btn${isActive(item.route) ? " active" : ""}`}
            onClick={() => navigate(item.route)}
          >
            {item.label}
          </button>
        ))}
        <button className="sidebar-btn logout-btn" onClick={logout}>
          Logout
        </button>
      </div>
    </div>
  );
}
