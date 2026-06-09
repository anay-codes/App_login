import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/SignupNew";
import ForgotPassword from "./pages/ForgotPassword";
import Dashboard from "./pages/Dashboard";
import EmployeeList from "./pages/EmployeeList";
import CreateEmployee from "./pages/CreateEmployeeNew";
import EditEmployee from "./pages/EditEmployee";
import Departments from "./pages/Departments";
import Skills from "./pages/Skills";
import LeaveApplication from "./pages/LeaveApplication";
import LeaveList from "./pages/LeaveList";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import MyProfile from "./pages/MyProfile";
import LeaveRequests from "./pages/LeaveRequests";
import LeaveBalance from "./pages/LeaveBalance";
import ApprovalHistory from "./pages/ApprovalHistory";
import AssetManagement from "./pages/AssetManagement";
import Notifications from "./pages/Notifications";
import AuditLogs from "./pages/AuditLogs";
import Reports from "./pages/Reports";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/employee-dashboard" element={<EmployeeDashboard />} />
        <Route path="/my-profile" element={<MyProfile />} />
        <Route path="/leave-requests" element={<LeaveRequests />} />
        <Route path="/leave-balance" element={<LeaveBalance />} />
        <Route path="/approval-history" element={<ApprovalHistory />} />
        <Route path="/employees" element={<EmployeeList />} />
        <Route path="/create-employee" element={<CreateEmployee />} />
        <Route path="/edit-employee/:id" element={<EditEmployee />} />
        <Route path="/departments" element={<Departments />} />
        <Route path="/skills" element={<Skills />} />
        <Route path="/leave-application" element={<LeaveApplication />} />
        <Route path="/leave-list" element={<LeaveList />} />
        <Route path="/assets" element={<AssetManagement />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/audit-logs" element={<AuditLogs />} />
        <Route path="/reports" element={<Reports />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
