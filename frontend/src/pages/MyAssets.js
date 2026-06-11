import React, { useEffect, useState } from 'react';
import axios from 'axios';
import NavBar from '../NavBar';

export default function MyAssets() {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');
  const profile = JSON.parse(localStorage.getItem('profile') || '{}');

  useEffect(() => {
    const fetchAssets = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/assets/allocations`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const myAssets = res.data.data.filter(a => a.employee_id === profile.id);
        setAssets(myAssets);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAssets();
  }, []);

  return (
    <>
      <NavBar />
      <div className="container mt-4">
        <h3>My Assets</h3>
        {loading ? (
          <div className="spinner-border text-primary mt-3" role="status"></div>
        ) : (
          <table className="table table-bordered table-hover mt-3">
            <thead className="table-dark">
              <tr>
                <th>#</th>
                <th>Asset Name</th>
                <th>Type</th>
                <th>Serial No.</th>
                <th>Allocated Date</th>
                <th>Condition</th>
              </tr>
            </thead>
            <tbody>
              {assets.map((a, i) => (
                <tr key={a.id}>
                  <td>{i + 1}</td>
                  <td>{a.asset_name}</td>
                  <td>{a.asset_type}</td>
                  <td>{a.serial_number}</td>
                  <td>{a.allocated_date ? a.allocated_date.split('T')[0] : '—'}</td>
                  <td>{a.condition_on_allocation}</td>
                </tr>
              ))}
              {assets.length === 0 && (
                <tr><td colSpan="6" className="text-center">No assets assigned</td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}