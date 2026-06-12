const express = require("express");
const router = express.Router();
const AssetService = require("../services/AssetService");
const AssetAllocationService = require("../services/AssetAllocationService");
const AssetAllocationRepository = require("../repositories/AssetAllocationRepository");
const AuditRepository = require("../repositories/AuditRepository");
const pool = require("../config/db");
const { authorize } = require("../middleware/auth");

// ── GET /api/assets  (list with optional ?status=&asset_type=&limit=&offset=)
router.get("/", authorize("Admin"), async (req, res) => {
  try {
    const { limit = 100, offset = 0, status, asset_type } = req.query;
    const assets = await AssetService.getAllAssets(
      parseInt(limit),
      parseInt(offset),
      { status, asset_type }
    );
    res.json({ success: true, data: assets, count: assets.length });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── GET /api/assets/stats
router.get("/stats", authorize("Admin"), async (req, res) => {
  try {
    const total    = await pool.query("SELECT COUNT(*) FROM assets");
    const avail    = await pool.query("SELECT COUNT(*) FROM assets WHERE status = 'Available'");
    const allocated = await pool.query("SELECT COUNT(*) FROM assets WHERE status = 'Allocated'");
    res.json({
      success: true,
      data: {
        total:     parseInt(total.rows[0].count),
        available: parseInt(avail.rows[0].count),
        allocated: parseInt(allocated.rows[0].count),
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── GET /api/assets/allocations  (all active allocations from view)
router.get("/allocations", async (req, res) => {
  try {
    const { limit = 100, offset = 0 } = req.query;
    const allocations = await AssetAllocationRepository.getAllAllocations(
      parseInt(limit),
      parseInt(offset)
    );
    const data = req.user.role === "Admin"
      ? allocations
      : allocations.filter((allocation) => Number(allocation.employee_id) === Number(req.query.employee_id));
    res.json({ success: true, data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── GET /api/assets/:id
router.get("/:id", authorize("Admin"), async (req, res) => {
  try {
    const asset = await AssetService.getAssetById(req.params.id);
    res.json({ success: true, data: asset });
  } catch (err) {
    res.status(404).json({ success: false, message: err.message });
  }
});

// ── POST /api/assets  (create new asset)
router.post("/", authorize("Admin"), async (req, res) => {
  try {
    const userId = req.body.created_by || null;
    const asset  = await AssetService.createAsset(req.body, userId, req.ip);
    res.status(201).json({ success: true, message: "Asset created", data: asset });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── PUT /api/assets/:id  (update asset)
router.put("/:id", authorize("Admin"), async (req, res) => {
  try {
    const userId = req.body.updated_by || null;
    const asset  = await AssetService.updateAsset(req.params.id, req.body, userId, req.ip);
    res.json({ success: true, message: "Asset updated", data: asset });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── DELETE /api/assets/:id
router.delete("/:id", authorize("Admin"), async (req, res) => {
  try {
    await AssetService.deleteAsset(req.params.id, null, req.ip);
    res.json({ success: true, message: "Asset deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── POST /api/assets/allocate  (allocate asset to employee)
router.post("/allocate", authorize("Admin"), async (req, res) => {
  try {
    const { asset_id, employee_id, allocated_date, condition_on_allocation, notes } = req.body;
    if (!asset_id || !employee_id) {
      return res.status(400).json({ success: false, message: "asset_id and employee_id are required" });
    }
    const allocation = await AssetAllocationService.allocateAsset(
      { asset_id, employee_id, allocated_date, condition_on_allocation, notes },
      null,
      req.ip
    );
    res.status(201).json({ success: true, message: "Asset allocated", data: allocation });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── PUT /api/assets/allocations/:id/return  (return an asset)
router.put("/allocations/:id/return", authorize("Admin"), async (req, res) => {
  try {
    const updated = await AssetAllocationService.returnAsset(
      req.params.id,
      req.body,
      null,
      req.ip
    );
    res.json({ success: true, message: "Asset returned", data: updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
