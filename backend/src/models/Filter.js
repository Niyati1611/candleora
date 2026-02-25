// import pool from '../config/database.js';

// class Filter {
//   static async getAll(includeDisabled = false) {
//     try {
//       const connection = await pool.getConnection();
//       const sql = includeDisabled
//         ? 'SELECT id, name, `key`, enabled, created_at, updated_at FROM filters ORDER BY id'
//         : 'SELECT id, name, `key`, enabled, created_at, updated_at FROM filters WHERE enabled = 1 ORDER BY id';
//       const [rows] = await connection.query(sql);
//       connection.release();
//       return rows;
//     } catch (error) {
//       throw new Error(`Database error: ${error.message}`);
//     }
//   }

//   static async getById(id) {
//     try {
//       const connection = await pool.getConnection();
//       const [rows] = await connection.query('SELECT id, name, `key`, enabled, created_at, updated_at FROM filters WHERE id = ?', [id]);
//       connection.release();
//       return rows[0] || null;
//     } catch (error) {
//       throw new Error(`Database error: ${error.message}`);
//     }
//   }

//   static async create({ name, key, enabled = 1 }) {
//     try {
//       const connection = await pool.getConnection();
//       const [result] = await connection.query(
//         'INSERT INTO filters (name, `key`, enabled) VALUES (?, ?, ?)',
//         [name, key, enabled]
//       );
//       connection.release();
//       return result.insertId;
//     } catch (error) {
//       throw new Error(`Database error: ${error.message}`);
//     }
//   }

//   static async update(id, { name, key, enabled } = {}) {
//     try {
//       const connection = await pool.getConnection();
//       const fields = [];
//       const params = [];
//       if (typeof name !== 'undefined') { fields.push('name = ?'); params.push(name); }
//       if (typeof key !== 'undefined') { fields.push('`key` = ?'); params.push(key); }
//       if (typeof enabled !== 'undefined') { fields.push('enabled = ?'); params.push(enabled); }
//       if (fields.length === 0) {
//         connection.release();
//         return await Filter.getById(id);
//       }
//       const sql = `UPDATE filters SET ${fields.join(', ')} WHERE id = ?`;
//       params.push(id);
//       await connection.query(sql, params);
//       connection.release();
//       return await Filter.getById(id);
//     } catch (error) {
//       throw new Error(`Database error: ${error.message}`);
//     }
//   }

//   static async delete(id) {
//     try {
//       const connection = await pool.getConnection();
//       const [result] = await connection.query('DELETE FROM filters WHERE id = ?', [id]);
//       connection.release();
//       return result.affectedRows > 0;
//     } catch (error) {
//       throw new Error(`Database error: ${error.message}`);
//     }
//   }
// }

// export default Filter;


import pool from '../config/database.js';

class Filter {
  static async getAll(includeDisabled = false) {
    try {
      const connection = await pool.getConnection();
      const sql = includeDisabled
        ? 'SELECT id, name, filter_key, enabled, created_at, updated_at FROM filters ORDER BY id'
        : 'SELECT id, name, filter_key, enabled, created_at, updated_at FROM filters WHERE enabled = 1 ORDER BY id';
      const [rows] = await connection.query(sql);
      connection.release();
      return rows;
    } catch (error) {
      throw new Error(`Database error: ${error.message}`);
    }
  }

  static async getById(id) {
    try {
      const connection = await pool.getConnection();
      const [rows] = await connection.query(
        'SELECT id, name, filter_key, enabled, created_at, updated_at FROM filters WHERE id = ?',
        [id]
      );
      connection.release();
      return rows[0] || null;
    } catch (error) {
      throw new Error(`Database error: ${error.message}`);
    }
  }

  static async create({ name, filter_key, enabled = 1 }) {
    if (typeof filter_key === 'undefined' || filter_key === null) {
      throw new Error("'filter_key' is required and cannot be null");
    }
    try {
      const connection = await pool.getConnection();
      const [result] = await connection.query(
        'INSERT INTO filters (name, filter_key, enabled) VALUES (?, ?, ?)',
        [name, filter_key, enabled]
      );
      connection.release();
      return result.insertId;
    } catch (error) {
      throw new Error(`Database error: ${error.message}`);
    }
  }

  static async update(id, { name, filter_key, enabled } = {}) {
    try {
      const connection = await pool.getConnection();
      const fields = [];
      const params = [];
      if (typeof name !== 'undefined') { fields.push('name = ?'); params.push(name); }
      if (typeof filter_key !== 'undefined') { fields.push('filter_key = ?'); params.push(filter_key); }
      if (typeof enabled !== 'undefined') { fields.push('enabled = ?'); params.push(enabled); }
      if (fields.length === 0) {
        connection.release();
        return await Filter.getById(id);
      }
      const sql = `UPDATE filters SET ${fields.join(', ')} WHERE id = ?`;
      params.push(id);
      await connection.query(sql, params);
      connection.release();
      return await Filter.getById(id);
    } catch (error) {
      throw new Error(`Database error: ${error.message}`);
    }
  }

  static async delete(id) {
    try {
      const connection = await pool.getConnection();
      const [result] = await connection.query('DELETE FROM filters WHERE id = ?', [id]);
      connection.release();
      return result.affectedRows > 0;
    } catch (error) {
      throw new Error(`Database error: ${error.message}`);
    }
  }
}

export default Filter;