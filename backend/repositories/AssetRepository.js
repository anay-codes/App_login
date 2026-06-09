// Asset Repository - Data access layer
const pool = require("../config/db");

class AssetRepository {
  async getAllAssets(limit = 100, offset = 0, filters = {}) {
    let query = "SELECT * FROM assets WHERE 1=1";
    const values = [];
    let paramCount = 0;

    if (filters.status) {
      paramCount++;
      query += ` AND status = $${paramCount}`;
      values.push(filters.status);
    }

    if (filters.asset_type) {
      paramCount++;
      query += ` AND asset_type = $${paramCount}`;
      values.push(filters.asset_type);
    }

    query += " ORDER BY id DESC LIMIT $" + (paramCount + 1) + " OFFSET $" + (paramCount + 2);
    values.push(limit, offset);

    const result = await pool.query(query, values);
    return result.rows;
  }

  async getAssetById(id) {
    const result = await pool.query("SELECT * FROM assets WHERE id = $1", [id]);
    return result.rows[0];
  }

  async createAsset(assetData) {
    const result = await pool.query(
      `INSERT INTO assets 
       (asset_type, asset_name, serial_number, model, purchase_date, purchase_cost, description)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [
        assetData.asset_type,
        assetData.asset_name,
        assetData.serial_number,
        assetData.model,
        assetData.purchase_date,
        assetData.purchase_cost,
        assetData.description
      ]
    );
    return result.rows[0];
  }

  async updateAsset(id, assetData) {
    const updates = [];
    const values = [];
    let paramCount = 1;

    Object.keys(assetData).forEach(key => {
      updates.push(`${key} = $${paramCount}`);
      values.push(assetData[key]);
      paramCount++;
    });

    values.push(id);
    const query = `UPDATE assets SET ${updates.join(", ")}, updated_at = CURRENT_TIMESTAMP WHERE id = $${paramCount} RETURNING *`;
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  async deleteAsset(id) {
    await pool.query("DELETE FROM assets WHERE id = $1", [id]);
    return true;
  }

  async getAssetCount() {
    const result = await pool.query("SELECT COUNT(*) as count FROM assets");
    return parseInt(result.rows[0].count);
  }
}

module.exports = new AssetRepository();
