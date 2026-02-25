import mysql from 'mysql2/promise'
import dotenv from 'dotenv'

dotenv.config()

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

    const createFilters = `CREATE TABLE IF NOT EXISTS filters (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      ` + "`key`" + ` VARCHAR(255) NOT NULL,
      enabled TINYINT(1) DEFAULT 1,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`;

    const createFilterValues = `CREATE TABLE IF NOT EXISTS filter_values (
      id INT AUTO_INCREMENT PRIMARY KEY,
      filter_id INT NOT NULL,
      value VARCHAR(255) NOT NULL,
      slug VARCHAR(255),
      enabled TINYINT(1) DEFAULT 1,
      sort_order INT DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (filter_id) REFERENCES filters(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`;

    await pool.query(createFilters)
    console.log('filters table ensured')
    await pool.query(createFilterValues)
    console.log('filter_values table ensured')

    process.exit(0)
  } catch (err) {
    console.error('DB init failed:', err)
    process.exit(1)
  }
})()
