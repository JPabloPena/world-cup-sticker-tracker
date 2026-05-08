import express from 'express';
import cors from 'cors';
import initSqlJs from 'sql.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

const DB_PATH = path.join(__dirname, 'data', 'stickers.db');

app.use(cors());
app.use(express.json());

let db;
let SQL;

async function getDb() {
  if (!db) {
    SQL = await initSqlJs();
    if (fs.existsSync(DB_PATH)) {
      const buffer = fs.readFileSync(DB_PATH);
      db = new SQL.Database(buffer);
    } else {
      db = new SQL.Database();
    }
  }
  return db;
}

function saveDb() {
  if (db) {
    const data = db.export();
    const buffer = Buffer.from(data);
    fs.writeFileSync(DB_PATH, buffer);
  }
}

app.get('/api/stickers', async (req, res) => {
  const { search } = req.query;
  const database = await getDb();
  
  let sql = 'SELECT * FROM stickers';
  const params = [];
  
  if (search) {
    sql += ' WHERE id LIKE ? OR name LIKE ? OR country_code LIKE ?';
    const term = `%${search}%`;
    params.push(term, term, term);
  }
  
  sql += ' ORDER BY country_code, position';
  
  try {
    const result = database.exec(sql, params);
    if (result.length === 0) {
      return res.json([]);
    }
    const columns = result[0].columns;
    const values = result[0].values;
    const stickers = values.map(row => {
      const obj = {};
      columns.forEach((col, i) => obj[col] = row[i]);
      return obj;
    });
    res.json(stickers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/stickers/:id', async (req, res) => {
  const database = await getDb();
  const result = database.exec('SELECT * FROM stickers WHERE id = ?', [req.params.id]);
  
  if (result.length === 0 || result[0].values.length === 0) {
    return res.status(404).json({ error: 'Sticker not found' });
  }
  
  const columns = result[0].columns;
  const row = result[0].values[0];
  const sticker = {};
  columns.forEach((col, i) => sticker[col] = row[i]);
  
  res.json(sticker);
});

app.put('/api/stickers/:id', async (req, res) => {
  const database = await getDb();
  const { count } = req.body;
  
  if (typeof count !== 'number' || count < 0) {
    return res.status(400).json({ error: 'Invalid count' });
  }
  
  database.run('UPDATE stickers SET count = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?', [count, req.params.id]);
  saveDb();
  
  const result = database.exec('SELECT * FROM stickers WHERE id = ?', [req.params.id]);
  
  if (result.length === 0 || result[0].values.length === 0) {
    return res.status(404).json({ error: 'Sticker not found' });
  }
  
  const columns = result[0].columns;
  const row = result[0].values[0];
  const sticker = {};
  columns.forEach((col, i) => sticker[col] = row[i]);
  
  res.json(sticker);
});

app.get('/api/stats', async (req, res) => {
  const database = await getDb();
  
  const result = database.exec(`
    SELECT 
      country_code,
      SUM(CASE WHEN count > 0 THEN 1 ELSE 0 END) as collected,
      SUM(CASE WHEN count > 1 THEN count - 1 ELSE 0 END) as duplicates,
      COUNT(*) as total
    FROM stickers
    GROUP BY country_code
    ORDER BY country_code
  `);
  
  if (result.length === 0) {
    return res.json([]);
  }
  
  const columns = result[0].columns;
  const values = result[0].values;
  const stats = values.map(row => {
    const obj = {};
    columns.forEach((col, i) => obj[col] = row[i]);
    return obj;
  });
  
  res.json(stats);
});

app.post('/api/seed', async (req, res) => {
  res.json({ message: 'Use npm run seed to reseed the database' });
});

app.get('/api/missing', async (req, res) => {
  const database = await getDb();
  const { country } = req.query;
  
  let sql = `
    SELECT country_code, id, position
    FROM stickers
    WHERE count = 0
    ORDER BY country_code, position
  `;
  const params = [];
  
  if (country) {
    sql = `
      SELECT country_code, id, position
      FROM stickers
      WHERE count = 0 AND country_code = ?
      ORDER BY country_code, position
    `;
    params.push(country.toUpperCase());
  }
  
  try {
    const result = database.exec(sql, params);
    if (result.length === 0) {
      return res.json([]);
    }
    
    const columns = result[0].columns;
    const values = result[0].values;
    
    const grouped = {};
    values.forEach(row => {
      const countryCode = row[0];
      const stickerId = row[1];
      const position = row[2];
      const numId = position;
      
      if (!grouped[countryCode]) {
        grouped[countryCode] = [];
      }
      grouped[countryCode].push(numId);
    });
    
    const response = Object.entries(grouped).map(([countryCode, missingIds]) => ({
      country_code: countryCode,
      missing_ids: missingIds
    }));
    
    res.json(response);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/duplicates', async (req, res) => {
  const database = await getDb();
  const { country } = req.query;
  
  let sql = `
    SELECT country_code, id, position, count
    FROM stickers
    WHERE count > 1
    ORDER BY country_code, position
  `;
  const params = [];
  
  if (country) {
    sql = `
      SELECT country_code, id, position, count
      FROM stickers
      WHERE count > 1 AND country_code = ?
      ORDER BY country_code, position
    `;
    params.push(country.toUpperCase());
  }
  
  try {
    const result = database.exec(sql, params);
    if (result.length === 0) {
      return res.json([]);
    }
    
    const columns = result[0].columns;
    const values = result[0].values;
    
    const grouped = {};
    values.forEach(row => {
      const countryCode = row[0];
      const stickerId = row[1];
      const duplicateCount = row[3] - 1;
      
      if (!grouped[countryCode]) {
        grouped[countryCode] = [];
      }
      grouped[countryCode].push({ id: stickerId, count: duplicateCount });
    });
    
    const response = Object.entries(grouped).map(([countryCode, duplicates]) => ({
      country_code: countryCode,
      duplicates
    }));
    
    res.json(response);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const CLIENT_BUILD = path.join(__dirname, '..', 'client', 'dist');

app.use(express.static(CLIENT_BUILD));

app.get('*', (req, res) => {
  res.sendFile(path.join(CLIENT_BUILD, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
  console.log(`Database: ${DB_PATH}`);
});