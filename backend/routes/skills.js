const express = require("express");
const router = express.Router();
const pool = require("../config/db");

// Get all skills
router.get("/", async (req, res) => {
  try {
    const skills = await pool.query(
      "SELECT * FROM skills ORDER BY id"
    );
    res.json(skills.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json("Server Error");
  }
});

// Add skill
router.post("/", async (req, res) => {
  try {
    const { skill_name } = req.body;
    const skill = await pool.query(
      "INSERT INTO skills(skill_name) VALUES($1) RETURNING *",
      [skill_name]
    );
    res.json(skill.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json("Server Error");
  }
});

// Update skill
router.put("/:id", async (req, res) => {
  try {
    const { skill_name } = req.body;
    await pool.query(
      "UPDATE skills SET skill_name = $1 WHERE id = $2",
      [skill_name, req.params.id]
    );
    res.json("Skill Updated");
  } catch (error) {
    console.error(error);
    res.status(500).json("Server Error");
  }
});

// Delete skill
router.delete("/:id", async (req, res) => {
  try {
    await pool.query(
      "DELETE FROM skills WHERE id = $1",
      [req.params.id]
    );
    res.json("Skill Deleted");
  } catch (error) {
    console.error(error);
    res.status(500).json("Server Error");
  }
});

module.exports = router;