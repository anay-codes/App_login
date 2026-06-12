// backend/routes/attendance.js
const express = require('express');
const AttendanceService = require('../services/AttendanceService');

const router = express.Router();

// Since you exported 'new AttendanceService()' in the service file, we use it directly
const attendanceService = AttendanceService;

// ==================== TODAY ROUTE ====================
router.get('/today', async (req, res) => {
  try {
    const employeeId = req.query.employee_id;
    if (!employeeId) {
      return res.status(400).json({ error: "employee_id is required" });
    }

    const record = await attendanceService.getEmployeeTodayAttendance(employeeId);
    res.json(record || { status: 'Absent', punch_in: null });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// ===================================================

// Employee: Punch In
router.post('/punch-in', async (req, res) => {
  try {
    const employeeId = req.body.employee_id; 
    const result = await attendanceService.markAttendance(employeeId, {
      punch_in: new Date(),
      notes: req.body.notes
    });
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Admin: Get attendance
router.get('/', async (req, res) => {
  try {
    const filter = {
      start_date: req.query.start_date,
      end_date: req.query.end_date,
      employee_id: req.query.employee_id
    };
    const data = await attendanceService.getAllAttendance(filter);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Monthly Summary
router.get('/summary', async (req, res) => {
  try {
    const year = parseInt(req.query.year) || new Date().getFullYear();
    const month = parseInt(req.query.month) || new Date().getMonth() + 1;
    const data = await attendanceService.getMonthlySummary(year, month);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin: Update attendance
router.put('/:id', async (req, res) => {
  try {
    const result = await attendanceService.updateAttendance(req.params.id, req.body);
    res.json(result);
  } catch (err) {
    const status = err.message === 'Attendance record not found' ? 404 : 400;
    res.status(status).json({ error: err.message });
  }
});

module.exports = router;
