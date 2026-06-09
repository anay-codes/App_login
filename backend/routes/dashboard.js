const express = require("express");
const router = express.Router();
const pool = require("../config/db");

router.get("/stats", async (req, res) => {
  try {
    const employees = await pool.query(
      "SELECT COUNT(*) FROM employee_profiles"
    );

    const departments = await pool.query(
      "SELECT COUNT(*) FROM departments"
    );

    const skills = await pool.query(
      "SELECT COUNT(*) FROM skills"
    );

    const pendingLeaves = await pool.query(
      "SELECT COUNT(*) FROM leave_applications WHERE status = 'Pending'"
    );

    const approvedLeaves = await pool.query(
      "SELECT COUNT(*) FROM leave_applications WHERE status = 'Approved'"
    );

    const rejectedLeaves = await pool.query(
      "SELECT COUNT(*) FROM leave_applications WHERE status = 'Rejected'"
    );

    const employeesOnLeave = await pool.query(
      `SELECT COUNT(*)
       FROM leave_applications
       WHERE status = 'Approved'
       AND CURRENT_DATE BETWEEN from_date AND to_date`
    );

    // Phase 5 — asset statistics
    const totalAssets     = await pool.query("SELECT COUNT(*) FROM assets");
    const allocatedAssets = await pool.query("SELECT COUNT(*) FROM assets WHERE status = 'Allocated'");
    const availableAssets = await pool.query("SELECT COUNT(*) FROM assets WHERE status = 'Available'");

    res.json({
      employees:       employees.rows[0].count,
      departments:     departments.rows[0].count,
      skills:          skills.rows[0].count,
      pendingLeaves:   pendingLeaves.rows[0].count,
      approvedLeaves:  approvedLeaves.rows[0].count,
      rejectedLeaves:  rejectedLeaves.rows[0].count,
      employeesOnLeave: employeesOnLeave.rows[0].count,
      totalAssets:     totalAssets.rows[0].count,
      allocatedAssets: allocatedAssets.rows[0].count,
      availableAssets: availableAssets.rows[0].count,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json("Server Error");
  }
});

module.exports = router;