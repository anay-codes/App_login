import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../App.css";

export default function EmployeeSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname;

  const isActive = (route) => {
    if (!route) return false;
    return path.startsWith(route);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("profile");
    navigate("/login");
  };

  const navItems = [
    { label: "Dashboard", route: "/employee-dashboard" },
    { label: "My Profile", route: "/my-profile" },
    { label: "Apply Leave", route: "/leave-requests" },
    { label: "Leave History", route: "/approval-history" },
    { label: "My Tasks", route: "/tasks" },
    { label: "My Assets", route: "/my-assets" },
    { label: "Notifications", route: "/employee-notifications" },
    { label: "Attendance", route: "/mark-attendance" }
  ];

  return (
    <div className="sidebar">
      <h3 className="sidebar-title">EMS</h3>

      <div className="sidebar-nav">
        {navItems.map((item, index) => (
          <button
            key={index}
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