const express = require("express");
const router = express.Router();
const pool = require("../config/db");

// Get all leave types
router.get("/leave-types", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM leave_types ORDER BY id"
    );
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json("Server Error");
  }
});

// Get all leave applications
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT
        la.id,
        la.employee_id,
        u.name AS employee_name,
        u.email AS employee_email,
        lt.leave_name,
        la.from_date,
        la.to_date,
        la.total_days,
        la.reason,
        la.status,
        la.created_at
      FROM leave_applications la
      INNER JOIN employee_profiles ep ON la.employee_id = ep.id
      INNER JOIN users u ON ep.user_id = u.id
      INNER JOIN leave_types lt ON la.leave_type_id = lt.id
      ORDER BY la.id DESC`
    );
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json("Server Error");
  }
});

// Get a single leave application by ID
router.get("/:id", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT
        la.id,
        la.employee_id,
        u.name AS employee_name,
        u.email AS employee_email,
        lt.leave_name,
        la.from_date,
        la.to_date,
        la.total_days,
        la.reason,
        la.status,
        la.created_at
      FROM leave_applications la
      INNER JOIN employee_profiles ep ON la.employee_id = ep.id
      INNER JOIN users u ON ep.user_id = u.id
      INNER JOIN leave_types lt ON la.leave_type_id = lt.id
      WHERE la.id = $1`,
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json("Leave application not found");
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json("Server Error");
  }
});

// Apply for leave
router.post("/apply", async (req, res) => {
  try {
    const { employee_id, leave_type_id, from_date, to_date, reason } = req.body;

    if (!employee_id || !leave_type_id || !from_date || !to_date) {
      return res.status(400).json("Missing required fields");
    }

    // Calculate total requested days
    const start = new Date(from_date);
    const end = new Date(to_date);
    const timeDiff = end - start;
    if (timeDiff < 0) {
      return res.status(400).json("End date cannot be before start date");
    }

    const total_days = Math.ceil(timeDiff / (1000 * 60 * 60 * 24)) + 1;

    // Check if employee_id exists
    const empCheck = await pool.query(
      "SELECT id FROM employee_profiles WHERE id = $1",
      [employee_id]
    );
    if (empCheck.rows.length === 0) {
      return res.status(400).json("Invalid Employee ID");
    }

    // Check leave balance
    let balanceResult = await pool.query(
      "SELECT available_days FROM leave_balance WHERE employee_id = $1 AND leave_type_id = $2",
      [employee_id, leave_type_id]
    );

    let available_days = 0;

    if (balanceResult.rows.length === 0) {
      // Get total days for this leave type to initialize
      const typeResult = await pool.query(
        "SELECT total_days FROM leave_types WHERE id = $1",
        [leave_type_id]
      );
      if (typeResult.rows.length === 0) {
        return res.status(400).json("Invalid Leave Type ID");
      }

      const defaultTotalDays = typeResult.rows[0].total_days;

      // Initialize the leave balance
      const newBalance = await pool.query(
        `INSERT INTO leave_balance (employee_id, leave_type_id, available_days)
         VALUES ($1, $2, $3)
         RETURNING available_days`,
        [employee_id, leave_type_id, defaultTotalDays]
      );

      available_days = newBalance.rows[0].available_days;
    } else {
      available_days = balanceResult.rows[0].available_days;
    }

    if (available_days < total_days) {
      return res
        .status(400)
        .json(`Insufficient leave balance. Available: ${available_days} days, Requested: ${total_days} days.`);
    }

    // Apply
    const newApplication = await pool.query(
      `INSERT INTO leave_applications (employee_id, leave_type_id, from_date, to_date, total_days, reason, status, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, 'Pending', NOW())
       RETURNING *`,
      [employee_id, leave_type_id, from_date, to_date, total_days, reason]
    );

    res.status(201).json(newApplication.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json("Server Error");
  }
});

// Approve leave application
router.put("/approve/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { remarks } = req.body;

    const appResult = await pool.query(
      "SELECT * FROM leave_applications WHERE id = $1",
      [id]
    );

    if (appResult.rows.length === 0) {
      return res.status(404).json("Leave application not found");
    }

    const application = appResult.rows[0];

    if (application.status !== "Pending") {
      return res.status(400).json(`Only pending leave applications can be approved. Current status: ${application.status}`);
    }

    // Check balance again before deducting
    const balanceResult = await pool.query(
      "SELECT available_days FROM leave_balance WHERE employee_id = $1 AND leave_type_id = $2",
      [application.employee_id, application.leave_type_id]
    );

    if (balanceResult.rows.length === 0 || balanceResult.rows[0].available_days < application.total_days) {
      return res.status(400).json("Cannot approve leave: Insufficient balance.");
    }

    // Deduct available days
    await pool.query(
      `UPDATE leave_balance
       SET available_days = available_days - $1
       WHERE employee_id = $2 AND leave_type_id = $3`,
      [application.total_days, application.employee_id, application.leave_type_id]
    );

    // Update leave application status
    await pool.query(
      "UPDATE leave_applications SET status = 'Approved' WHERE id = $1",
      [id]
    );

    // Add to approval history
    await pool.query(
      `INSERT INTO approval_history (leave_id, approved_by, action, remarks, created_at)
       VALUES ($1, $2, $3, $4, NOW())`,
      [id, 1, "Approve", remarks || "Approved"]
    );

    res.json("Leave Approved Successfully");
  } catch (error) {
    console.error(error);
    res.status(500).json("Server Error");
  }
});

// Reject leave application
router.put("/reject/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { remarks } = req.body;

    const appResult = await pool.query(
      "SELECT * FROM leave_applications WHERE id = $1",
      [id]
    );

    if (appResult.rows.length === 0) {
      return res.status(404).json("Leave application not found");
    }

    const application = appResult.rows[0];

    if (application.status !== "Pending") {
      return res.status(400).json(`Only pending leave applications can be rejected. Current status: ${application.status}`);
    }

    // Update leave application status
    await pool.query(
      "UPDATE leave_applications SET status = 'Rejected' WHERE id = $1",
      [id]
    );

    // Add to approval history
    await pool.query(
      `INSERT INTO approval_history (leave_id, approved_by, action, remarks, created_at)
       VALUES ($1, $2, $3, $4, NOW())`,
      [id, 1, "Reject", remarks || "Rejected"]
    );

    res.json("Leave Rejected Successfully");
  } catch (error) {
    console.error(error);
    res.status(500).json("Server Error");
  }
});

module.exports = router;
