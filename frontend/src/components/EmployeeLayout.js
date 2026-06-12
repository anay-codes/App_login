import React from "react";
import EmployeeSidebar from "./EmployeeSidebar";

export default function EmployeeLayout({ children }) {
  return (
    <div className="app-shell">
      <EmployeeSidebar />
      <main className="app-content">{children}</main>
    </div>
  );
}
