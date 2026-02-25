import pool from '../config/database.js';

class Settings {
  static async get() {
    try {
      const connection = await pool.getConnection();
      const [rows] = await connection.query('SELECT id, site_title, updated_at FROM site_settings WHERE id = 1 LIMIT 1');
      connection.release();
      return rows[0] || null;
    } catch (err) {
      throw new Error(`Database error: ${err.message}`);
    }
  }

  // update one or more fields; returns updated row
  static async update({ site_title } = {}) {
    try {
      const connection = await pool.getConnection();

      // Build dynamic query
      const fields = [];
      const values = [];
      if (typeof site_title !== 'undefined') {
        fields.push('site_title = ?');
        values.push(site_title);
      }
      // only site_title is supported

      if (fields.length === 0) {
        connection.release();
        return await Settings.get();
      }

      const sql = `INSERT INTO site_settings (id, ${fields.map(f => f.split(' = ')[0]).join(', ')}) VALUES (1, ${fields.map(()=>'?').join(', ')}) ON DUPLICATE KEY UPDATE ${fields.join(', ')}`;
      // When inserting we need values twice for insert + update; for our placeholders we use values for insert and values again for update
      const params = [...values, ...values];
      await connection.query(sql, params);
      connection.release();
      return await Settings.get();
    } catch (err) {
      throw new Error(`Database error: ${err.message}`);
    }
  }
}

export default Settings;
