// Asset Allocation Service
const AssetAllocationRepository = require("../repositories/AssetAllocationRepository");
const AssetRepository = require("../repositories/AssetRepository");
const NotificationRepository = require("../repositories/NotificationRepository");
const AuditRepository = require("../repositories/AuditRepository");
const pool = require("../config/db");

class AssetAllocationService {
  async allocateAsset(allocationData, userId, ipAddress) {
    // Validate asset and employee exist
    const asset = await AssetRepository.getAssetById(allocationData.asset_id);
    const employee = await pool.query(
      "SELECT * FROM employee_profiles WHERE id = $1",
      [allocationData.employee_id]
    );

    if (!asset || employee.rows.length === 0) {
      throw new Error("Asset or Employee not found");
    }

    // Create allocation
    const allocation = await AssetAllocationRepository.allocateAsset(allocationData);

    // Update asset status
    await AssetRepository.updateAsset(allocationData.asset_id, { status: "Allocated" });

    // Get employee user for notification
    const empUser = await pool.query(
      "SELECT user_id FROM employee_profiles WHERE id = $1",
      [allocationData.employee_id]
    );

    // Create notification
    await NotificationRepository.createNotification({
      user_id: empUser.rows[0].user_id,
      title: "Asset Allocated",
      message: `You have been allocated asset: ${asset.asset_name}`,
      notification_type: "ASSET_ALLOCATION",
      related_entity_type: "Asset",
      related_entity_id: asset.id,
      action_url: `/assets/${asset.id}`
    });

    // Log audit
    await AuditRepository.logChange({
      user_id: userId,
      entity_type: "AssetAllocation",
      entity_id: allocation.id,
      action: "CREATE",
      new_values: allocation,
      ip_address: ipAddress
    });

    return allocation;
  }

  async returnAsset(allocationId, returnData, userId, ipAddress) {
    const allocation = await AssetAllocationRepository.getAssetAllocationById(allocationId);
    if (!allocation) {
      throw new Error("Allocation not found");
    }

    const updated = await AssetAllocationRepository.returnAsset(allocationId, returnData);

    // Update asset status back to available
    await AssetRepository.updateAsset(allocation.asset_id, { status: "Available" });

    // Log audit
    await AuditRepository.logChange({
      user_id: userId,
      entity_type: "AssetAllocation",
      entity_id: allocationId,
      action: "UPDATE",
      changes: { returned_date: returnData.returned_date },
      ip_address: ipAddress
    });

    return updated;
  }

  async getActiveAllocations(employeeId) {
    return await AssetAllocationRepository.getActiveAllocations(employeeId);
  }

  async getEmployeeAssetHistory(employeeId, limit, offset) {
    return await AssetAllocationRepository.getEmployeeAssetHistory(employeeId, limit, offset);
  }

  async getAllAllocations(limit, offset) {
    return await AssetAllocationRepository.getAllAllocations(limit, offset);
  }
}

module.exports = new AssetAllocationService();
