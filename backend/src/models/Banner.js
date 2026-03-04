import pool from '../config/database.js';

class Banner {
  // return all banner images ordered by position ascending
  static async getAll() {
    try {
      const connection = await pool.getConnection();
      const [rows] = await connection.query(
        'SELECT id, image_url, text, position FROM banner_images ORDER BY position ASC'
      );
      connection.release();
      return rows;
    } catch (err) {
      throw new Error(`Database error: ${err.message}`);
    }
  }

  // add a new banner image record; position will be set to max+1
  static async add(imageUrl, text = '') {
    try {
      const connection = await pool.getConnection();
      // compute next position
      const [maxRows] = await connection.query('SELECT MAX(position) AS maxPos FROM banner_images');
      const nextPos = (maxRows[0].maxPos !== null) ? maxRows[0].maxPos + 1 : 0;
      const [result] = await connection.query(
        'INSERT INTO banner_images (image_url, text, position) VALUES (?, ?, ?)',
        [imageUrl, text, nextPos]
      );
      connection.release();
      return result.insertId;
    } catch (err) {
      throw new Error(`Database error: ${err.message}`);
    }
  }

  // update banner text
  static async updateText(id, text) {
    try {
      const connection = await pool.getConnection();
      await connection.query(
        'UPDATE banner_images SET text = ? WHERE id = ?',
        [text, id]
      );
      connection.release();
    } catch (err) {
      throw new Error(`Database error: ${err.message}`);
    }
  }

  static async remove(id) {
    try {
      const connection = await pool.getConnection();
      await connection.query('DELETE FROM banner_images WHERE id = ?', [id]);
      connection.release();
    } catch (err) {
      throw new Error(`Database error: ${err.message}`);
    }
  }

  // reorder expects array of ids in new order
  static async reorder(ids = []) {
    try {
      const connection = await pool.getConnection();
      const promises = ids.map((id, index) => {
        return connection.query('UPDATE banner_images SET position = ? WHERE id = ?', [index, id]);
      });
      await Promise.all(promises);
      connection.release();
    } catch (err) {
      throw new Error(`Database error: ${err.message}`);
    }
  }
}

export default Banner;
