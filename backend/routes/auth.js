const express = require("express");
const router = express.Router();
const pool = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Employee signup - creates both users and employee_profiles in a transaction
router.post("/signup", async (req, res) => {
  const client = await pool.connect();
  try {
    const { name, email, password, phone, address, designation, department_id } = req.body;

    // Basic validation
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email and password are required" });
    }

    // Check existing user
    const userExist = await client.query("SELECT * FROM users WHERE email=$1", [email]);
    if (userExist.rows.length > 0) {
      return res.status(400).json({ message: "Email already exists" });
    }

    await client.query("BEGIN");

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await client.query(
      `INSERT INTO users(name,email,password,role)
       VALUES($1,$2,$3,$4)
       RETURNING *`,
      [name, email, hashedPassword, 'Employee']
    );

    const userId = newUser.rows[0].id;

    // Create employee profile (fields optional)
    const employee = await client.query(
      `INSERT INTO employee_profiles (user_id, department_id, phone, address, designation)
       VALUES ($1,$2,$3,$4,$5)
       RETURNING *`,
      [userId, department_id || null, phone || null, address || null, designation || null]
    );

    await client.query("COMMIT");

    res.status(201).json({ message: "User Registered", user: newUser.rows[0], profile: employee.rows[0] });
  } catch (error) {
    try { await client.query("ROLLBACK"); } catch (e) { /* ignore */ }
    console.error("SIGNUP ERROR:", error);
    res.status(500).json(error.message);
  } finally {
    client.release();
  }
});

// Login - returns JWT with role and profile info
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const userRes = await pool.query("SELECT * FROM users WHERE email=$1", [email]);
    if (userRes.rows.length === 0) {
      return res.status(400).json({ message: "User not found" });
    }

    const user = userRes.rows[0];
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ message: "Wrong Password" });
    }

    // Fetch employee profile if exists
    const profileRes = await pool.query("SELECT * FROM employee_profiles WHERE user_id = $1", [user.id]);
    const profile = profileRes.rows[0] || null;

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1d" });

    res.json({ message: "Login Success", token, role: user.role, profile });
  } catch (error) {
    console.log("LOGIN ERROR:", error);
    res.status(500).json(error.message);
  }
});

module.exports = router;