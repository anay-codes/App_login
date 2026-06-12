import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../App.css";
import ThemeToggle from "./ThemeToggle";

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname;

  const isActive = (route) => {
    if (!route) return false;
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
    { label: "🏠 Home", to: "/login" },                    // Fixed
    { label: "Dashboard", route: "/dashboard" },
    { label: "Create Employee", route: "/create-employee" },
    { label: "Employee List", route: "/employees" },
    { label: "Departments", route: "/departments" },
    { label: "Skills", route: "/skills" },
    { label: "Apply Leave", route: "/leave-application" },
    { label: "Manage Leaves", route: "/leave-list" },
    { label: "Assets", route: "/assets" },
    { label: "Notifications", route: "/notifications" },
    { label: "Attendance", route: "/attendance" },         // ← New
    { label: "Audit Logs", route: "/audit-logs" },
    { label: "Reports", route: "/reports" },
    { label: "Tasks", route: "/admin-tasks" },
  ];

  return (
    <div className="sidebar">
      <h3 className="sidebar-title">EMS</h3>
      <div className="sidebar-nav">
        {navItems.map((item, index) => (
          <button
            key={index}
            className={`sidebar-btn${isActive(item.route || item.to) ? " active" : ""}`}
            onClick={() => navigate(item.to || item.route)}
          >
            {item.label}
          </button>
        ))}
        <button className="sidebar-btn logout-btn" onClick={logout}>
          Logout
        </button>
        <ThemeToggle />
      </div>
    </div>
  );
}
