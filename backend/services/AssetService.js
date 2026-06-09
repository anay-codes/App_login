// Asset Service - Business logic
const AssetRepository = require("../repositories/AssetRepository");
const NotificationRepository = require("../repositories/NotificationRepository");
const AuditRepository = require("../repositories/AuditRepository");

class AssetService {
  async getAllAssets(limit = 100, offset = 0, filters = {}) {
    return await AssetRepository.getAllAssets(limit, offset, filters);
  }

  async getAssetById(id) {
    const asset = await AssetRepository.getAssetById(id);
    if (!asset) {
      throw new Error("Asset not found");
    }
    return asset;
  }

  async createAsset(assetData, userId, ipAddress) {
    const asset = await AssetRepository.createAsset(assetData);

    // Log audit
    await AuditRepository.logChange({
      user_id: userId,
      entity_type: "Asset",
      entity_id: asset.id,
      action: "CREATE",
      new_values: asset,
      ip_address: ipAddress
    });

    return asset;
  }

  async updateAsset(id, assetData, userId, ipAddress) {
    const oldAsset = await this.getAssetById(id);
    const updatedAsset = await AssetRepository.updateAsset(id, assetData);

    // Log audit
    await AuditRepository.logChange({
      user_id: userId,
      entity_type: "Asset",
      entity_id: id,
      action: "UPDATE",
      old_values: oldAsset,
      new_values: updatedAsset,
      changes: assetData,
      ip_address: ipAddress
    });

    return updatedAsset;
  }

  async deleteAsset(id, userId, ipAddress) {
    const asset = await this.getAssetById(id);
    await AssetRepository.deleteAsset(id);

    // Log audit
    await AuditRepository.logChange({
      user_id: userId,
      entity_type: "Asset",
      entity_id: id,
      action: "DELETE",
      old_values: asset,
      ip_address: ipAddress
    });

    return true;
  }

  async getAssetStats() {
    const total = await AssetRepository.getAssetCount();
    return { total };
  }
}

module.exports = new AssetService();
