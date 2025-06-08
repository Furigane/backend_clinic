const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  port: 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE
});

app.post('/api/records', (req, res) => {
  const { email, username, isAdmin, name, phone, service, doctor, date, time } = req.body;
  const query = `INSERT INTO records (EMAIL, USERNAME, ISADMIN, FULLNAME, PHONE, SERVICE, DOCTOR, DATE, TIME)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  db.execute(query, [email, username, isAdmin, name, phone, service, doctor, date, time], (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: 'Запись успешно сохранена' });
  });
});

app.get('/api/records', (req, res) => {
  const query = 'SELECT * FROM records';
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});

app.delete('/api/records/:id', (req, res) => {
  const id = req.params.id;
  const query = 'DELETE FROM records WHERE id = ?';
  
  db.execute(query, [id], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Запись не найдена' });
    }
    
    res.json({ message: 'Запись успешно удалена' });
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Сервер запущен на http://localhost:${PORT}`);
});