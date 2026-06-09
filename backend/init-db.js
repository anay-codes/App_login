require("dotenv").config();
const pool = require("./config/db");
const fs = require("fs");

async function initializeSchema() {
  try {
    const schema = fs.readFileSync("./db/schema.sql", "utf-8");
    const statements = schema.split(";").filter(s => s.trim().length > 0);
    
    let count = 0;
    for (const statement of statements) {
      try {
        await pool.query(statement + ";");
        count++;
      } catch (err) {
        if (err.message.includes("already exists")) {
          count++;
        } else {
          console.error("Error executing statement:", err.message);
        }
      }
    }
    
    console.log(`✓ Database initialized: ${count} statements executed`);
    process.exit(0);
  } catch (error) {
    console.error("Fatal error:", error.message);
    process.exit(1);
  }
}

initializeSchema();
