const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, ".env") });
const pool = require("./config/db");
const fs = require("fs");

async function initializeSchema() {
  try {
    const base = fs.readFileSync(path.resolve(__dirname, "./db/base.sql"), "utf-8");
    const schema = fs.readFileSync(path.resolve(__dirname, "./db/schema.sql"), "utf-8");
    const fullSql = base + "\n" + schema;
    const statements = fullSql.split(";").filter(s => s.trim().length > 0);
    
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
