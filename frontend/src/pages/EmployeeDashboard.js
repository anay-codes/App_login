import React from "react";
import NavBar from '../NavBar';
import { useNavigate } from 'react-router-dom';

function StatCard({title, subtitle, to}){
  const navigate = useNavigate();
  return (
    <div className="stat-card" style={{cursor: to ? 'pointer' : 'default'}} onClick={() => to && navigate(to)}>
      <h5>{subtitle}</h5>
      <h2>{title}</h2>
      <p className="form-text">Click to open</p>
    </div>
  );
}

export default function EmployeeDashboard(){
  return (
    <div>
      <NavBar />
      <div className="content-wrapper">
        <div className="page-header">
          <div>
            <h1 className="page-title">Employee Dashboard</h1>
            <p className="page-subtitle">Personal workspace for employees</p>
          </div>
        </div>

        <div className="stats-grid">
          <StatCard title="View" subtitle="My Profile" to="/my-profile" />
          <StatCard title="Requests" subtitle="Leave Requests" to="/leave-requests" />
          <StatCard title="Balance" subtitle="Leave Balance" to="/leave-balance" />
          <StatCard title="History" subtitle="Approval History" to="/approval-history" />
        </div>

      </div>
    </div>
  );
}

