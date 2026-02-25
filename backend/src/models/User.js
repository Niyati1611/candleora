import pool from '../config/database.js'
import bcryptjs from 'bcryptjs'

class User {
  static async create(name, email, password) {
    try {
      const hash = await bcryptjs.hash(password, 10)
      const connection = await pool.getConnection()
      const [result] = await connection.query(
        'INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)',
        [name, email, hash]
      )
      connection.release()
      return result.insertId
    } catch (err) {
      throw new Error(`Database error: ${err.message}`)
    }
  }

  static async getByEmail(email) {
    try {
      const connection = await pool.getConnection()
      const [rows] = await connection.query('SELECT * FROM users WHERE email = ?', [email])
      connection.release()
      return rows[0] || null
    } catch (err) {
      throw new Error(`Database error: ${err.message}`)
    }
  }

  static async getById(id) {
    try {
      const connection = await pool.getConnection()
      const [rows] = await connection.query('SELECT id, name, email, created_at FROM users WHERE id = ?', [id])
      connection.release()
      return rows[0] || null
    } catch (err) {
      throw new Error(`Database error: ${err.message}`)
    }
  }

  static async listAll() {
    // kept for backward compatibility, returns all users unsliced
    try {
      const connection = await pool.getConnection()
      const [rows] = await connection.query('SELECT id, name, email, created_at FROM users ORDER BY created_at DESC')
      connection.release()
      return rows
    } catch (err) {
      throw new Error(`Database error: ${err.message}`)
    }
  }

  /**
   * Paginate users list. Returns an object containing user records and
   * pagination metadata. Query parameters should supply `page` and `limit`.
   */
  static async listPaginated(page = 1, limit = 10) {
    const offset = (page - 1) * limit;
    try {
      const connection = await pool.getConnection();
      const [rows] = await connection.query(
        'SELECT id, name, email, created_at FROM users ORDER BY created_at DESC LIMIT ? OFFSET ?',
        [limit, offset]
      );
      const [countRows] = await connection.query('SELECT COUNT(*) as count FROM users');
      connection.release();

      const total = countRows[0].count || 0;
      const totalPages = Math.ceil(total / limit);
      return {
        users: rows,
        page,
        limit,
        total,
        totalPages
      };
    } catch (err) {
      throw new Error(`Database error: ${err.message}`);
    }
  }

  static async verifyPassword(password, hash) {
    return await bcryptjs.compare(password, hash)
  }

  // Password Reset Token Methods
  static async createResetToken(userId, token, expiresAt) {
    try {
      const connection = await pool.getConnection()
      // Delete any existing tokens for this user
      await connection.query('DELETE FROM password_reset_tokens WHERE user_id = ?', [userId])
      // Insert new token
      const [result] = await connection.query(
        'INSERT INTO password_reset_tokens (user_id, token, expires_at) VALUES (?, ?, ?)',
        [userId, token, expiresAt]
      )
      connection.release()
      return result.insertId
    } catch (err) {
      throw new Error(`Database error: ${err.message}`)
    }
  }

  static async getResetToken(token) {
    try {
      const connection = await pool.getConnection()
      const [rows] = await connection.query(
        'SELECT * FROM password_reset_tokens WHERE token = ? AND expires_at > NOW()',
        [token]
      )
      connection.release()
      return rows[0] || null
    } catch (err) {
      throw new Error(`Database error: ${err.message}`)
    }
  }

  static async deleteResetToken(token) {
    try {
      const connection = await pool.getConnection()
      await connection.query('DELETE FROM password_reset_tokens WHERE token = ?', [token])
      connection.release()
    } catch (err) {
      throw new Error(`Database error: ${err.message}`)
    }
  }

  static async updatePassword(userId, newPassword) {
    try {
      const hash = await bcryptjs.hash(newPassword, 10)
      const connection = await pool.getConnection()
      await connection.query(
        'UPDATE users SET password_hash = ? WHERE id = ?',
        [hash, userId]
      )
      connection.release()
    } catch (err) {
      throw new Error(`Database error: ${err.message}`)
    }
  }

  // Profile Management Methods
  static async getFullProfileById(id) {
    try {
      const connection = await pool.getConnection()
      const [rows] = await connection.query(
        'SELECT id, name, email, shipping_address, profile_photo, created_at FROM users WHERE id = ?',
        [id]
      )
      connection.release()
      return rows[0] || null
    } catch (err) {
      throw new Error(`Database error: ${err.message}`)
    }
  }

  static async updateProfile(userId, userData) {
    const { name, shipping_address, profile_photo } = userData
    const updates = []
    const values = []

    if (name !== undefined && name !== null && name.trim() !== '') {
      updates.push('name = ?')
      values.push(name.trim())
    }

    if (shipping_address !== undefined) {
      updates.push('shipping_address = ?')
      values.push(shipping_address)
    }

    if (profile_photo !== undefined) {
      updates.push('profile_photo = ?')
      values.push(profile_photo)
    }

    if (updates.length === 0) {
      return this.getFullProfileById(userId)
    }

    values.push(userId)

    try {
      const connection = await pool.getConnection()
      await connection.query(
        `UPDATE users SET ${updates.join(', ')} WHERE id = ?`,
        values
      )
      connection.release()
      return this.getFullProfileById(userId)
    } catch (err) {
      throw new Error(`Database error: ${err.message}`)
    }
  }

  static async getOrdersByUser(userId) {
    try {
      const connection = await pool.getConnection()
      const [rows] = await connection.query(
        `SELECT o.*, 
         GROUP_CONCAT(JSON_OBJECT('id', oi.id, 'product_id', oi.product_id, 'quantity', oi.quantity, 'price', oi.price)) as items_json
         FROM orders o 
         LEFT JOIN order_items oi ON o.id = oi.order_id 
         WHERE o.user_id = ? 
         GROUP BY o.id 
         ORDER BY o.created_at DESC`,
        [userId]
      )
      connection.release()
      
      // Parse the items JSON
      return rows.map(row => ({
        ...row,
        items: row.items_json ? JSON.parse(`[${row.items_json}]`) : []
      }))
    } catch (err) {
      throw new Error(`Database error: ${err.message}`)
    }
  }
}

export default User
