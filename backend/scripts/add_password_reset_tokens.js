import pool from '../src/config/database.js';

async function addPasswordResetTokensTable() {
  const connection = await pool.getConnection();
  
  try {
    // Create password_reset_tokens table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS password_reset_tokens (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        token VARCHAR(255) NOT NULL,
        expires_at DATETIME NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        INDEX idx_token (token),
        INDEX idx_user_id (user_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    
    console.log('✅ password_reset_tokens table created successfully');
  } catch (error) {
    console.error('❌ Error creating password_reset_tokens table:', error.message);
  } finally {
    connection.release();
    process.exit(0);
  }
}

addPasswordResetTokensTable();
