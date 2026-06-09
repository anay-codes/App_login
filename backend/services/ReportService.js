// Report Service
const pool = require("../config/db");

class ReportService {
  async getEmployeeReport(filters = {}) {
    let query = `
      SELECT * FROM employee_asset_report_view WHERE 1=1
    `;
    const values = [];
    let paramCount = 0;

    if (filters.department_id) {
      paramCount++;
      query += ` AND department_name = (SELECT department_name FROM departments WHERE id = $${paramCount})`;
      values.push(filters.department_id);
    }

    if (filters.employee_id) {
      paramCount++;
      query += ` AND id = $${paramCount}`;
      values.push(filters.employee_id);
    }

    const result = await pool.query(query, values);
    return result.rows;
  }

  async getLeaveReport(filters = {}) {
    let query = `
      SELECT * FROM leave_summary_view WHERE 1=1
    `;
    const values = [];

    if (filters.department_id) {
      query += ` AND email IN (
        SELECT u.email FROM users u
        JOIN employee_profiles ep ON u.id = ep.user_id
        WHERE ep.department_id = $1
      )`;
      values.push(filters.department_id);
    }

    const result = await pool.query(query, values);
    return result.rows;
  }

  async getAssetReport(filters = {}) {
    let query = `
      SELECT 
        a.id,
        a.asset_name,
        a.asset_type,
        a.serial_number,
        a.status,
        u.name as allocated_to,
        d.department_name,
        aa.allocated_date,
        aa.condition_on_allocation
      FROM assets a
      LEFT JOIN asset_allocations aa ON a.id = aa.asset_id AND aa.is_active = TRUE
      LEFT JOIN employee_profiles ep ON aa.employee_id = ep.id
      LEFT JOIN users u ON ep.user_id = u.id
      LEFT JOIN departments d ON ep.department_id = d.id
      WHERE 1=1
    `;
    const values = [];
    let paramCount = 0;

    if (filters.asset_type) {
      paramCount++;
      query += ` AND a.asset_type = $${paramCount}`;
      values.push(filters.asset_type);
    }

    if (filters.status) {
      paramCount++;
      query += ` AND a.status = $${paramCount}`;
      values.push(filters.status);
    }

    if (filters.department_id) {
      paramCount++;
      query += ` AND d.id = $${paramCount}`;
      values.push(filters.department_id);
    }

    query += " ORDER BY a.id DESC";

    const result = await pool.query(query, values);
    return result.rows;
  }

  async getDepartmentStats() {
    const result = await pool.query("SELECT * FROM department_statistics_view");
    return result.rows;
  }

  async formatAsCSV(data, headers) {
    if (!data || data.length === 0) return "";

    const csv = [headers.join(",")];
    data.forEach(row => {
      const values = headers.map(h => {
        const val = row[h];
        if (val === null) return "";
        if (typeof val === "string" && val.includes(",")) return `"${val}"`;
        return val;
      });
      csv.push(values.join(","));
    });

    return csv.join("\n");
  }
}

module.exports = new ReportService();
