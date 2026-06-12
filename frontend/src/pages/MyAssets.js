import React, { useEffect, useState } from 'react';
import axios from 'axios';
import EmployeeLayout from '../components/EmployeeLayout';

export default function MyAssets() {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');
  const profile = JSON.parse(localStorage.getItem('profile') || '{}');

  useEffect(() => {
    const fetchAssets = async () => {
      try {
        const res = await axios.get(`/api/assets/allocations?employee_id=${profile.id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setAssets(res.data.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAssets();
  }, []);

  return (
    <EmployeeLayout>
      <div className="page-header"><div><h1 className="page-title">My Assets</h1><p className="page-subtitle">Equipment currently allocated to you.</p></div></div>
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
    </EmployeeLayout>
  );
}
