// backend/services/AttendanceService.js
const AttendanceRepository = require('../repositories/AttendanceRepository');

class AttendanceService {
  
  async markAttendance(employeeId, data) {
    if (!employeeId) throw new Error('employee_id is required');
    // Prevent multiple punch-ins same day
    const existing = await AttendanceRepository.getEmployeeTodayAttendance(employeeId);
    if (existing && existing.punch_in) {
      throw new Error('Already punched in today');
    }
    return await AttendanceRepository.markAttendance(employeeId, data);
  }

  async getEmployeeTodayAttendance(employeeId) {
    return await AttendanceRepository.getEmployeeTodayAttendance(employeeId);
  }

  async getAllAttendance(filter = {}) {
    return await AttendanceRepository.getAllAttendance(filter);
  }

  async updateAttendance(id, data) {
    if (data.status && !['Present', 'Absent', 'Leave'].includes(data.status)) {
      throw new Error('Invalid attendance status');
    }
    const updated = await AttendanceRepository.updateAttendance(id, data);
    if (!updated) throw new Error('Attendance record not found');
    return updated;
  }

  async getMonthlySummary(year, month) {
    return await AttendanceRepository.getMonthlySummary(year, month);
  }
}

module.exports = new AttendanceService();
