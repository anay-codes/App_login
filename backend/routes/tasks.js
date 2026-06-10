const express = require("express");
const router = express.Router();
const pool = require("../config/db");
const jwt = require("jsonwebtoken");

const getUser = (req) => {
  const token = req.headers.authorization?.split(" ")[1];
  return jwt.verify(token, process.env.JWT_SECRET);
};

// Admin - Get all tasks
router.get("/", async (req, res) => {
  try {
    const tasks = await pool.query(
      `SELECT t.*, u.name AS assigned_to_name
       FROM tasks t
       LEFT JOIN users u ON t.assigned_to = u.id
       ORDER BY t.created_at DESC`
    );
    res.json(tasks.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json("Server Error");
  }
});

// Employee - Get my tasks
router.get("/my", async (req, res) => {
  try {
    const decoded = getUser(req);
    const tasks = await pool.query(
      `SELECT * FROM tasks WHERE assigned_to = $1 ORDER BY created_at DESC`,
      [decoded.id]
    );
    res.json(tasks.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json("Server Error");
  }
});

// Admin - Create task
router.post("/", async (req, res) => {
  try {
    const decoded = getUser(req);
    const { title, description, assigned_to } = req.body;

    const task = await pool.query(
      `INSERT INTO tasks (title, description, assigned_to, created_by)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [title, description || null, assigned_to, decoded.id]
    );
    res.json(task.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json("Server Error");
  }
});

// Employee - Mark task as done
router.put("/:id/done", async (req, res) => {
  try {
    await pool.query(
      `UPDATE tasks SET status = 'done' WHERE id = $1`,
      [req.params.id]
    );
    res.json("Task marked as done");
  } catch (error) {
    console.error(error);
    res.status(500).json("Server Error");
  }
});

// Admin - Delete task
router.delete("/:id", async (req, res) => {
  try {
    await pool.query("DELETE FROM tasks WHERE id = $1", [req.params.id]);
    res.json("Task Deleted");
  } catch (error) {
    console.error(error);
    res.status(500).json("Server Error");
  }
});

module.exports = router;