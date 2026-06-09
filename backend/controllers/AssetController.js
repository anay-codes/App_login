// Asset Controller
const AssetService = require("../services/AssetService");
const { AppError } = require("../middleware/errorHandler");

class AssetController {
  async getAllAssets(req, res, next) {
    try {
      const { limit = 100, offset = 0, status, asset_type } = req.query;
      const assets = await AssetService.getAllAssets(
        parseInt(limit),
        parseInt(offset),
        { status, asset_type }
      );
      res.json({
        success: true,
        data: assets,
        count: assets.length
      });
    } catch (error) {
      next(error);
    }
  }

  async getAssetById(req, res, next) {
    try {
      const asset = await AssetService.getAssetById(req.params.id);
      res.json({
        success: true,
        data: asset
      });
    } catch (error) {
      next(new AppError(error.message, 404));
    }
  }

  async createAsset(req, res, next) {
    try {
      const asset = await AssetService.createAsset(
        req.body,
        req.user?.id,
        req.ip
      );
      res.status(201).json({
        success: true,
        message: "Asset created",
        data: asset
      });
    } catch (error) {
      next(error);
    }
  }

  async updateAsset(req, res, next) {
    try {
      const asset = await AssetService.updateAsset(
        req.params.id,
        req.body,
        req.user?.id,
        req.ip
      );
      res.json({
        success: true,
        message: "Asset updated",
        data: asset
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteAsset(req, res, next) {
    try {
      await AssetService.deleteAsset(
        req.params.id,
        req.user?.id,
        req.ip
      );
      res.json({
        success: true,
        message: "Asset deleted"
      });
    } catch (error) {
      next(error);
    }
  }

  async getAssetStats(req, res, next) {
    try {
      const stats = await AssetService.getAssetStats();
      res.json({
        success: true,
        data: stats
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AssetController();
