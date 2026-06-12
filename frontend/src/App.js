import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import AdminTasks from "./pages/AdminTasks";
import Tasks from "./pages/Tasks";
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
import MyAssets from "./pages/MyAssets";
import EmployeeNotifications from "./pages/EmployeeNotifications";
import MarkAttendance from "./pages/MarkAttendance";
import AdminAttendance from "./pages/AdminAttendance";

const admin = (element) => <ProtectedRoute roles={["Admin"]}>{element}</ProtectedRoute>;
const employee = (element) => <ProtectedRoute roles={["Employee"]}>{element}</ProtectedRoute>;

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/dashboard" element={admin(<Dashboard />)} />
        <Route path="/employees" element={admin(<EmployeeList />)} />
        <Route path="/create-employee" element={admin(<CreateEmployee />)} />
        <Route path="/edit-employee/:id" element={admin(<EditEmployee />)} />
        <Route path="/departments" element={admin(<Departments />)} />
        <Route path="/skills" element={admin(<Skills />)} />
        <Route path="/leave-application" element={admin(<LeaveApplication />)} />
        <Route path="/leave-list" element={admin(<LeaveList />)} />
        <Route path="/assets" element={admin(<AssetManagement />)} />
        <Route path="/notifications" element={admin(<Notifications />)} />
        <Route path="/audit-logs" element={admin(<AuditLogs />)} />
        <Route path="/reports" element={admin(<Reports />)} />
        <Route path="/admin-tasks" element={admin(<AdminTasks />)} />
        <Route path="/attendance" element={admin(<AdminAttendance />)} />
        <Route path="/employee-dashboard" element={employee(<EmployeeDashboard />)} />
        <Route path="/my-profile" element={employee(<MyProfile />)} />
        <Route path="/leave-requests" element={employee(<LeaveRequests />)} />
        <Route path="/leave-balance" element={employee(<LeaveBalance />)} />
        <Route path="/approval-history" element={employee(<ApprovalHistory />)} />
        <Route path="/tasks" element={employee(<Tasks />)} />
        <Route path="/my-assets" element={employee(<MyAssets />)} />
        <Route path="/employee-notifications" element={employee(<EmployeeNotifications />)} />
        <Route path="/mark-attendance" element={employee(<MarkAttendance />)} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
