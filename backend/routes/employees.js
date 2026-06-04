const express = require("express");
const router = express.Router();
const pool = require("../config/db");

// Create Employee
router.post("/", async (req, res) => {
  try {
    const {
      user_id,
      department_id,
      phone,
      address,
      designation,
      salary,
      profile_image,
      resume_file,
      document_file
    } = req.body;

    const employee = await pool.query(
      `INSERT INTO employee_profiles
      (
        user_id,
        department_id,
        phone,
        address,
        designation,
        salary,
        profile_image,
        resume_file,
        document_file
      )
      VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9)
      RETURNING *`,
      [
        user_id,
        department_id,
        phone,
        address,
        designation,
        salary,
        profile_image,
        resume_file,
        document_file
      ]
    );

    res.json(employee.rows[0]);

  } catch (error) {
    console.error(error);
    res.status(500).json("Server Error");
  }
});

// Get Employees
router.get("/", async (req, res) => {
  try {
    const employees = await pool.query(
      `SELECT
        ep.id,
        u.name,
        u.email,
        d.department_name,
        ep.phone,
        ep.address,
        ep.designation,
        ep.salary,
        ep.profile_image,
        ep.resume_file,
        ep.document_file
      FROM employee_profiles ep
      INNER JOIN users u
      ON ep.user_id = u.id
      INNER JOIN departments d
      ON ep.department_id = d.id
      ORDER BY ep.id`
    );

    res.json(employees.rows);

  } catch (error) {
    console.error(error);
    res.status(500).json("Server Error");
  }
});

module.exports = router;