const express = require("express");
const router = express.Router();
const pool = require("../config/db");
const { authorize } = require("../middleware/auth");

// Admin - Get all tasks
router.get("/", authorize("Admin"), async (req, res) => {
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
    const tasks = await pool.query(
      `SELECT * FROM tasks WHERE assigned_to = $1 ORDER BY created_at DESC`,
      [req.user.id]
    );
    res.json(tasks.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json("Server Error");
  }
});

// Admin - Create task
router.post("/", authorize("Admin"), async (req, res) => {
  try {
    const { title, description, assigned_to } = req.body;
    if (!title || !assigned_to) {
      return res.status(400).json({ message: "title and assigned_to are required" });
    }

    const task = await pool.query(
      `INSERT INTO tasks (title, description, assigned_to, created_by)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [title, description || null, assigned_to, req.user.id]
    );
    res.json(task.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json("Server Error");
  }
});

// Employee - Mark task as done
router.put("/:id/done", authorize("Employee"), async (req, res) => {
  try {
    const result = await pool.query(
      `UPDATE tasks SET status = 'done' WHERE id = $1 AND assigned_to = $2 RETURNING id`,
      [req.params.id, req.user.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.json("Task marked as done");
  } catch (error) {
    console.error(error);
    res.status(500).json("Server Error");
  }
});

// Admin - Delete task
router.delete("/:id", authorize("Admin"), async (req, res) => {
  try {
    await pool.query("DELETE FROM tasks WHERE id = $1", [req.params.id]);
    res.json("Task Deleted");
  } catch (error) {
    console.error(error);
    res.status(500).json("Server Error");
  }
});

module.exports = router;
