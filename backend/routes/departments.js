const express = require("express");
const router = express.Router();
const pool = require("../config/db");

// Get all departments
router.get("/", async (req, res) => {
  try {
    const departments = await pool.query(
      "SELECT * FROM departments ORDER BY id"
    );
    res.json(departments.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json("Server Error");
  }
});

// Add department
router.post("/", async (req, res) => {
  try {
    const { department_name } = req.body;
    const department = await pool.query(
      "INSERT INTO departments(department_name) VALUES($1) RETURNING *",
      [department_name]
    );
    res.json(department.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json("Server Error");
  }
});

// Update department
router.put("/:id", async (req, res) => {
  try {
    const { department_name } = req.body;
    await pool.query(
      "UPDATE departments SET department_name = $1 WHERE id = $2",
      [department_name, req.params.id]
    );
    res.json("Department Updated");
  } catch (error) {
    console.error(error);
    res.status(500).json("Server Error");
  }
});

// Delete department
router.delete("/:id", async (req, res) => {
  try {
    await pool.query(
      "DELETE FROM departments WHERE id = $1",
      [req.params.id]
    );
    res.json("Department Deleted");
  } catch (error) {
    console.error(error);
    res.status(500).json("Server Error");
  }
});

module.exports = router;