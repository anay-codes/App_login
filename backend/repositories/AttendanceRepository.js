// backend/repositories/AttendanceRepository.js
const pool = require("../config/db");

class AttendanceRepository {
  
  async markAttendance(employeeId, data) {
    const { punch_in, status = 'Present', notes } = data;
    
    const result = await pool.query(`
      INSERT INTO attendance 
        (employee_id, date, punch_in, status, marked_by, notes)
      VALUES ($1, CURRENT_DATE, $2, $3, $4, $5)
      ON CONFLICT (employee_id, date) 
      DO UPDATE SET 
        punch_in = COALESCE(EXCLUDED.punch_in, attendance.punch_in),
        status = EXCLUDED.status,
        marked_by = EXCLUDED.marked_by,
        notes = EXCLUDED.notes,
        updated_at = CURRENT_TIMESTAMP
      RETURNING *
    `, [employeeId, punch_in, status, 'employee', notes]);
    
    return result.rows[0];
  }

  async getEmployeeTodayAttendance(employeeId) {
    const result = await pool.query(`
      SELECT * FROM attendance 
      WHERE employee_id = $1 AND date = CURRENT_DATE
    `, [employeeId]);
    return result.rows[0];
  }

  async getAttendanceByEmployeeAndDate(employeeId, date) {
    const result = await pool.query(`
      SELECT * FROM attendance 
      WHERE employee_id = $1 AND date = $2
    `, [employeeId, date]);
    return result.rows[0];
  }

  async getAllAttendance(filter = {}) {
    let query = `
     SELECT a.*, u.name AS full_name, ep.designation
FROM attendance a
JOIN employee_profiles ep ON a.employee_id = ep.id
JOIN users u ON ep.user_id = u.id
WHERE 1 = 1
    `;
    const values = [];
    let paramCount = 0;

    if (filter.start_date) {
      paramCount++;
      query += ` AND a.date >= $${paramCount}`;
      values.push(filter.start_date);
    }
    if (filter.end_date) {
      paramCount++;
      query += ` AND a.date <= $${paramCount}`;
      values.push(filter.end_date);
    }
    if (filter.employee_id) {
      paramCount++;
      query += ` AND a.employee_id = $${paramCount}`;
      values.push(filter.employee_id);
    }

    query += " ORDER BY a.date DESC, u.name";
    
    const result = await pool.query(query, values);
    return result.rows;
  }

 async updateAttendance(id, data) {
  const { status, notes, finalized } = data;

  const result = await pool.query(`
    UPDATE attendance
    SET
      status = COALESCE($1, status),
      notes = COALESCE($2, notes),
      finalized = COALESCE($3, finalized),
      marked_by = 'admin',
      updated_at = CURRENT_TIMESTAMP,
      finalized_at = CASE
        WHEN $3 = true THEN CURRENT_TIMESTAMP
        ELSE finalized_at
      END
    WHERE id = $4
    RETURNING *
  `, [status, notes, finalized, id]);

  return result.rows[0];
}

  async getMonthlySummary(year, month) {
    const result = await pool.query(`
      SELECT 
        u.name AS full_name,
        COUNT(CASE WHEN a.status = 'Present' THEN 1 END) as present_days,
        COUNT(CASE WHEN a.status = 'Absent' THEN 1 END) as absent_days,
        COUNT(CASE WHEN a.status = 'Leave' THEN 1 END) as leave_days
      FROM employee_profiles ep
      JOIN users u ON ep.user_id = u.id
      LEFT JOIN attendance a ON ep.id = a.employee_id 
        AND EXTRACT(YEAR FROM a.date) = $1 
        AND EXTRACT(MONTH FROM a.date) = $2
      GROUP BY ep.id, u.name
      ORDER BY u.name
    `, [year, month]);
    return result.rows;
  }
}

module.exports = new AttendanceRepository();
