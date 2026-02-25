import mysql from 'mysql2/promise';
import bcryptjs from 'bcryptjs';

async function setupAdmin() {
  try {
    const connection = await mysql.createConnection({
      host: '127.0.0.1',
      user: 'root',
      password: '',
      database: 'candle_shop'
    });

    const hash = await bcryptjs.hash('admin123', 10);
    
    // Check if admin already exists
    const [existing] = await connection.execute(
      'SELECT id FROM admin_users WHERE username = ?',
      ['admin']
    );

    if (existing.length > 0) {
      console.log('✅ Admin user already exists!');
      console.log('   Username: admin');
      console.log('   Password: admin123');
      console.log('\n   Login at: http://localhost:5000/admin');
    } else {
      await connection.execute(
        'INSERT INTO admin_users (username, password_hash, email) VALUES (?, ?, ?)',
        ['admin', hash, 'admin@candle.ora']
      );
      console.log('✅ Admin user created successfully!');
      console.log('   Username: admin');
      console.log('   Password: admin123');
      console.log('\n   Login at: http://localhost:5000/admin');
    }

    await connection.end();
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.log('\n⚠️  Make sure:');
    console.log('   1. MySQL is running in XAMPP');
    console.log('   2. Database "candle_shop" exists');
    console.log('   3. Table "admin_users" was created from database.sql');
  }
}

setupAdmin();
