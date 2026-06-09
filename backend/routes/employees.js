const express = require("express");
const router = express.Router();
const pool = require("../config/db");
const bcrypt = require("bcrypt");

// Create Employee - supports providing existing user_id OR creating a new user when user_id omitted
router.post("/", async (req, res) => {
  const client = await pool.connect();
  try {
    let {
      user_id,
      name,
      email,
      password,
      department_id,
      phone,
      address,
      designation,
      salary,
      profile_image,
      resume_file,
      document_file
    } = req.body;

    await client.query("BEGIN");

    // If user_id not provided, create a new user (admin UI should send name,email,password)
    if (!user_id) {
      if (!name || !email || !password) {
        await client.query("ROLLBACK");
        return res.status(400).json({ message: "Missing user details (name, email, password) to create associated user" });
      }

      // Check existing email
      const existing = await client.query("SELECT id FROM users WHERE email = $1", [email]);
      if (existing.rows.length > 0) {
        user_id = existing.rows[0].id; // reuse existing user if present
      } else {
        const salt = await bcrypt.genSalt(10);
        const hashed = await bcrypt.hash(password, salt);
        const newUser = await client.query(
          `INSERT INTO users (name, email, password, role) VALUES ($1,$2,$3,$4) RETURNING *`,
          [name, email, hashed, 'Employee']
        );
        user_id = newUser.rows[0].id;
      }
    }

    const employee = await client.query(
      `INSERT INTO employee_profiles (user_id, department_id, phone, address, designation, salary, profile_image, resume_file, document_file)
       VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,
      [user_id, department_id || null, phone || null, address || null, designation || null, salary || null, profile_image || null, resume_file || null, document_file || null]
    );

    await client.query("COMMIT");
    res.json(employee.rows[0]);
  } catch (error) {
    try { await client.query("ROLLBACK"); } catch (e) {}
    console.error(error);
    res.status(500).json("Server Error");
  } finally {
    client.release();
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
      LEFT JOIN departments d
      ON ep.department_id = d.id
      ORDER BY ep.id`
    );

    res.json(employees.rows);

  } catch (error) {
    console.error(error);
    res.status(500).json("Server Error");
  }
});

// Get Single Employee
router.get("/:id", async (req, res) => {
  try {
    const employee = await pool.query(
      `SELECT *
       FROM employee_profiles
       WHERE id = $1`,
      [req.params.id]
    );

    res.json(employee.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json("Server Error");
  }
});

// Update Employee
router.put("/:id", async (req, res) => {
  try {
    const {
      phone,
      address,
      designation,
      salary
    } = req.body;

    await pool.query(
      `UPDATE employee_profiles
       SET
       phone = $1,
       address = $2,
       designation = $3,
       salary = $4
       WHERE id = $5`,
      [
        phone,
        address,
        designation,
        salary,
        req.params.id
      ]
    );

    res.json("Employee Updated");
  } catch (error) {
    console.error(error);
    res.status(500).json("Server Error");
  }
});

// Delete Employee
router.delete("/:id", async (req, res) => {
  try {
    await pool.query(
      "DELETE FROM employee_profiles WHERE id = $1",
      [req.params.id]
    );

    res.json("Employee Deleted");
  } catch (error) {
    console.error(error);
    res.status(500).json("Server Error");
  }
});

module.exports = router;