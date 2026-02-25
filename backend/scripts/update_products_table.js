import pool from '../src/config/database.js';

async function updateProductsTable() {
  const connection = await pool.getConnection();
  try {
    // Check if columns exist first
    const [columns] = await connection.query("SHOW COLUMNS FROM products LIKE 'is_new_arrival'");
    
    if (columns.length === 0) {
      await connection.query(`
        ALTER TABLE products 
        ADD COLUMN is_new_arrival BOOLEAN DEFAULT FALSE,
        ADD COLUMN new_arrival_expires_at DATE NULL,
        ADD COLUMN discount_price DECIMAL(10,2) NULL,
        ADD COLUMN images JSON NULL
      `);
      console.log('✅ Database columns added successfully!');
    } else {
      console.log('✅ Columns already exist!');
    }
    
    // Mark some existing products as new arrivals for testing
    const [products] = await connection.query('SELECT COUNT(*) as count FROM products WHERE is_new_arrival = true');
    if (products[0].count === 0) {
      await connection.query(`
        UPDATE products 
        SET is_new_arrival = true, 
            new_arrival_expires_at = DATE_ADD(CURDATE(), INTERVAL 7 DAY)
        WHERE id IN (1, 2, 3, 4, 5)
        LIMIT 5
      `);
      console.log('✅ Sample products marked as new arrivals!');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    connection.release();
    process.exit();
  }
}

updateProductsTable();
