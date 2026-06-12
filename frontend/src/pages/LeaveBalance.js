import { useEffect, useState } from "react";
import axios from "axios";
import EmployeeLayout from "../components/EmployeeLayout";

export default function LeaveBalance() {
  const [balances, setBalances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const profile = JSON.parse(localStorage.getItem("profile") || "null");
  const employee_id = profile?.id;

  useEffect(() => {
    loadBalance();
  }, []);

  const loadBalance = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `/api/leaves/balance/${employee_id}`
      );
      setBalances(res.data);
    } catch (error) {
      setError("Failed to load leave balance.");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <EmployeeLayout>
        <div className="page-header">
          <div>
            <h1 className="page-title">Leave Balance</h1>
            <p className="page-subtitle">Your available leave days</p>
          </div>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        {loading ? (
          <p>Loading...</p>
        ) : balances.length === 0 ? (
          <div className="card-standard">
            <div className="empty-state">
              <div className="empty-state-title">No balance data yet.</div>
              <div className="empty-state-description">Apply for leave first to initialize your balance.</div>
            </div>
          </div>
        ) : (
          <div className="stats-grid">
            {balances.map((b) => (
              <div className="stat-card" key={b.id}>
                <h5>{b.leave_name}</h5>
                <h2>{b.available_days}</h2>
                <p className="form-text">days remaining</p>
              </div>
            ))}
          </div>
        )}
    </EmployeeLayout>
  );
}
