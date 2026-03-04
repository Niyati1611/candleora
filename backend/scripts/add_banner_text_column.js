// Migration script to add text column to banner_images table
import pool from '../src/config/database.js';

async function addBannerTextColumn() {
  try {
    const connection = await pool.getConnection();
    
    // Check if column exists
    const [columns] = await connection.query('SHOW COLUMNS FROM banner_images LIKE "text"');
    
    if (columns.length === 0) {
      await connection.query('ALTER TABLE banner_images ADD COLUMN text VARCHAR(500) DEFAULT ""');
      console.log('✅ Added "text" column to banner_images table');
    } else {
      console.log('ℹ️ "text" column already exists in banner_images table');
    }
    
    connection.release();
    console.log('✅ Migration completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    process.exit(1);
  }
}

addBannerTextColumn();
