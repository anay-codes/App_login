const express = require("express");
const router = express.Router();
const pool = require("../config/db");
const bcrypt = require("bcrypt");
const { authorize } = require("../middleware/auth");

// Create Employee
router.post("/", authorize("Admin"), async (req, res) => {
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

    if (!user_id) {
      if (!name || !email || !password) {
        await client.query("ROLLBACK");
        return res.status(400).json({
          message: "Missing user details (name, email, password)"
        });
      }

      const existing = await client.query(
        "SELECT id FROM users WHERE email = $1",
        [email]
      );

      if (existing.rows.length > 0) {
        user_id = existing.rows[0].id;
      } else {
        const salt = await bcrypt.genSalt(10);
        const hashed = await bcrypt.hash(password, salt);

        const newUser = await client.query(
          `INSERT INTO users (name, email, password, role)
           VALUES ($1,$2,$3,$4) RETURNING *`,
          [name, email, hashed, "Employee"]
        );

        user_id = newUser.rows[0].id;
      }
    }

    const employee = await client.query(
      `INSERT INTO employee_profiles
       (user_id, department_id, phone, address, designation, salary, profile_image, resume_file, document_file)
       VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9)
       RETURNING *`,
      [
        user_id,
        department_id || null,
        phone || null,
        address || null,
        designation || null,
        salary || null,
        profile_image || null,
        resume_file || null,
        document_file || null
      ]
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
router.get("/", authorize("Admin"), async (req, res) => {
  try {
    const employees = await pool.query(
      `SELECT
        ep.id,
        ep.user_id,
        ep.department_id,
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
       INNER JOIN users u ON ep.user_id = u.id
       LEFT JOIN departments d ON ep.department_id = d.id
       ORDER BY ep.id`
    );

    res.json(employees.rows);

  } catch (error) {
    console.error(error);
    res.status(500).json("Server Error");
  }
});

// Update Employee
// Get My Profile (Employee)
router.get("/me", async (req, res) => {
  try {
    const employee = await pool.query(
      `SELECT ep.*, u.name, u.email
       FROM employee_profiles ep
       INNER JOIN users u ON ep.user_id = u.id
       WHERE ep.user_id = $1`,
      [req.user.id]
    );

    res.json(employee.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json("Server Error");
  }
});

// Get Single Employee
router.get("/:id", authorize("Admin"), async (req, res) => {
  try {
    const employee = await pool.query(
      `SELECT ep.*, u.name, u.email
       FROM employee_profiles ep
       INNER JOIN users u ON ep.user_id = u.id
       WHERE ep.id = $1`,
      [req.params.id]
    );

    res.json(employee.rows[0]);

  } catch (error) {
    console.error(error);
    res.status(500).json("Server Error");
  }
});

// Update Employee
router.put("/:id", authorize("Admin"), async (req, res) => {
  const client = await pool.connect();

  try {
    const {
      name,
      email,
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

    const employeeRes = await client.query(
      `SELECT user_id FROM employee_profiles WHERE id = $1`,
      [req.params.id]
    );

    if (employeeRes.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ message: "Employee not found" });
    }
    const userId = employeeRes.rows[0].user_id;

    await client.query(
      `UPDATE users SET name = $1, email = $2 WHERE id = $3`,
      [name, email, userId]
    );

    await client.query(
      `UPDATE employee_profiles
       SET
         department_id = $1,
         phone = $2,
         address = $3,
         designation = $4,
         salary = $5,
         profile_image = COALESCE($6, profile_image),
         resume_file = COALESCE($7, resume_file),
         document_file = COALESCE($8, document_file)
       WHERE id = $9`,
      [
        department_id || null,
        phone || null,
        address || null,
        designation || null,
        salary || null,
        profile_image || null,
        resume_file || null,
        document_file || null,
        req.params.id
      ]
    );

    await client.query("COMMIT");
    res.json("Employee Updated");

  } catch (error) {
    await client.query("ROLLBACK");
    console.error(error);
    res.status(500).json("Server Error");
  } finally {
    client.release();
  }
});

// Delete Employee
router.delete("/:id", authorize("Admin"), async (req, res) => {
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
