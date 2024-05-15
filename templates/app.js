const express = require('express');
const bcrypt = require('bcryptjs');
const mysql = require('mysql');


const app = express();
app.use(express.json()); // for parsing application/json
app.use(express.static('public')); // serve static files from public directory

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'harsha',
  database: 'users'
});

connection.connect(err => {
  if (err) throw err;
  console.log('Connected to the MySQL server.');
});

app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  connection.query(
    'INSERT INTO users (username, password) VALUES (?, ?)',
    [username, hashedPassword],
    (error, results) => {
      if (error) {
        console.error(error);
        res.status(500).send("User registration failed.");
      } else {
        res.status(201).send(`User created with ID: ${results.insertId}`);
      }
    }
  );
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  connection.query(
    'SELECT * FROM users WHERE username = ?',
    [username],
    async (error, results) => {
      if (error) {
        console.error(error);
        res.status(500).send("Login failed.");
      } else if (results.length > 0) {
        const isValid = await bcrypt.compare(password, results[0].password);
        if (isValid) {
          res.send('Login successful');
        } else {
          res.status(400).send('Invalid username or password');
        }
      } else {
        res.status(400).send('Invalid username or password');
      }
    }
  );
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
