import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import EmployeeLayout from "../components/EmployeeLayout";

export default function MarkAttendance() {
  const [todayAttendance, setTodayAttendance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const profile = JSON.parse(localStorage.getItem("profile") || "{}");
  const employeeId = profile.id;

  const fetchTodayAttendance = useCallback(async () => {
    if (!employeeId) {
      setMessage({ type: "danger", text: "Employee profile is unavailable. Please sign in again." });
      setLoading(false);
      return;
    }
    try {
      const res = await axios.get(`/api/attendance/today?employee_id=${employeeId}`);
      setTodayAttendance(res.data);
    } catch (error) {
      setMessage({ type: "danger", text: error.response?.data?.error || "Unable to load attendance." });
    } finally {
      setLoading(false);
    }
  }, [employeeId]);

  useEffect(() => {
    fetchTodayAttendance();
  }, [fetchTodayAttendance]);

  const handlePunchIn = async () => {
    setSubmitting(true);
    try {
      const res = await axios.post("/api/attendance/punch-in", { employee_id: employeeId });
      setTodayAttendance(res.data);
      setMessage({ type: "success", text: "Successfully punched in." });
    } catch (error) {
      setMessage({ type: "danger", text: error.response?.data?.error || "Failed to punch in." });
    } finally {
      setSubmitting(false);
    }
  };

  const hasPunchedIn = Boolean(todayAttendance?.punch_in);
  const statusText = todayAttendance?.finalized
    ? `Attendance confirmed as ${todayAttendance.status}.`
    : "Attendance is pending admin review.";

  return (
    <EmployeeLayout>
      <div className="page-header">
        <div>
          <h1 className="page-title">Attendance</h1>
          <p className="page-subtitle">{new Date().toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</p>
        </div>
      </div>
      {message.text && <div className={`alert alert-${message.type}`}>{message.text}</div>}
      <div className="card-standard attendance-card">
        {loading ? <div className="spinner-border" /> : hasPunchedIn ? (
          <>
            <span className={`status-pill ${todayAttendance.finalized ? "success" : "warning"}`}>
              {todayAttendance.finalized ? todayAttendance.status : "Pending review"}
            </span>
            <h2>{statusText}</h2>
            <p className="page-subtitle">Punch-in time</p>
            <p className="attendance-time">{new Date(todayAttendance.punch_in).toLocaleTimeString()}</p>
          </>
        ) : (
          <>
            <span className="status-pill neutral">Not marked</span>
            <h2>Ready to start your workday?</h2>
            <p className="page-subtitle">Attendance can be marked once per day.</p>
            <button className="btn btn-primary" disabled={submitting || !employeeId} onClick={handlePunchIn}>
              {submitting ? "Punching in..." : "Punch in now"}
            </button>
          </>
        )}
      </div>
    </EmployeeLayout>
  );
}
