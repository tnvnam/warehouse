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

// Lấy thông tin phòng ban theo ID
app.get('/departments/:id', async (req, res) => {
  const { id } = req.params;
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
    const result = await client.query('SELECT * FROM departments WHERE id = $1', [id]);
    await client.end();
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Không tìm thấy phòng ban' });
    }
    res.json(result.rows[0]);
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

// Thêm đơn vị mới
app.post('/units', async (req, res) => {
  const { code, name, description } = req.body;
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
    database: 'warehouse',
    user: 'postgres',
    password: '514753',
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
    database: 'warehouse',
    user: 'postgres',
    password: '514753',
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
    database: 'warehouse',
    user: 'postgres',
    password: '514753',
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
    database: 'warehouse',
    user: 'postgres',
    password: '514753',
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
    database: 'warehouse',
    user: 'postgres',
    password: '514753',
    ssl: false
  });
  try {
    await client.connect();
    const result = await client.query(`
      SELECT 
        p.*, 
        c.name AS category_name, 
        u.name AS unit_name
      FROM products p
      LEFT JOIN product_categories c ON p.category_id = c.id
      LEFT JOIN units u ON p.unit_id = u.id
      ORDER BY p.created_at DESC
    `);
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
    database: 'warehouse',
    user: 'postgres',
    password: '514753',
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
    database: 'warehouse',
    user: 'postgres',
    password: '514753',
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

// Thêm khách hàng mới
app.post('/customers', async (req, res) => {
  const {
    tax_code,
    company_name,
    address,
    phone,
    email,
    contact_person,
    contact_position,
    created_by,
    updated_by,
    business_field,
    note,
    scale,
    status,
    credit_limit,
    priority_level,
    is_active
  } = req.body;

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
      `INSERT INTO customers (
        tax_code, company_name, address, phone, email, contact_person, contact_position,
        created_by, updated_by, business_field, note, scale, status, credit_limit, priority_level, is_active, created_at, updated_at
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
      )`,
      [
        tax_code, company_name, address, phone, email, contact_person, contact_position,
        created_by, updated_by, business_field, note, scale, status, credit_limit, priority_level, is_active
      ]
    );
    await client.end();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Lấy danh sách khách hàng
app.get('/customers', async (req, res) => {
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
    const result = await client.query('SELECT * FROM customers');
    await client.end();
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Thêm kho mới
app.post('/warehouses', async (req, res) => {
  const {
    code,
    name,
    parent_id,
    address,
    manager_id,
    note,
    is_active,
    created_by // nếu muốn lưu người tạo, có thể thêm trường này vào bảng
  } = req.body;

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
      `INSERT INTO warehouses (
        code, name, parent_id, address, manager_id, note, is_active, created_at, updated_at
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
      )`,
      [code, name, parent_id || null, address, manager_id, note, is_active]
    );
    await client.end();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Lấy danh sách kho
app.get('/warehouses', async (req, res) => {
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
    const result = await client.query('SELECT * FROM warehouses');
    await client.end();
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Thêm nguyên vật liệu mới
app.post('/materials', async (req, res) => {
  const {
    code,
    name,
    specification,
    category_id,
    unit_id,
    brand,
    origin,
    supplier_id,
    attributes,
    image_urls,
    stock_min,
    stock_max,
    note,
    is_active
  } = req.body;

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
      `INSERT INTO materials (
        code, name, specification, category_id, unit_id, brand, origin, supplier_id,
        attributes, image_urls, stock_min, stock_max, note, is_active, created_at, updated_at
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
      )`,
      [
        code, name, specification, category_id, unit_id, brand, origin, supplier_id,
        attributes, image_urls, stock_min, stock_max, note, is_active
      ]
    );
    await client.end();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Lấy danh sách nguyên vật liệu
app.get('/materials', async (req, res) => {
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
    const result = await client.query(`
      SELECT 
        m.*, 
        c.name AS category_name, 
        u.name AS unit_name, 
        s.name AS supplier_name
      FROM materials m
      LEFT JOIN product_categories c ON m.category_id = c.id
      LEFT JOIN units u ON m.unit_id = u.id
      LEFT JOIN suppliers s ON m.supplier_id = s.id
      ORDER BY m.created_at DESC
    `);
    await client.end();
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Thêm lệnh sản xuất mới
app.post('/production-orders', async (req, res) => {
  const {
    order_code,
    product_id,
    planned_quantity,
    actual_quantity,
    start_date,
    end_date,
    requester_id,
    approver_id,
    status,
    priority,
    note,
    is_active
  } = req.body;

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
      `INSERT INTO production_orders (
        order_code, product_id, planned_quantity, actual_quantity, start_date, end_date,
        requester_id, approver_id, status, priority, note, is_active, created_at, updated_at
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
      )`,
      [
        order_code, product_id, planned_quantity, actual_quantity || null, start_date || null, end_date || null,
        requester_id, approver_id, status, priority, note, is_active
      ]
    );
    await client.end();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Lấy danh sách lệnh sản xuất
app.get('/production-orders', async (req, res) => {
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
    const result = await client.query('SELECT * FROM production_orders');
    await client.end();
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Thêm yêu cầu nguyên vật liệu mới
app.post('/material-requests', async (req, res) => {
  const {
    request_code,
    production_order_id,
    requester_id,
    request_date,
    status,
    note,
    is_active
  } = req.body;

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
      `INSERT INTO material_requests (
        request_code, production_order_id, requester_id, request_date, status, note, is_active, created_at, updated_at
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
      )`,
      [
        request_code, production_order_id, requester_id, request_date, status, note, is_active
      ]
    );
    await client.end();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Lấy danh sách yêu cầu nguyên vật liệu
app.get('/material-requests', async (req, res) => {
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
    const result = await client.query('SELECT * FROM material_requests');
    await client.end();
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Thêm chi tiết yêu cầu nguyên vật liệu
app.post('/material-request-items', async (req, res) => {
  const {
    material_request_id,
    material_id,
    material_name,
    specification,
    quantity,
    unit_id,
    note
  } = req.body;

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
      `INSERT INTO material_request_items (
        material_request_id, material_id, material_name, specification, quantity, unit_id, note, created_at, updated_at
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
      )`,
      [
        material_request_id, material_id, material_name, specification, quantity, unit_id, note
      ]
    );
    await client.end();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Lấy danh sách chi tiết yêu cầu nguyên vật liệu
app.get('/material-request-items', async (req, res) => {
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
    const result = await client.query('SELECT * FROM material_request_items');
    await client.end();
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Lấy chi tiết sản phẩm theo ID
app.get('/products/:id', async (req, res) => {
  const { id } = req.params;

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
    const result = await client.query(`
  SELECT 
    p.*, 
    c.name AS category_name,
    u.name AS unit_name
  FROM products p
  LEFT JOIN product_categories c ON p.category_id = c.id
  LEFT JOIN units u ON p.unit_id = u.id
  WHERE p.id = $1
`, [id]);
    await client.end();

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy sản phẩm' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Lỗi khi truy vấn chi tiết sản phẩm:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Lấy danh sách kiểm kê kho
app.get('/stockcheck', async (req, res) => {
  const client = new Client({
    host: 'localhost',
    port: 5432,
    database: 'warehouse',
    user: 'postgres',
    password: '514753',
    ssl: false,
  });

  try {
    await client.connect();
    const result = await client.query(`
      SELECT s.*, w.name AS warehouse_name
      FROM stock_check s
      LEFT JOIN warehouses w ON s.warehouse_id = w.id
      ORDER BY s.date DESC
    `);
    await client.end();

    res.json(result.rows);
  } catch (err) {
    console.error('Lỗi lấy danh sách kiểm kê:', err);
    res.status(500).json({ error: 'Không thể tải danh sách kiểm kê' });
  }
});

// Thêm mới kiểm kê kho
app.post('/stockcheck', async (req, res) => {
  const { warehouse_id, date, note } = req.body;

  const client = new Client({
    host: 'localhost',
    port: 5432,
    database: 'warehouse',
    user: 'postgres',
    password: '514753',
    ssl: false,
  });

  try {
    await client.connect();

    const query = `
      INSERT INTO stock_check (warehouse_id, date, note)
      VALUES ($1, $2, $3)
      RETURNING *
    `;
    const values = [warehouse_id, date, note];
    const result = await client.query(query, values);

    await client.end();
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Lỗi khi tạo kiểm kê:', err);
    res.status(500).json({ error: 'Không thể tạo kiểm kê' });
  }
});

app.post('/requests', async (req, res) => {
  const { type, department_id, material_id, quantity } = req.body;

  const client = new Client({
    host: 'localhost',
    port: 5432,
    database: 'warehouse',
    user: 'postgres',
    password: '514753',
    ssl: false,
  });

  try {
    await client.connect();

    const result = await client.query(
      `
      INSERT INTO requests (type, department_id, material_id, quantity, date, status)
      VALUES ($1, $2, $3, $4, CURRENT_DATE, 'pending')
      RETURNING *
      `,
      [type, department_id, material_id, quantity]
    );

    await client.end();
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Lỗi khi tạo yêu cầu:', err);
    res.status(500).json({ error: 'Tạo phiếu thất bại' });
  }
});

app.get('/requests', async (req, res) => {
  const client = new Client({
    host: 'localhost',
    port: 5432,
    database: 'warehouse',
    user: 'postgres',
<<<<<<< HEAD
    password: '12345',
=======
    password: '514753',
    ssl: false,
>>>>>>> 3a51a4147b3daff040c9beffbe77f5879c2ca23e
  });

  try {
    await client.connect();

    const result = await client.query(`
      SELECT 
        r.id,
        r.type,
        r.status,
        d.name AS department_name,
        r.date,
        u.name AS unit
      FROM requests r
      JOIN departments d ON r.department_id = d.id
      JOIN materials m ON r.material_id = m.id
      JOIN units u ON m.unit_id = u.id
      ORDER BY r.date DESC
    `);

    await client.end();
    res.json(result.rows);
  } catch (err) {
    console.error('Lỗi lấy danh sách requests:', err);
    res.status(500).json({ error: 'Không thể tải danh sách phiếu' });
  }
});


app.get('/inventory', async (req, res) => {
  const client = new Client({
    host: 'localhost',
    port: 5432,
    database: 'warehouse',
    user: 'postgres',
    password: '514753',
    ssl: false,
  });

  try {
    await client.connect();

    const result = await client.query(`
      SELECT 
        i.id,
        m.name AS material_name,
        w.name AS warehouse_name,
        i.quantity
      FROM inventory i
      JOIN materials m ON i.material_id = m.id
      JOIN warehouses w ON i.warehouse_id = w.id
      ORDER BY warehouse_name
    `);

    await client.end();
    res.json(result.rows);
  } catch (err) {
    console.error('Lỗi lấy tồn kho:', err);
    res.status(500).json({ error: 'Không thể tải tồn kho' });
  }
});

app.get('/report', async (req, res) => {
  const { from, to, department_id, type } = req.query;

  const client = new Client({
    host: 'localhost',
    port: 5432,
    database: 'warehouse',
    user: 'postgres',
    password: '514753',
    ssl: false,
  });

  try {
    await client.connect();

    let query = `
      SELECT 
        r.id,
        r.date,
        r.type,
        r.quantity,
        m.name AS material_name,
        d.name AS department_name
      FROM requests r
      JOIN materials m ON r.material_id = m.id
      JOIN departments d ON r.department_id = d.id
      WHERE r.status = 'approved'
    `;

    const values = [];
    let paramIndex = 1;

    if (from && to) {
      query += ` AND r.date BETWEEN $${paramIndex++} AND $${paramIndex++}`;
      values.push(from, to);
    }

    if (department_id) {
      query += ` AND r.department_id = $${paramIndex++}`;
      values.push(department_id);
    }

    if (type && type !== 'all') {
      query += ` AND r.type = $${paramIndex++}`;
      values.push(type);
    }

    query += ` ORDER BY r.date DESC`;

    const result = await client.query(query, values);
    await client.end();

    res.json(result.rows);
  } catch (err) {
    console.error('Lỗi /report:', err);
    res.status(500).json({ error: 'Không thể tải dữ liệu báo cáo' });
  }
});


// Trong connect.js
app.get('/stock/movement', async (req, res) => {
  const client = new Client({
    host: 'localhost',
    port: 5432,
    database: 'warehouse',
    user: 'postgres',
    password: '12345',
    ssl: false,
  });

  try {
    await client.connect();

    const result = await client.query(`
      SELECT 
        r.id,
        r.type,
        m.name AS product_name,
        w.name AS warehouse_name,
        u.name AS unit,
        us.full_name AS handler_name,
        r.quantity,
        r.price,
        r.batch_number,
        r.note,
        r.expiry_date,
        r.date
      FROM requests r
      JOIN materials m ON r.material_id = m.id
      JOIN warehouses w ON r.warehouse_id = w.id
      LEFT JOIN units u ON r.unit_id = u.id
      LEFT JOIN users us ON r.handler_id = us.id
      WHERE r.status = 'approved'
      ORDER BY r.date DESC;
    `);

    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching movements:', err);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    await client.end();
  }
});


module.exports = app;

app.post('/stock/create', async (req, res) => {
  const {
    material_id,
    warehouse_id,
    unit_id,
    handler_id,
    quantity,
    price,
    note,
    batch_number,
    expiry_date,
    date,
    type
  } = req.body;

  if (!material_id || !warehouse_id || !unit_id || !quantity || !date || !type) {
    return res.status(400).json({ error: 'Thiếu dữ liệu bắt buộc' });
  }

  const client = new Client({
    host: 'localhost',
    port: 5432,
    database: 'warehouse',
    user: 'postgres',
    password: '12345',
    ssl: false
  });

  try {
    await client.connect();

    await client.query(
      `INSERT INTO requests (
        id, material_id, warehouse_id, unit_id, handler_id, type, quantity,
        price, note, batch_number, expiry_date, date, status, created_at
      )
      VALUES (
        gen_random_uuid(), $1, $2, $3, $4, $5, $6,
        $7, $8, $9, $10, $11, 'approved', NOW()
      )`,
      [
        material_id,
        warehouse_id,
        unit_id,
        handler_id,
        type,
        quantity,
        price || null,
        note || null,
        batch_number || null,
        expiry_date || null,
        date
      ]
    );

    await client.end();
    res.json({ success: true });
  } catch (error) {
    console.error('Lỗi tạo phiếu:', error);
    res.status(500).json({ error: 'Không thể tạo phiếu' });
  }
});


app.delete('/stock/delete/:id', async (req, res) => {
  const { id } = req.params;

  const client = new Client({
    host: 'localhost',
    port: 5432,
    database: 'warehouse',
    user: 'postgres',
    password: '12345',
    ssl: false
  });

  try {
    await client.connect();
    await client.query('DELETE FROM requests WHERE id = $1', [id]);
    await client.end();
    res.sendStatus(204);
  } catch (err) {
    console.error('Lỗi xóa phiếu:', err);
    res.status(500).json({ error: 'Không thể xóa phiếu' });
  }
});

app.post('/requests/create', async (req, res) => {
  const { department_id, material_id, unit_id, type, quantity, date } = req.body;

  if (!department_id || !material_id || !unit_id || !type || !quantity || !date) {
    return res.status(400).json({ error: 'Thiếu dữ liệu' });
  }

  const client = new Client({
    host: 'localhost',
    port: 5432,
    database: 'warehouse',
    user: 'postgres',
    password: '12345',
    ssl: false
  });

  try {
    await client.connect();

    await client.query(
      `INSERT INTO requests (id, department_id, material_id, unit_id, type, quantity, date, status, created_at)
       VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, 'pending', NOW())`,
      [department_id, material_id, unit_id, type, quantity, date]
    );

    await client.end();
    res.json({ success: true });
  } catch (err) {
    console.error('Lỗi tạo yêu cầu:', err);
    res.status(500).json({ error: 'Không thể tạo yêu cầu' });
  }
});


app.get('/requests/:id', async (req, res) => {
  const { id } = req.params;

  const client = new Client({
    host: 'localhost',
    port: 5432,
    database: 'warehouse',
    user: 'postgres',
    password: '12345',
    ssl: false
  });

  try {
    await client.connect();

    const result = await client.query(`
      SELECT 
        r.id, r.type, r.status, r.date, r.quantity,
        d.name AS department_name,
        m.name AS material_name,
        u.name AS unit
      FROM requests r
      JOIN departments d ON r.department_id = d.id
      JOIN materials m ON r.material_id = m.id
      JOIN units u ON r.unit_id = u.id
      WHERE r.id = $1
    `, [id]);

    await client.end();

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Không tìm thấy yêu cầu' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Lỗi lấy yêu cầu:', err);
    res.status(500).json({ error: 'Không thể lấy yêu cầu' });
  }
});

app.get('/requests/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const { rows } = await pool.query(
      `SELECT r.*, 
        m.name AS material_name, 
        u.name AS unit_name,
        w.name AS warehouse_name,
        d.name AS department_name
       FROM requests r
       LEFT JOIN materials m ON r.material_id = m.id
       LEFT JOIN units u ON r.unit_id = u.id
       LEFT JOIN warehouses w ON r.warehouse_id = w.id
       LEFT JOIN departments d ON r.department_id = d.id
       WHERE r.id = $1`,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Không tìm thấy yêu cầu' });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error('Lỗi chi tiết yêu cầu:', error);
    res.status(500).json({ error: 'Không thể lấy chi tiết yêu cầu' });
  }
});



app.put('/requests/update/:id', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!['approved', 'rejected'].includes(status)) {
    return res.status(400).json({ error: 'Trạng thái không hợp lệ' });
  }

  const client = new Client({
    host: 'localhost',
    port: 5432,
    database: 'warehouse',
    user: 'postgres',
    password: '12345',
    ssl: false
  });

  try {
    await client.connect();
    await client.query(`UPDATE requests SET status = $1 WHERE id = $2`, [status, id]);
    await client.end();

    res.json({ success: true });
  } catch (err) {
    console.error('Lỗi cập nhật yêu cầu:', err);
    res.status(500).json({ error: 'Không thể cập nhật yêu cầu' });
  }
});


app.get('/requests/:id', async (req, res) => {
  const { id } = req.params;

  const client = new Client({
    host: 'localhost',
    port: 5432,
    database: 'warehouse',
    user: 'postgres',
    password: '12345',
    ssl: false,
  });

  try {
    await client.connect();

    const result = await client.query(`
      SELECT 
        r.id,
        r.type,
        r.status,
        r.date,
        r.quantity,
        d.name AS department_name,
        m.name AS material_name,
        u.name AS unit_name,
        w.name AS warehouse_name
      FROM requests r
      LEFT JOIN departments d ON r.department_id = d.id
      LEFT JOIN materials m ON r.material_id = m.id
      LEFT JOIN units u ON r.unit_id = u.id
      LEFT JOIN warehouses w ON r.warehouse_id = w.id
      WHERE r.id = $1
    `, [id]);

    await client.end();

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Không tìm thấy yêu cầu' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('🔥 Lỗi khi lấy chi tiết yêu cầu:', err);
    res.status(500).json({ error: 'Không thể lấy chi tiết yêu cầu' });
  }
});


// app.listen(port, () => {
//   console.log(`API server listening at http://localhost:${port}`);
// });


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
    database: 'warehouse',
    user: 'postgres',
    password: '514753',
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

app.put('/users/:id/password', async (req, res) => {
  const { id } = req.params;
  const { currentPassword, newPassword } = req.body;

  const client = new Client({
    host: 'localhost',
    port: 5432,
    database: 'warehouse',
    user: 'postgres',
    password: '514753',
    ssl: false,
  });

  try {
    await client.connect();

    const result = await client.query('SELECT * FROM users WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      await client.end();
      return res.status(404).json({ message: 'Không tìm thấy người dùng' });
    }

    const user = result.rows[0];
    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);

    if (!isPasswordValid) {
      await client.end();
      return res.status(400).json({ message: 'Mật khẩu hiện tại không đúng' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await client.query('UPDATE users SET password = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2', [hashedPassword, id]);

    await client.end();
    return res.json({ message: 'Đổi mật khẩu thành công' });
  } catch (err) {
    console.error('Lỗi đổi mật khẩu:', err);
    return res.status(500).json({ message: 'Lỗi máy chủ' });
  }
});

app.put('/users/:id', async (req, res) => {
  const { id } = req.params;
  const { full_name, email, phone } = req.body;

  const client = new Client({
    host: 'localhost',
    port: 5432,
    database: 'warehouse',
    user: 'postgres',
    password: '514753',
    ssl: false,
  });

  try {
    await client.connect();

    await client.query(
      'UPDATE users SET full_name = $1, email = $2, phone = $3, updated_at = CURRENT_TIMESTAMP WHERE id = $4',
      [full_name, email, phone, id]
    );

    await client.end();
    return res.json({ message: 'Cập nhật thông tin thành công' });
  } catch (err) {
    console.error('Lỗi cập nhật thông tin:', err);
    return res.status(500).json({ message: 'Lỗi máy chủ' });
  }
});

app.put('/departments/:id', async (req, res) => {
  const { id } = req.params;
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
    // Trả về bản ghi đã cập nhật
    const result = await client.query(
      `UPDATE departments
       SET code = $1, name = $2, description = $3, is_active = $4, updated_at = CURRENT_TIMESTAMP
       WHERE id = $5
       RETURNING *`, // Thêm RETURNING * để lấy bản ghi đã cập nhật
      [code, name, description, is_active, id]
    );
    await client.end();
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Không tìm thấy phòng ban để cập nhật' });
    }
    res.json(result.rows[0]); // Trả về phòng ban đã cập nhật
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Cập nhật vai trò theo ID
app.put('/roles/:id', async (req, res) => {
  const { id } = req.params;
  const { name, description, status } = req.body; // permissions không cập nhật ở đây cho đơn giản

  // Kiểm tra các trường bắt buộc
  if (!name) {
    return res.status(400).json({ success: false, error: 'Tên vai trò là bắt buộc.' });
  }
  if (status && !['active', 'inactive'].includes(status)) {
    return res.status(400).json({ success: false, error: "Trạng thái không hợp lệ. Chỉ chấp nhận 'active' hoặc 'inactive'." });
  }


  const client = new Client({
    host: 'localhost',
    port: 5432,
    database: 'warehouse',
    user: 'postgres',
    password: '514753', // Thay bằng mật khẩu của bạn
    ssl: false
  });

  try {
    await client.connect();
    const result = await client.query(
      `UPDATE roles
       SET name = $1, description = $2, status = $3, updated_at = CURRENT_TIMESTAMP
       WHERE id = $4
       RETURNING *`, // Thêm RETURNING * để lấy bản ghi đã cập nhật
      [name, description, status || 'active', id] // Nếu status không được cung cấp, mặc định là 'active'
    );
    await client.end();

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Không tìm thấy vai trò để cập nhật' });
    }

    res.json(result.rows[0]); // Trả về vai trò đã được cập nhật
  } catch (err) {
    console.error('Lỗi cập nhật vai trò:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Xoá user theo ID
app.delete('/users/:id', async (req, res) => {
  const { id } = req.params;
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
    const result = await client.query('DELETE FROM users WHERE id = $1 RETURNING *', [id]);
    await client.end();
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Không tìm thấy user để xoá' });
    }
    res.json({ success: true, deleted: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Cập nhật danh mục sản phẩm theo ID
app.put('/product-categories/:id', async (req, res) => {
  const { id } = req.params;
  const { name, description, is_active } = req.body;
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
    const result = await client.query(
      `UPDATE product_categories
       SET name = $1, description = $2, is_active = COALESCE($3, is_active), updated_at = CURRENT_TIMESTAMP
       WHERE id = $4
       RETURNING *`,
      [name, description, is_active, id]
    );
    await client.end();
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Không tìm thấy danh mục để cập nhật' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});
