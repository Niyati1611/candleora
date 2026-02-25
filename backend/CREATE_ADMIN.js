import mysql from 'mysql2/promise';
import bcryptjs from 'bcryptjs';
import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, (answer) => {
      resolve(answer);
    });
  });
}

async function createAdmin() {
  console.log('\n🕯️  Create Admin User\n');

  const username = await question('Username: ');
  const password = await question('Password: ');
  const email = await question('Email (optional): ');

  if (!username || !password) {
    console.log('❌ Username and password are required.\n');
    rl.close();
    return;
  }

  try {
    const connection = await mysql.createConnection({
      host: '127.0.0.1',
      user: 'root',
      password: '',
      database: 'candle_shop'
    });

    const hash = await bcryptjs.hash(password, 10);
    const [result] = await connection.execute(
      'INSERT INTO admin_users (username, password_hash, email) VALUES (?, ?, ?)',
      [username, hash, email || null]
    );

    console.log(`✅ Admin user created successfully! ID: ${result.insertId}\n`);
    await connection.end();
  } catch (error) {
    console.error('❌ Error:', error.message);
  }

  rl.close();
}

createAdmin();
