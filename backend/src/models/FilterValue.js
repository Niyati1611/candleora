import pool from '../config/database.js';

class FilterValue {
  static async getByFilterId(filterId, includeDisabled = false) {
    try {
      const connection = await pool.getConnection();
      const sql = includeDisabled
        ? 'SELECT id, filter_id, value, slug, enabled, sort_order, created_at, updated_at FROM filter_values WHERE filter_id = ? ORDER BY sort_order, id'
        : 'SELECT id, filter_id, value, slug, enabled, sort_order, created_at, updated_at FROM filter_values WHERE filter_id = ? AND enabled = 1 ORDER BY sort_order, id';
      const [rows] = await connection.query(sql, [filterId]);
      connection.release();
      return rows;
    } catch (error) {
      throw new Error(`Database error: ${error.message}`);
    }
  }

  static async create({ filter_id, value, slug = null, enabled = 1, sort_order = 0 }) {
    try {
      const connection = await pool.getConnection();
      const [result] = await connection.query(
        'INSERT INTO filter_values (filter_id, value, slug, enabled, sort_order) VALUES (?, ?, ?, ?, ?)',
        [filter_id, value, slug, enabled, sort_order]
      );
      connection.release();
      return result.insertId;
    } catch (error) {
      throw new Error(`Database error: ${error.message}`);
    }
  }

  static async update(id, { value, slug, enabled, sort_order } = {}) {
    try {
      const connection = await pool.getConnection();
      const fields = [];
      const params = [];
      if (typeof value !== 'undefined') { fields.push('value = ?'); params.push(value); }
      if (typeof slug !== 'undefined') { fields.push('slug = ?'); params.push(slug); }
      if (typeof enabled !== 'undefined') { fields.push('enabled = ?'); params.push(enabled); }
      if (typeof sort_order !== 'undefined') { fields.push('sort_order = ?'); params.push(sort_order); }
      if (fields.length === 0) { connection.release(); return null; }
      const sql = `UPDATE filter_values SET ${fields.join(', ')} WHERE id = ?`;
      params.push(id);
      await connection.query(sql, params);
      connection.release();
      const [rows] = await pool.getConnection().query('SELECT * FROM filter_values WHERE id = ?', [id]);
      return rows[0] || null;
    } catch (error) {
      throw new Error(`Database error: ${error.message}`);
    }
  }

  static async delete(id) {
    try {
      const connection = await pool.getConnection();
      const [result] = await connection.query('DELETE FROM filter_values WHERE id = ?', [id]);
      connection.release();
      return result.affectedRows > 0;
    } catch (error) {
      throw new Error(`Database error: ${error.message}`);
    }
  }
}

export default FilterValue;