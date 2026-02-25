import pool from '../src/config/database.js';

async function addUserProfileFields() {
  const connection = await pool.getConnection();
  
  try {
    console.log('🔄 Adding user profile fields...');
    
    // Add shipping_address column to users table
    await connection.query(`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS shipping_address TEXT AFTER email
    `);
    console.log('✅ Added shipping_address column');
    
    // Add profile_photo column to users table
    await connection.query(`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS profile_photo VARCHAR(500) DEFAULT NULL AFTER shipping_address
    `);
    console.log('✅ Added profile_photo column');
    
    // Add user_id column to orders table
    await connection.query(`
      ALTER TABLE orders 
      ADD COLUMN IF NOT EXISTS user_id INT DEFAULT NULL AFTER customer_email
    `);
    console.log('✅ Added user_id column to orders');
    
    // Add foreign key for user_id in orders
    try {
      await connection.query(`
        ALTER TABLE orders 
        ADD CONSTRAINT fk_orders_user_id 
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
      `);
      console.log('✅ Added foreign key constraint for orders.user_id');
    } catch (err) {
      if (err.code === 'ER_DUP_KEYNAME') {
        console.log('ℹ️ Foreign key constraint already exists');
      } else {
        console.log('⚠️ Could not add foreign key:', err.message);
      }
    }
    
    // Create wishlist table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS wishlist (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        product_id INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
        UNIQUE KEY unique_user_product (user_id, product_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log('✅ Created wishlist table');
    
    // Add index for faster queries
    await connection.query(`
      CREATE INDEX IF NOT EXISTS idx_wishlist_user_id ON wishlist(user_id)
    `);
    console.log('✅ Added index on wishlist.user_id');
    
    console.log('🎉 All database migrations completed successfully!');
    
  } catch (error) {
    console.error('❌ Error during migration:', error);
  } finally {
    connection.release();
    process.exit(0);
  }
}

addUserProfileFields();
