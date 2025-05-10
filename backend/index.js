const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');

const app = express();
app.use(cors());
app.use(express.json());

// 数据库连接配置
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '', // TODO: 修改为你的真实密码
  database: 'wms_test'      // TODO: 修改为你的数据库名
});

db.connect(err => {
  if (err) {
    console.error('数据库连接失败:', err);
  } else {
    console.log('数据库连接成功');
  }
});

// 获取所有商品
app.get('/api/products', (req, res) => {
  db.query('SELECT * FROM product', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// 新增商品
app.post('/api/products', (req, res) => {
  const { code, name, category, spec, unit, price, stock } = req.body;
  db.query(
    'INSERT INTO product (code, name, category, spec, unit, price, stock) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [code, name, category, spec, unit, price, stock],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: result.insertId });
    }
  );
});

// 启动服务
app.listen(3001, () => {
  console.log('后端API服务已启动，端口3001');
}); 