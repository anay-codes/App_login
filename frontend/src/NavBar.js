import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './App.css';

export default function NavBar(){
  const navigate = useNavigate();
  const role = localStorage.getItem('role');

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('profile');
    navigate('/login');
  };

  return (
    <div className="card-standard" style={{display:'flex', justifyContent:'space-between', alignItems:'center', margin:'16px 32px'}}>
      <div style={{display:'flex', gap:16, alignItems:'center'}}>
        <Link to={role === 'Admin' ? '/dashboard' : '/employee-dashboard'} style={{textDecoration:'none'}}>
          <h3 style={{margin:0, color:'#111827'}}>EMS</h3>
        </Link>
        <nav style={{display:'flex', gap:8}}>
          <Link to="/" className="btn btn-sm" style={{background:'transparent', color:'#374151'}}>Home</Link>
          <Link to="/signup" className="btn btn-sm btn-primary">Register</Link>
          {role === 'Admin' && <Link to="/employees" className="btn btn-sm">Employees</Link>}
          {role === 'Employee' && <Link to="/employee-dashboard" className="btn btn-sm">My Dashboard</Link>}
        </nav>
      </div>
      <div>
        {localStorage.getItem('token') ? (
          <button className="btn btn-sm btn-secondary" onClick={logout}>Logout</button>
        ) : (
          <Link to="/login" className="btn btn-sm btn-primary">Login</Link>
        )}
      </div>
    </div>
  );
}
