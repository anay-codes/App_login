import React from 'react';
import NavBar from '../NavBar';

export default function MyProfile(){
  const profile = JSON.parse(localStorage.getItem('profile') || 'null');
  return (
    <div className="container">
      <NavBar />
      <div className="content-wrapper">
        <div className="card-standard">
          <h2>My Profile</h2>
          {profile ? (
            <div>
              <p><strong>Name:</strong> {profile.name}</p>
              <p><strong>Phone:</strong> {profile.phone}</p>
              <p><strong>Address:</strong> {profile.address}</p>
              <p><strong>Designation:</strong> {profile.designation}</p>
            </div>
          ) : (
            <p>No profile data available.</p>
          )}
        </div>
      </div>
    </div>
  );
}