// Asset Allocation Repository
const pool = require("../config/db");

class AssetAllocationRepository {
  async allocateAsset(allocationData) {
    const result = await pool.query(
      `INSERT INTO asset_allocations 
       (asset_id, employee_id, allocated_date, condition_on_allocation, notes)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [
        allocationData.asset_id,
        allocationData.employee_id,
        allocationData.allocated_date || new Date().toISOString().split('T')[0],
        allocationData.condition_on_allocation || 'Good',
        allocationData.notes
      ]
    );
    return result.rows[0];
  }

  async returnAsset(allocationId, returnData) {
    const result = await pool.query(
      `UPDATE asset_allocations 
       SET returned_date = $1, condition_on_return = $2, is_active = FALSE
       WHERE id = $3
       RETURNING *`,
      [
        returnData.returned_date || new Date().toISOString().split('T')[0],
        returnData.condition_on_return,
        allocationId
      ]
    );
    return result.rows[0];
  }

  async getActiveAllocations(employeeId) {
    const result = await pool.query(
      `SELECT * FROM active_allocations_view WHERE employee_id = $1`,
      [employeeId]
    );
    return result.rows;
  }

  async getEmployeeAssetHistory(employeeId, limit = 50, offset = 0) {
    const result = await pool.query(
      `SELECT * FROM asset_allocations 
       WHERE employee_id = $1 
       ORDER BY allocated_date DESC
       LIMIT $2 OFFSET $3`,
      [employeeId, limit, offset]
    );
    return result.rows;
  }

  async getAllAllocations(limit = 100, offset = 0) {
    const result = await pool.query(
      `SELECT aa.id, aa.employee_id, aa.asset_id, a.asset_name, a.asset_type,
              a.serial_number, u.name AS employee_name, u.email, ep.designation,
              d.department_name, aa.allocated_date, aa.condition_on_allocation, aa.notes
       FROM asset_allocations aa
       JOIN assets a ON aa.asset_id = a.id
       JOIN employee_profiles ep ON aa.employee_id = ep.id
       JOIN users u ON ep.user_id = u.id
       LEFT JOIN departments d ON ep.department_id = d.id
       WHERE aa.is_active = TRUE AND aa.returned_date IS NULL
       ORDER BY allocated_date DESC
       LIMIT $1 OFFSET $2`,
      [limit, offset]
    );
    return result.rows;
  }

  async getAssetAllocationById(id) {
    const result = await pool.query(
      "SELECT * FROM asset_allocations WHERE id = $1",
      [id]
    );
    return result.rows[0];
  }
}

module.exports = new AssetAllocationRepository();
