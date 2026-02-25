import mysql from 'mysql2/promise';
import bcryptjs from 'bcryptjs';
import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, (answer) => resolve(answer));
  });
}

async function run() {
  try {
    console.log('\n🛠️  Update/Create Admin Password\n');

    const username = (await question('Username (default: admin): ')) || 'admin';
    const password = await question('New password: ') || 'admin123';

    if (!password) {
      console.log('❌ Password is required.');
      rl.close();
      return;
    }

    const connection = await mysql.createConnection({
      host: '127.0.0.1',
      user: 'root',
      password: '',
      database: 'candle_shop'
    });

    const hash = await bcryptjs.hash(password, 10);

    // Check if admin exists
    const [rows] = await connection.execute('SELECT id FROM admin_users WHERE username = ?', [username]);

    if (rows.length > 0) {
      await connection.execute('UPDATE admin_users SET password_hash = ? WHERE username = ?', [hash, username]);
      console.log(`✅ Password updated for user "${username}"`);
    } else {
      await connection.execute('INSERT INTO admin_users (username, password_hash, email) VALUES (?, ?, ?)', [username, hash, `${username}@candle.ora`]);
      console.log(`✅ Admin user "${username}" created with provided password.`);
    }

    await connection.end();
  } catch (err) {
    console.error('❌ Error:', err.message);
  } finally {
    rl.close();
  }
}

run();
