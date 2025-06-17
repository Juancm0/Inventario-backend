const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const db = new sqlite3.Database('./database.db');

app.use(cors());
app.use(express.json());

// Crear tabla si no existe
db.run(`CREATE TABLE IF NOT EXISTS productos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nombre TEXT,
  cantidad INTEGER,
  categoria TEXT
)`);

// Obtener todos
app.get('/productos', (req, res) => {
  db.all('SELECT * FROM productos', [], (err, rows) => {
    if (err) return res.status(500).json(err);
    res.json(rows);
  });
});

// Agregar nuevo
app.post('/productos', (req, res) => {
  const { nombre, cantidad, categoria } = req.body;
  db.run('INSERT INTO productos (nombre, cantidad, categoria) VALUES (?, ?, ?)',
    [nombre, cantidad, categoria],
    function (err) {
      if (err) return res.status(500).json(err);
      res.json({ id: this.lastID });
    });
});

// Eliminar por ID
app.delete('/productos/:id', (req, res) => {
  db.run('DELETE FROM productos WHERE id = ?', [req.params.id], function (err) {
    if (err) return res.status(500).json(err);
    res.json({ eliminado: this.changes });
  });
});

// Editar por ID
app.put('/productos/:id', (req, res) => {
  const { nombre, cantidad, categoria } = req.body;
  db.run('UPDATE productos SET nombre=?, cantidad=?, categoria=? WHERE id=?',
    [nombre, cantidad, categoria, req.params.id],
    function (err) {
      if (err) return res.status(500).json(err);
      res.json({ actualizado: this.changes });
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor en puerto ${PORT}`));
