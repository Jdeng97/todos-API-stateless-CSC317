// server.js
// A simple Express.js backend for a Todo list API

const express = require('express');
const path = require('path')
const app = express();
const port = 3000;
const db = require('./db');

// Middleware to parse JSON requests
app.use(express.json());

// Middle ware to inlcude static content
app.use(express.static('public'))
/*

// In-memory array to store todo items
let todos = [
  {
  id: 0,
  name: 'nina',
  priority: 'high',
  isComplete: false,
  isFun: false
}
];
let nextId = 1;
*/


// server index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// GET all todo items
app.get('/todos', (req, res) => {
  db.all('SELECT * FROM todos', (err, rows) => {
    if (err) {
      return res.status(500).send('Error fetching todos');
    }
    console.log('All Todos:', rows);
    res.json(rows);
  });
});

// GET a specific todo item by ID
app.get('/todos/:id', (req, res) => {
  const todoId = req.params.id;
  db.get('SELECT * FROM todos WHERE id = ?', [todoId], (err, row) => {
    if (err) {
      return res.status(500).send('Error fetching todo');
    }
    if (!row) {
      return res.status(404).send('Todo not found');
    }
    console.log('Found Todo:', row);
    res.json(row);
  });
});
// POST a new todo item
app.post('/todos', (req, res) => {
  const { name, priority = 'low', isFun = false } = req.body;

  if (!name) {
    return res.status(400).send('Name is required');
  }

  db.run('INSERT INTO todos (name, priority, isFun) VALUES (?, ?, ?)', [name, priority, isFun ? 1 : 0], function (err) {
    if (err) {
      return res.status(500).send('Error adding todo');
    }
    console.log('New Todo Added:', { id: this.lastID, name, priority, isFun });
    const newTodo = {
      id: this.lastID,
      name,
      priority,
      isFun: isFun ? 1 : 0,
      isComplete: 0,
    };
    res.status(201).json(newTodo);
  });
});

// DELETE a todo item by ID
app.delete('/todos/:id', (req, res) => {
  const todoId = req.params.id;

  db.run('DELETE FROM todos WHERE id = ?', [todoId], function (err) {
    if (err) {
      return res.status(500).send('Error deleting todo');
    }
    if (this.changes === 0) {
      return res.status(404).send('Todo not found');
    }
    console.log(`Todo item ${todoId} deleted`);
    res.send(`Todo item ${todoId} deleted`);
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Todo API server running at http://localhost:${port}`);
});