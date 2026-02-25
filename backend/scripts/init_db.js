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

    const createUsers = `CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL UNIQUE,
      password_hash VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`

    const createBanner = `CREATE TABLE IF NOT EXISTS banner_images (
      id INT AUTO_INCREMENT PRIMARY KEY,
      image_url VARCHAR(500) NOT NULL,
      position INT NOT NULL DEFAULT 0
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`

    const createContacts = `CREATE TABLE IF NOT EXISTS contact_messages (
      id INT AUTO_INCREMENT PRIMARY KEY,
      fullName VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      phone VARCHAR(50),
      message TEXT NOT NULL,
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`

    await pool.query(createUsers)
    console.log('users table ensured')
    await pool.query(createBanner)
    console.log('banner_images table ensured')
    await pool.query(createContacts)
    console.log('contact_messages table ensured')
    // Ensure site_settings table exists
    const createSettings = `CREATE TABLE IF NOT EXISTS site_settings (
      id INT PRIMARY KEY DEFAULT 1,
      site_title VARCHAR(255) DEFAULT 'Candle.ora',
      logo_url VARCHAR(500),
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`;
    await pool.query(createSettings);
    console.log('site_settings table ensured');

    // ensure default row exists
    const insertDefault = `INSERT INTO site_settings (id, site_title) SELECT 1, 'Candle.ora' FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM site_settings WHERE id = 1);`;
    await pool.query(insertDefault);
    console.log('site_settings default row ensured');
    process.exit(0)
  } catch (err) {
    console.error('DB init failed:', err)
    process.exit(1)
  }
})()
