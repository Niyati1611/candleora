import pool from '../config/database.js';

class Order {
  static async create(data) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();
      
      const [result] = await connection.query(
        'INSERT INTO orders (customer_name, customer_email, customer_phone, customer_address, total_amount, status) VALUES (?, ?, ?, ?, ?, ?)',
        [data.customer_name, data.customer_email, data.customer_phone, data.customer_address, data.total_amount, 'pending']
      );
      const orderId = result.insertId;

      for (const item of data.items) {
        await connection.query(
          'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)',
          [orderId, item.product_id, item.quantity, item.price]
        );
      }

      await connection.commit();
      return orderId;
    } catch (error) {
      await connection.rollback();
      throw new Error(`Database error: ${error.message}`);
    } finally {
      connection.release();
    }
  }

  static async getAll() {
    try {
      const connection = await pool.getConnection();
      const [rows] = await connection.query('SELECT * FROM orders ORDER BY created_at DESC');
      connection.release();
      return rows;
    } catch (error) {
      throw new Error(`Database error: ${error.message}`);
    }
  }

  static async getById(id) {
    try {
      const connection = await pool.getConnection();
      const [orders] = await connection.query('SELECT * FROM orders WHERE id = ?', [id]);
      const [items] = await connection.query('SELECT * FROM order_items WHERE order_id = ?', [id]);
      connection.release();
      
      if (!orders.length) return null;
      return { ...orders[0], items };
    } catch (error) {
      throw new Error(`Database error: ${error.message}`);
    }
  }

  static async updateStatus(id, status) {
    try {
      const connection = await pool.getConnection();
      const [result] = await connection.query('UPDATE orders SET status = ? WHERE id = ?', [status, id]);
      connection.release();
      
      console.log(`🔄 Database update result for order #${id}:`, {
        affectedRows: result.affectedRows,
        newStatus: status
      });
      
      return result.affectedRows > 0;
    } catch (error) {
      throw new Error(`Database error: ${error.message}`);
    }
  }

  static async getTodayOrdersCount() {
    try {
      const connection = await pool.getConnection();
      const [rows] = await connection.query(
        'SELECT COUNT(*) as count FROM orders WHERE DATE(created_at) = CURDATE()'
      );
      connection.release();
      return rows[0]?.count || 0;
    } catch (error) {
      throw new Error(`Database error: ${error.message}`);
    }
  }

  static async getTotalUsers() {
    try {
      const connection = await pool.getConnection();
      const [rows] = await connection.query(
        'SELECT COUNT(DISTINCT customer_email) as count FROM orders'
      );
      connection.release();
      return rows[0]?.count || 0;
    } catch (error) {
      throw new Error(`Database error: ${error.message}`);
    }
  }
}

export default Order;
