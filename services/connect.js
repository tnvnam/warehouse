// const { Client } = require('pg');

// const client = new Client({
//   host: 'localhost',
//   port: 5432,
//   database: 'warehouse_v2',
//   user: 'postgres',
//   password: '12345',
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
  return `${salt}:${hash}`;
}

// Test kết nối DB
app.get('/test-db', async (req, res) => {
  const client = new Client({
    host: 'localhost',
    port: 5432,
    database: 'warehouse_v2',
    user: 'postgres',
    password: '12345',
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
    database: 'warehouse_v2',
    user: 'postgres',
    password: '12345',
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
    database: 'warehouse_v2',
    user: 'postgres',
    password: '12345',
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
    database: 'warehouse_v2',
    user: 'postgres',
    password: '12345',
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
    database: 'warehouse_v2',
    user: 'postgres',
    password: '12345',
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

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (email && !emailRegex.test(email)) {
    return res.status(400).json({ success: false, error: 'Email không đúng định dạng.' });
  }

  const phoneRegex = /^\d{10}$/;
  if (phone && !phoneRegex.test(phone)) {
    return res.status(400).json({ success: false, error: 'Số điện thoại phải gồm đúng 10 chữ số.' });
  }

  const client = new Client({
    host: 'localhost',
    port: 5432,
    database: 'warehouse_v2',
    user: 'postgres',
    password: '12345',
    ssl: false
  });
  try {
    const hashedPassword = await hashPassword(password);
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
    res.status(500).json({ success: false, error: err.message });
  }
});

// Lấy danh sách user
app.get('/users', async (req, res) => {
  const client = new Client({
    host: 'localhost',
    port: 5432,
    database: 'warehouse_v2',
    user: 'postgres',
    password: '12345',
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
    database: 'warehouse_v2',
    user: 'postgres',
    password: '12345',
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
    database: 'warehouse_v2',
    user: 'postgres',
    password: '12345',
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

// Thêm đơn vị mới
app.post('/units', async (req, res) => {
  const { code, name, description } = req.body;
  const client = new Client({
    host: 'localhost',
    port: 5432,
    database: 'warehouse_v2',
    user: 'postgres',
    password: '12345',
    ssl: false
  });
  try {
    await client.connect();
    await client.query(
      'INSERT INTO units (code, name, description) VALUES ($1, $2, $3)',
      [code, name, description]
    );
    await client.end();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Lấy danh sách đơn vị
app.get('/units', async (req, res) => {
  const client = new Client({
    host: 'localhost',
    port: 5432,
    database: 'warehouse_v2',
    user: 'postgres',
    password: '12345',
    ssl: false
  });
  try {
    await client.connect();
    const result = await client.query('SELECT * FROM units');
    await client.end();
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// Thêm nhà cung cấp mới
app.post('/suppliers', async (req, res) => {
  const {
    code,
    name,
    tax_code,
    address,
    phone,
    email,
    contact_person,
    contact_position,
    business_field,
    note,
    credit_limit,
    priority_level,
    is_active,
    created_by
  } = req.body;

  const client = new Client({
    host: 'localhost',
    port: 5432,
    database: 'warehouse_v2',
    user: 'postgres',
    password: '12345',
    ssl: false
  });

  try {
    await client.connect();
    await client.query(
      `INSERT INTO suppliers (
        code, name, tax_code, address, phone, email, contact_person, contact_position,
        business_field, note, credit_limit, priority_level, is_active, created_by, created_at, updated_at
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
      )`,
      [
        code, name, tax_code, address, phone, email, contact_person, contact_position,
        business_field, note, credit_limit, priority_level, is_active, created_by
      ]
    );
    await client.end();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Lấy danh sách nhà cung cấp
app.get('/suppliers', async (req, res) => {
  const client = new Client({
    host: 'localhost',
    port: 5432,
    database: 'warehouse_v2',
    user: 'postgres',
    password: '12345',
    ssl: false
  });
  try {
    await client.connect();
    const result = await client.query('SELECT * FROM suppliers');
    await client.end();
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Thêm sản phẩm mới
app.post('/products', async (req, res) => {
  const {
    code,
    name,
    barcode,
    category_id,
    specification,
    unit_id,
    brand,
    origin,
    attributes,
    image_urls,
    price,
    stock_min,
    stock_max,
    supplier_id,
    is_active,
    note
  } = req.body;

  const client = new Client({
    host: 'localhost',
    port: 5432,
    database: 'warehouse_v2',
    user: 'postgres',
    password: '12345',
    ssl: false
  });

  try {
    await client.connect();
    await client.query(
      `INSERT INTO products (
        code, name, barcode, category_id, specification, unit_id, brand, origin,
        attributes, image_urls, price, stock_min, stock_max, supplier_id, is_active, note, created_at
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, CURRENT_TIMESTAMP
      )`,
      [
        code, name, barcode, category_id, specification, unit_id, brand, origin,
        attributes, image_urls, price, stock_min, stock_max, supplier_id, is_active, note
      ]
    );
    await client.end();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Lấy danh sách sản phẩm
app.get('/products', async (req, res) => {
  const client = new Client({
    host: 'localhost',
    port: 5432,
    database: 'warehouse_v2',
    user: 'postgres',
    password: '12345',
    ssl: false
  });
  try {
    await client.connect();
    const result = await client.query('SELECT * FROM products');
    await client.end();
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Thêm quy đổi đơn vị mới
app.post('/unit-conversions', async (req, res) => {
  const {
    product_id,
    from_unit_id,
    to_unit_id,
    factor,
    note,
    is_active
  } = req.body;

  const client = new Client({
    host: 'localhost',
    port: 5432,
    database: 'warehouse_v2',
    user: 'postgres',
    password: '12345',
    ssl: false
  });

  try {
    await client.connect();
    await client.query(
      `INSERT INTO unit_conversions (
        product_id, from_unit_id, to_unit_id, factor, note, is_active, created_at, updated_at
      ) VALUES (
        $1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
      )`,
      [product_id, from_unit_id, to_unit_id, factor, note, is_active]
    );
    await client.end();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Lấy danh sách quy đổi đơn vị
app.get('/unit-conversions', async (req, res) => {
  const client = new Client({
    host: 'localhost',
    port: 5432,
    database: 'warehouse_v2',
    user: 'postgres',
    password: '12345',
    ssl: false
  });
  try {
    await client.connect();
    const result = await client.query('SELECT * FROM unit_conversions');
    await client.end();
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Khởi động server
app.listen(port, '0.0.0.0', () => {
  console.log(`Server is running on http://0.0.0.0:${port}`);
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  console.log('🟡 Nhận yêu cầu đăng nhập:', { username });

  const client = new Client({
    host: 'localhost',
    port: 5432,
    database: 'warehouse_v2',
    user: 'postgres',
    password: '12345',
    ssl: false
  });

  try {
    await client.connect();

    const result = await client.query('SELECT * FROM users WHERE username = $1', [username]);

    if (result.rows.length === 0) {
      console.log('❌ Không tìm thấy người dùng');
      await client.end();
      return res.status(401).json({ success: false, error: 'Tài khoản không tồn tại' });
    }

    const user = result.rows[0];

    console.log('🔐 Đang kiểm tra mật khẩu...');
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      console.log('❌ Mật khẩu sai');
      await client.end();
      return res.status(401).json({ success: false, error: 'Sai mật khẩu' });
    }

    // Tạo object user trả về, KHÔNG trả về mật khẩu
    const userData = {
      id: user.id,
      username: user.username,
      full_name: user.full_name,
      email: user.email,
      phone: user.phone,
      department_id: user.department_id,
      role_id: user.role_id,
      is_active: user.is_active
    };

    console.log('✅ Đăng nhập thành công:', userData.username);
    await client.end();

    res.json({ success: true, message: 'Đăng nhập thành công', user: userData });
  } catch (err) {
    console.error('🔥 Lỗi đăng nhập:', err);
    res.status(500).json({ success: false, error: 'Lỗi máy chủ. Vui lòng thử lại sau.' });
  }
});