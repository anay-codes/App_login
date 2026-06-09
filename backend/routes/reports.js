const express = require("express");
const router  = express.Router();
const ReportService = require("../services/ReportService");

// helper — send CSV as a downloadable file
const sendCSV = (res, csvString, filename) => {
  res.setHeader("Content-Type", "text/csv");
  res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
  res.send(csvString);
};

// ── GET /api/reports/employees?department_id=&format=csv|json
router.get("/employees", async (req, res) => {
  try {
    const { department_id, employee_id, format = "json" } = req.query;
    const data = await ReportService.getEmployeeReport({ department_id, employee_id });

    if (format === "csv") {
      const headers = ["id", "name", "email", "department_name", "active_assets", "returned_assets", "asset_types"];
      const csv = await ReportService.formatAsCSV(data, headers);
      return sendCSV(res, csv, "employee_report.csv");
    }

    res.json({ success: true, data, count: data.length });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── GET /api/reports/leaves?department_id=&format=csv|json
router.get("/leaves", async (req, res) => {
  try {
    const { department_id, format = "json" } = req.query;
    const data = await ReportService.getLeaveReport({ department_id });

    if (format === "csv") {
      const headers = ["id", "name", "email", "total_leaves", "approved_leaves", "pending_leaves", "rejected_leaves"];
      const csv = await ReportService.formatAsCSV(data, headers);
      return sendCSV(res, csv, "leave_report.csv");
    }

    res.json({ success: true, data, count: data.length });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── GET /api/reports/assets?asset_type=&status=&department_id=&format=csv|json
router.get("/assets", async (req, res) => {
  try {
    const { asset_type, status, department_id, format = "json" } = req.query;
    const data = await ReportService.getAssetReport({ asset_type, status, department_id });

    if (format === "csv") {
      const headers = ["id", "asset_name", "asset_type", "serial_number", "status", "allocated_to", "department_name", "allocated_date", "condition_on_allocation"];
      const csv = await ReportService.formatAsCSV(data, headers);
      return sendCSV(res, csv, "asset_report.csv");
    }

    res.json({ success: true, data, count: data.length });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── GET /api/reports/department-stats
router.get("/department-stats", async (req, res) => {
  try {
    const data = await ReportService.getDepartmentStats();
    res.json({ success: true, data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
