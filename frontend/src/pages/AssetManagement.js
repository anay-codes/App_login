import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import "../App.css";

export default function AssetManagement() {
  const [assets, setAssets] = useState([]);
  const [allocations, setAllocations] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("assets"); // 'assets' | 'allocations'

  // Modal states
  const [showAssetModal, setShowAssetModal] = useState(false);
  const [showAllocateModal, setShowAllocateModal] = useState(false);
  const [currentAsset, setCurrentAsset] = useState(null);

  const [assetForm, setAssetForm] = useState({
    asset_type: "",
    asset_name: "",
    serial_number: "",
    model: "",
    purchase_date: "",
    purchase_cost: "",
    description: "",
    status: "Available"
  });

  const [allocateForm, setAllocateForm] = useState({
    employee_id: "",
    allocated_date: "",
    condition_on_allocation: "Good",
    notes: ""
  });

  useEffect(() => {
    loadData();
    loadEmployees();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [assetRes, allocRes] = await Promise.all([
        axios.get("http://localhost:5000/api/assets"),
        axios.get("http://localhost:5000/api/assets/allocations")
      ]);
      setAssets(assetRes.data.data);
      setAllocations(allocRes.data.data);
    } catch (err) {
      console.error(err);
      alert("Error loading assets");
    } finally {
      setLoading(false);
    }
  };

  const loadEmployees = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/employees");
      setEmployees(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAssetFormChange = (e) => {
    setAssetForm({ ...assetForm, [e.target.name]: e.target.value });
  };

  const handleAllocateFormChange = (e) => {
    setAllocateForm({ ...allocateForm, [e.target.name]: e.target.value });
  };

  const saveAsset = async (e) => {
    e.preventDefault();
    try {
      if (currentAsset) {
        await axios.put(`http://localhost:5000/api/assets/${currentAsset.id}`, assetForm);
        alert("Asset updated successfully");
      } else {
        await axios.post("http://localhost:5000/api/assets", assetForm);
        alert("Asset created successfully");
      }
      setShowAssetModal(false);
      setCurrentAsset(null);
      loadData();
    } catch (err) {
      alert("Error saving asset: " + (err.response?.data?.message || err.message));
    }
  };

  const deleteAsset = async (id) => {
    if (!window.confirm("Are you sure you want to delete this asset?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/assets/${id}`);
      loadData();
    } catch (err) {
      alert("Error deleting asset");
    }
  };

  const allocateAsset = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/assets/allocate", {
        asset_id: currentAsset.id,
        ...allocateForm
      });
      alert("Asset allocated successfully");
      setShowAllocateModal(false);
      setCurrentAsset(null);
      loadData();
    } catch (err) {
      alert("Error allocating asset: " + (err.response?.data?.message || err.message));
    }
  };

  const returnAsset = async (allocationId) => {
    const condition = window.prompt("Enter condition on return (e.g., Good, Damaged):", "Good");
    if (condition === null) return;
    try {
      await axios.put(`http://localhost:5000/api/assets/allocations/${allocationId}/return`, {
        condition_on_return: condition,
        returned_date: new Date().toISOString().split('T')[0]
      });
      alert("Asset returned successfully");
      loadData();
    } catch (err) {
      alert("Error returning asset");
    }
  };

  const openEditAsset = (asset) => {
    setCurrentAsset(asset);
    setAssetForm({
      asset_type: asset.asset_type || "",
      asset_name: asset.asset_name || "",
      serial_number: asset.serial_number || "",
      model: asset.model || "",
      purchase_date: asset.purchase_date ? asset.purchase_date.split('T')[0] : "",
      purchase_cost: asset.purchase_cost || "",
      description: asset.description || "",
      status: asset.status || "Available"
    });
    setShowAssetModal(true);
  };

  const openAddAsset = () => {
    setCurrentAsset(null);
    setAssetForm({
      asset_type: "Laptop",
      asset_name: "",
      serial_number: "",
      model: "",
      purchase_date: "",
      purchase_cost: "",
      description: "",
      status: "Available"
    });
    setShowAssetModal(true);
  };

  const openAllocate = (asset) => {
    setCurrentAsset(asset);
    setAllocateForm({
      employee_id: "",
      allocated_date: new Date().toISOString().split('T')[0],
      condition_on_allocation: "Good",
      notes: ""
    });
    setShowAllocateModal(true);
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="dashboard-content">
        <div className="page-header">
          <div>
            <h1 className="page-title">Asset Management</h1>
            <p className="page-subtitle">Track hardware, software, and other resources</p>
          </div>
          <div className="page-actions">
            <button className="btn btn-primary" onClick={openAddAsset}>+ Add Asset</button>
          </div>
        </div>

        <div style={{ marginBottom: "20px", display: "flex", gap: "10px" }}>
          <button 
            className={`btn ${activeTab === "assets" ? "btn-primary" : "btn-secondary"}`}
            onClick={() => setActiveTab("assets")}
          >
            All Assets
          </button>
          <button 
            className={`btn ${activeTab === "allocations" ? "btn-primary" : "btn-secondary"}`}
            onClick={() => setActiveTab("allocations")}
          >
            Active Allocations
          </button>
        </div>

        {loading ? (
          <div className="loading-container">
            <div className="spinner-border text-primary" role="status"></div>
          </div>
        ) : activeTab === "assets" ? (
          <div className="card-standard">
            <div className="table-wrapper">
              <table className="table-standard">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Asset Name</th>
                    <th>Type</th>
                    <th>Serial No</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {assets.map(asset => (
                    <tr key={asset.id}>
                      <td>#{asset.id}</td>
                      <td><strong>{asset.asset_name}</strong><br/><small className="text-muted">{asset.model}</small></td>
                      <td>{asset.asset_type}</td>
                      <td>{asset.serial_number}</td>
                      <td>
                        <span className={`badge bg-${asset.status === 'Available' ? 'success' : 'warning'} text-${asset.status === 'Available' ? 'white' : 'dark'}`}>
                          {asset.status}
                        </span>
                      </td>
                      <td>
                        <div className="table-action-buttons">
                          <button className="btn btn-sm btn-secondary" onClick={() => openEditAsset(asset)}>Edit</button>
                          <button className="btn btn-sm btn-danger" onClick={() => deleteAsset(asset.id)}>Delete</button>
                          {asset.status === 'Available' && (
                            <button className="btn btn-sm btn-success" onClick={() => openAllocate(asset)}>Allocate</button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="card-standard">
            <div className="table-wrapper">
              <table className="table-standard">
                <thead>
                  <tr>
                    <th>Asset</th>
                    <th>Employee</th>
                    <th>Department</th>
                    <th>Allocated Date</th>
                    <th>Condition</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {allocations.map(alloc => (
                    <tr key={alloc.id}>
                      <td><strong>{alloc.asset_name}</strong><br/><small className="text-muted">{alloc.serial_number}</small></td>
                      <td>{alloc.employee_name}</td>
                      <td>{alloc.department_name}</td>
                      <td>{alloc.allocated_date ? alloc.allocated_date.split('T')[0] : ''}</td>
                      <td>{alloc.condition_on_allocation}</td>
                      <td>
                        <button className="btn btn-sm btn-warning" onClick={() => returnAsset(alloc.id)}>Return Asset</button>
                      </td>
                    </tr>
                  ))}
                  {allocations.length === 0 && (
                    <tr><td colSpan="6" className="text-center py-4">No active allocations</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Modal overlays could be extracted, but for speed, doing basic absolute divs */}
        {(showAssetModal || showAllocateModal) && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="card-standard" style={{ width: '500px', maxHeight: '90vh', overflowY: 'auto' }}>
              
              {showAssetModal && (
                <form onSubmit={saveAsset}>
                  <div className="card-header">
                    <h3 className="card-title">{currentAsset ? "Edit Asset" : "Add Asset"}</h3>
                    <button type="button" className="btn btn-sm btn-danger" onClick={() => setShowAssetModal(false)}>X</button>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Type</label>
                    <select className="form-select" name="asset_type" value={assetForm.asset_type} onChange={handleAssetFormChange} required>
                      <option value="Laptop">Laptop</option>
                      <option value="Monitor">Monitor</option>
                      <option value="Mobile">Mobile</option>
                      <option value="Accessories">Accessories</option>
                      <option value="Furniture">Furniture</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Asset Name</label>
                    <input className="form-control" name="asset_name" value={assetForm.asset_name} onChange={handleAssetFormChange} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Serial Number</label>
                    <input className="form-control" name="serial_number" value={assetForm.serial_number} onChange={handleAssetFormChange} required />
                  </div>
                  <div className="row">
                    <div className="col-md-6 form-group">
                      <label className="form-label">Model</label>
                      <input className="form-control" name="model" value={assetForm.model} onChange={handleAssetFormChange} />
                    </div>
                    <div className="col-md-6 form-group">
                      <label className="form-label">Status</label>
                      <select className="form-select" name="status" value={assetForm.status} onChange={handleAssetFormChange}>
                        <option value="Available">Available</option>
                        <option value="Allocated">Allocated</option>
                        <option value="Maintenance">Maintenance</option>
                        <option value="Retired">Retired</option>
                      </select>
                    </div>
                  </div>
                  <div className="form-group">
                    <button type="submit" className="btn btn-primary w-100">Save Asset</button>
                  </div>
                </form>
              )}

              {showAllocateModal && (
                <form onSubmit={allocateAsset}>
                  <div className="card-header">
                    <h3 className="card-title">Allocate Asset</h3>
                    <button type="button" className="btn btn-sm btn-danger" onClick={() => setShowAllocateModal(false)}>X</button>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Asset: {currentAsset?.asset_name}</label>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Employee</label>
                    <select className="form-select" name="employee_id" value={allocateForm.employee_id} onChange={handleAllocateFormChange} required>
                      <option value="">-- Select Employee --</option>
                      {employees.map(emp => (
                        <option key={emp.id} value={emp.id}>{emp.name} ({emp.department_name})</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Allocation Date</label>
                    <input type="date" className="form-control" name="allocated_date" value={allocateForm.allocated_date} onChange={handleAllocateFormChange} required />
                  </div>
                  <div className="form-group">
                    <button type="submit" className="btn btn-success w-100">Confirm Allocation</button>
                  </div>
                </form>
              )}

            </div>
          </div>
        )}

      </div>
    </div>
  );
}
