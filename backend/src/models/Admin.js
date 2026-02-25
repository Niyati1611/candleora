import pool from '../config/database.js';
import bcryptjs from 'bcryptjs';

class Admin {
  static async getByUsername(username) {
    try {
      const connection = await pool.getConnection();
      const [rows] = await connection.query('SELECT * FROM admin_users WHERE username = ?', [username]);
      connection.release();
      return rows[0] || null;
    } catch (error) {
      throw new Error(`Database error: ${error.message}`);
    }
  }

  static async getById(id) {
    try {
      const connection = await pool.getConnection();
      const [rows] = await connection.query('SELECT id, username, email, created_at FROM admin_users WHERE id = ?', [id]);
      connection.release();
      return rows[0] || null;
    } catch (error) {
      throw new Error(`Database error: ${error.message}`);
    }
  }

  static async create(username, password, email) {
    try {
      const hash = await bcryptjs.hash(password, 10);
      const connection = await pool.getConnection();
      const [result] = await connection.query(
        'INSERT INTO admin_users (username, password_hash, email) VALUES (?, ?, ?)',
        [username, hash, email]
      );
      connection.release();
      return result.insertId;
    } catch (error) {
      throw new Error(`Database error: ${error.message}`);
    }
  }

  static async verifyPassword(password, hash) {
    return await bcryptjs.compare(password, hash);
  }
}

export default Admin;
