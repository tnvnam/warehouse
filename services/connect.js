// const { Client } = require('pg');

// const client = new Client({
//   host: 'localhost',
//   port: 5432,
//   database: 'warehouse',
//   user: 'postgres',
//   password: '514753',
//   ssl: false
// });

// client.connect()
//   .then(() => {
//     console.log('Kết nối thành công!');
//     return client.end();
//   })
//   .catch(err => console.error('Lỗi kết nối:', err));

const express = require('express');
const { Client } = require('pg');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const app = express();
const port = 3000;

app.use(express.json());

// Hàm mã hoá mật khẩu
async function hashPassword(password) {
  return await bcrypt.hash(password, 10);
}

// Hàm mã hoá mật khẩu với SHA-256 và salt
function hashPasswordSHA256(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.createHmac('sha256', salt).update(password).digest('hex');
  // Lưu salt cùng với hash để sau này kiểm tra đăng nhập
  return `${salt}:${hash}`;
}

// Test kết nối DB
app.get('/test-db', async (req, res) => {
  const client = new Client({
    host: 'localhost',
    port: 5432,
    database: 'warehouse',
    user: 'postgres',
    password: '514753',
    ssl: false
  });
  try {
    await client.connect();
    const result = await client.query('SELECT NOW()');
    await client.end();
    res.json({ success: true, time: result.rows[0].now });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Thêm vai trò mới
app.post('/roles', async (req, res) => {
  const { name, description, permissions, status } = req.body;
  const client = new Client({
    host: 'localhost',
    port: 5432,
    database: 'warehouse',
    user: 'postgres',
    password: '514753',
    ssl: false
  });
  try {
    await client.connect();
    await client.query(
      'INSERT INTO roles (name, description, permissions, status) VALUES ($1, $2, $3, $4)',
      [name, description, permissions, status]
    );
    await client.end();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Lấy danh sách vai trò
app.get('/roles', async (req, res) => {
  const client = new Client({
    host: 'localhost',
    port: 5432,
    database: 'warehouse',
    user: 'postgres',
    password: '514753',
    ssl: false
  });
  try {
    await client.connect();
    const result = await client.query('SELECT * FROM roles');
    await client.end();
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Thêm phòng ban mới
app.post('/departments', async (req, res) => {
  const { code, name, description, is_active } = req.body;
  const client = new Client({
    host: 'localhost',
    port: 5432,
    database: 'warehouse',
    user: 'postgres',
    password: '514753',
    ssl: false
  });
  try {
    await client.connect();
    await client.query(
      'INSERT INTO departments (code, name, description, is_active, created_at, updated_at) VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)',
      [code, name, description, is_active]
    );
    await client.end();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Lấy danh sách phòng ban
app.get('/departments', async (req, res) => {
  const client = new Client({
    host: 'localhost',
    port: 5432,
    database: 'warehouse',
    user: 'postgres',
    password: '514753',
    ssl: false
  });
  try {
    await client.connect();
    const result = await client.query('SELECT * FROM departments');
    await client.end();
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Thêm user mới
app.post('/users', async (req, res) => {
  const {
    username,
    password,
    full_name,
    email,
    phone,
    department_id,
    role_id,
    is_active
  } = req.body;

  // Kiểm tra định dạng email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (email && !emailRegex.test(email)) {
    return res.status(400).json({ success: false, error: 'Email không đúng định dạng.' });
  }

  // Kiểm tra số điện thoại 10 số
  const phoneRegex = /^\d{10}$/;
  if (phone && !phoneRegex.test(phone)) {
    return res.status(400).json({ success: false, error: 'Số điện thoại phải gồm đúng 10 chữ số.' });
  }

  const client = new Client({
    host: 'localhost',
    port: 5432,
    database: 'warehouse',
    user: 'postgres',
    password: '514753',
    ssl: false
  });
  try {
    console.log('Password:', password);
    const hashedPassword = await hashPassword(password);
    console.log('Hashed:', hashedPassword);

    await client.connect();
    await client.query(
      `INSERT INTO users 
        (username, password, full_name, email, phone, department_id, role_id, is_active, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
      [username, hashedPassword, full_name, email, phone, department_id, role_id, is_active]
    );
    await client.end();
    res.json({ success: true });
  } catch (err) {
    console.error('Lỗi thêm user:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Lấy danh sách user
app.get('/users', async (req, res) => {
  const client = new Client({
    host: 'localhost',
    port: 5432,
    database: 'warehouse',
    user: 'postgres',
    password: '514753',
    ssl: false
  });
  try {
    await client.connect();
    const result = await client.query('SELECT * FROM users');
    await client.end();
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Thêm danh mục sản phẩm mới
app.post('/product-categories', async (req, res) => {
  const { code, name, description, is_active } = req.body;
  const client = new Client({
    host: 'localhost',
    port: 5432,
    database: 'warehouse',
    user: 'postgres',
    password: '514753',
    ssl: false
  });
  try {
    await client.connect();
    await client.query(
      `INSERT INTO product_categories (code, name, description, is_active, created_at, updated_at)
       VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
      [code, name, description, is_active]
    );
    await client.end();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Lấy danh sách danh mục sản phẩm
app.get('/product-categories', async (req, res) => {
  const client = new Client({
    host: 'localhost',
    port: 5432,
    database: 'warehouse',
    user: 'postgres',
    password: '514753',
    ssl: false
  });
  try {
    await client.connect();
    const result = await client.query('SELECT * FROM product_categories');
    await client.end();
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(port, () => {
  console.log(`API server listening at http://localhost:${port}`);
});