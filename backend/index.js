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

// 新增入库单（含明细，事务处理）
app.post('/api/inbounds', (req, res) => {
  const { code, date, type, supplier, status, remark, products } = req.body;
  // 参数校验
  if (!code || !date || !type || !supplier || !status || !Array.isArray(products) || products.length === 0) {
    return res.status(400).json({ error: '所有字段和商品明细均为必填' });
  }
  for (const item of products) {
    if (!item.product || !item.quantity || typeof item.price !== 'number') {
      return res.status(400).json({ error: '商品明细字段不完整' });
    }
  }

  db.beginTransaction(err => {
    if (err) return res.status(500).json({ error: '开启事务失败: ' + err.message });

    // 插入主表
    const sqlMain = 'INSERT INTO inbound (code, date, type, supplier, status, remark) VALUES (?, ?, ?, ?, ?, ?)';
    db.query(sqlMain, [code, date, type, supplier, status, remark], (err, result) => {
      if (err) {
        return db.rollback(() => {
          if (err.code === 'ER_DUP_ENTRY') {
            res.status(409).json({ error: '入库单号已存在' });
          } else {
            res.status(500).json({ error: err.message });
          }
        });
      }
      const inboundId = result.insertId;
      // 构造明细数据
      const items = products.map(item => [inboundId, item.product, item.quantity, item.price]);
      const sqlDetail = 'INSERT INTO inbound_item (inbound_id, product_code, quantity, price) VALUES ?';
      db.query(sqlDetail, [items], (err, result2) => {
        if (err) {
          return db.rollback(() => {
            res.status(500).json({ error: '明细写入失败: ' + err.message });
          });
        }
        db.commit(err => {
          if (err) {
            return db.rollback(() => {
              res.status(500).json({ error: '提交事务失败: ' + err.message });
            });
          }
          res.json({ success: true, id: inboundId, items: result2.affectedRows });
        });
      });
    });
  });
});

// 获取所有入库单
app.get('/api/inbounds', (req, res) => {
  db.query('SELECT * FROM inbound', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

app.use((req, res) => {
  res.status(404).send('Not Found');
});

// 启动服务
app.listen(3001, () => {
  console.log('后端API服务已启动，端口3001');
}); 