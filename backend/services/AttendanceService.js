// backend/services/AttendanceService.js
const AttendanceRepository = require('../repositories/AttendanceRepository');

class AttendanceService {
  
  async markAttendance(employeeId, data) {
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
    return await AttendanceRepository.updateAttendance(id, data);
  }

  async getMonthlySummary(year, month) {
    return await AttendanceRepository.getMonthlySummary(year, month);
  }
}

module.exports = new AttendanceService();