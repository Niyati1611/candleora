import mysql from 'mysql2/promise'

(async function init(){
  try {
    const pool = mysql.createPool({
      host: process.env.DB_HOST || '127.0.0.1',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'candle_shop',
      port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306,
      waitForConnections: true,
      connectionLimit: 10
    })

    // Check if column exists
    const [columns] = await pool.query('SHOW COLUMNS FROM products LIKE "filter_selections"')
    
    if (columns.length === 0) {
      await pool.query('ALTER TABLE products ADD COLUMN filter_selections JSON DEFAULT NULL')
      console.log('✅ filter_selections column added to products table')
    } else {
      console.log('ℹ️ filter_selections column already exists')
    }

    process.exit(0)
  } catch (err) {
    console.error('❌ Migration failed:', err.message)
    process.exit(1)
  }
})()
