import pool from '../config/database.js'

class Wishlist {
  static async add(userId, productId) {
    try {
      const connection = await pool.getConnection()
      const [result] = await connection.query(
        'INSERT INTO wishlist (user_id, product_id) VALUES (?, ?) ON DUPLICATE KEY UPDATE created_at = CURRENT_TIMESTAMP',
        [userId, productId]
      )
      connection.release()
      return result.insertId || result.affectedRows
    } catch (err) {
      throw new Error(`Database error: ${err.message}`)
    }
  }

  static async remove(userId, productId) {
    try {
      const connection = await pool.getConnection()
      const [result] = await connection.query(
        'DELETE FROM wishlist WHERE user_id = ? AND product_id = ?',
        [userId, productId]
      )
      connection.release()
      return result.affectedRows > 0
    } catch (err) {
      throw new Error(`Database error: ${err.message}`)
    }
  }

  static async getByUser(userId) {
    try {
      const connection = await pool.getConnection()
      const [rows] = await connection.query(
        `SELECT w.*, p.name, p.price, p.discount_price, p.image_url, p.category
         FROM wishlist w
         JOIN products p ON w.product_id = p.id
         WHERE w.user_id = ?
         ORDER BY w.created_at DESC`,
        [userId]
      )
      connection.release()
      return rows
    } catch (err) {
      throw new Error(`Database error: ${err.message}`)
    }
  }

  static async check(userId, productId) {
    try {
      const connection = await pool.getConnection()
      const [rows] = await connection.query(
        'SELECT id FROM wishlist WHERE user_id = ? AND product_id = ?',
        [userId, productId]
      )
      connection.release()
      return rows.length > 0
    } catch (err) {
      throw new Error(`Database error: ${err.message}`)
    }
  }

  static async clear(userId) {
    try {
      const connection = await pool.getConnection()
      await connection.query('DELETE FROM wishlist WHERE user_id = ?', [userId])
      connection.release()
      return true
    } catch (err) {
      throw new Error(`Database error: ${err.message}`)
    }
  }
}

export default Wishlist
