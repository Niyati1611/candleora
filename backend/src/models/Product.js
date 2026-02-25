import pool from '../config/database.js';

class Product {
  static async getAll() {
    try {
      const connection = await pool.getConnection();
      const [rows] = await connection.query('SELECT * FROM products');
      connection.release();
      return rows;
    } catch (error) {
      throw new Error(`Database error: ${error.message}`);
    }
  }

  static async getById(id) {
    try {
      const connection = await pool.getConnection();
      const [rows] = await connection.query('SELECT * FROM products WHERE id = ?', [id]);
      connection.release();
      return rows[0] || null;
    } catch (error) {
      throw new Error(`Database error: ${error.message}`);
    }
  }

  static async getByCategory(category) {
    try {
      const connection = await pool.getConnection();
      const [rows] = await connection.query('SELECT * FROM products WHERE category = ?', [category]);
      connection.release();
      return rows;
    } catch (error) {
      throw new Error(`Database error: ${error.message}`);
    }
  }

  // Get products marked as new arrivals (not expired)
  static async getNewArrivals() {
    try {
      const connection = await pool.getConnection();
      const [rows] = await connection.query(
        `SELECT * FROM products 
         WHERE is_new_arrival = 1 
         AND (new_arrival_expires_at IS NULL OR new_arrival_expires_at >= CURDATE())
         ORDER BY created_at DESC`
      );
      connection.release();
      return rows;
    } catch (error) {
      throw new Error(`Database error: ${error.message}`);
    }
  }

  // Get products added in the last X days (auto-detection)
  static async getRecentlyAdded(days = 30) {
    try {
      const connection = await pool.getConnection();
      const [rows] = await connection.query(
        `SELECT * FROM products 
         WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL ? DAY)
         ORDER BY created_at DESC`,
        [days]
      );
      connection.release();
      return rows;
    } catch (error) {
      throw new Error(`Database error: ${error.message}`);
    }
  }

  // Update product's new arrival status
  static async updateNewArrival(id, isNewArrival, expiresAt = null) {
    try {
      const connection = await pool.getConnection();
      const [result] = await connection.query(
        'UPDATE products SET is_new_arrival = ?, new_arrival_expires_at = ? WHERE id = ?',
        [isNewArrival ? 1 : 0, expiresAt, id]
      );
      connection.release();
      return result.affectedRows > 0;
    } catch (error) {
      throw new Error(`Database error: ${error.message}`);
    }
  }

  // Auto-remove expired new arrivals (for cron job)
  static async removeExpiredNewArrivals() {
    try {
      const connection = await pool.getConnection();
      const [result] = await connection.query(
        `UPDATE products 
         SET is_new_arrival = 0 
         WHERE is_new_arrival = 1 
         AND new_arrival_expires_at < CURDATE()`
      );
      connection.release();
      return result.affectedRows;
    } catch (error) {
      throw new Error(`Database error: ${error.message}`);
    }
  }

  static async create(data) {
    try {
      const connection = await pool.getConnection();
      const [result] = await connection.query(
        'INSERT INTO products (name, description, price, discount_price, category, image_url, images, stock, is_new_arrival, new_arrival_expires_at, filter_selections) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [data.name, data.description, data.price, data.discount_price || null, data.category, data.image_url, JSON.stringify(data.images || []), data.stock, data.is_new_arrival ? 1 : 0, data.new_arrival_expires_at || null, JSON.stringify(data.filter_selections || null)]
      );
      connection.release();
      return result.insertId;
    } catch (error) {
      throw new Error(`Database error: ${error.message}`);
    }
  }

  static async update(id, data) {
    try {
      const connection = await pool.getConnection();
      const [result] = await connection.query(
        'UPDATE products SET name=?, description=?, price=?, discount_price=?, category=?, image_url=?, images=?, stock=?, is_new_arrival=?, new_arrival_expires_at=?, filter_selections=? WHERE id=?',
        [data.name, data.description, data.price, data.discount_price || null, data.category, data.image_url, JSON.stringify(data.images || []), data.stock, data.is_new_arrival ? 1 : 0, data.new_arrival_expires_at || null, JSON.stringify(data.filter_selections || null), id]
      );
      connection.release();
      return result.affectedRows > 0;
    } catch (error) {
      throw new Error(`Database error: ${error.message}`);
    }
  }

  static async delete(id) {
    try {
      const connection = await pool.getConnection();
      const [result] = await connection.query('DELETE FROM products WHERE id = ?', [id]);
      connection.release();
      return result.affectedRows > 0;
    } catch (error) {
      throw new Error(`Database error: ${error.message}`);
    }
  }
}

export default Product;
