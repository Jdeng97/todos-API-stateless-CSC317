const sqlite3 = require("sqlite3").verbose();

// Create or open the 'todos.db' database
const db = new sqlite3.Database("todos.db", (err) => {
  if (err) {
    return console.error("Error opening database:", err.message);
  }
  console.log("Connected to the todos database.");
});

db.run(`
    CREATE TABLE IF NOT EXISTS todos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      priority TEXT DEFAULT 'low',
      isComplete INTEGER DEFAULT 0,
      isFun INTEGER DEFAULT 0
    )
  `, (err) => {
    if (err) {
      return console.error("Error creating todos table:", err.message);
    }
    console.log("Todos table created (if it didn't already exist).");
  });

  module.exports = db;