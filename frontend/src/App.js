import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import Dashboard from "./pages/Dashboard";
import EmployeeList from "./pages/EmployeeList";
import CreateEmployee from "./pages/CreateEmployee";
import EditEmployee from "./pages/EditEmployee";
import Departments from "./pages/Departments";
import Skills from "./pages/Skills";
import LeaveApplication from "./pages/LeaveApplication";
import LeaveList from "./pages/LeaveList";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />

        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route
          path="/forgot-password"
          element={<ForgotPassword />}
        />

        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/employees" element={<EmployeeList />} />
        <Route path="/create-employee" element={<CreateEmployee />} />
        <Route path="/edit-employee/:id" element={<EditEmployee />} />
        <Route path="/departments" element={<Departments />} />
        <Route path="/skills" element={<Skills />} />
        <Route path="/leave-application" element={<LeaveApplication />} />
        <Route path="/leave-list" element={<LeaveList />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;