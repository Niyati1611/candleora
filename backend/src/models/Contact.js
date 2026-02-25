import pool from '../config/database.js';

class Contact {
  static async add({ fullName, email, phone, message }) {
    try {
      const connection = await pool.getConnection();
      const [result] = await connection.query(
        'INSERT INTO contact_messages (fullName, email, phone, message) VALUES (?, ?, ?, ?)',
        [fullName, email, phone || null, message]
      );
      connection.release();
      return result.insertId;
    } catch (err) {
      throw err;
    }
  }

  static async getAll() {
    try {
      const connection = await pool.getConnection();
      const [rows] = await connection.query('SELECT id, fullName, email, phone, message, createdAt FROM contact_messages ORDER BY createdAt DESC');
      connection.release();
      return rows;
    } catch (err) {
      throw err;
    }
  }

  static async remove(id) {
    try {
      const connection = await pool.getConnection();
      await connection.query('DELETE FROM contact_messages WHERE id = ?', [id]);
      connection.release();
    } catch (err) {
      throw err;
    }
  }
}

export default Contact;
