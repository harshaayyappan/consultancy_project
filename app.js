const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const mysql = require('mysql');
const multer = require('multer');
const fs = require('fs');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Set up the MySQL connection
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root', 
  password: 'harsha', 
  database: 'users'
});

// Connect to MySQL
connection.connect(err => {
  if (err) {
    console.error('Error connecting to the database: ' + err.stack);
    return;
  }
  console.log('Connected to database with thread ID: ' + connection.threadId);
});

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'images1') // make sure the folder exists
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
  }
});

const upload = multer({ storage: storage });

// Send the login HTML file as a response to the root path
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'admin.html'));
});

// Handle POST request from the login form
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  connection.query('SELECT * FROM users WHERE username = ?', [username], (error, results, fields) => {
    if (error) {
      console.error('Database query error: ' + error);
      res.status(500).send('Internal Server Error');
      return;
    }
    if (results.length > 0 && results[0].password === password) {
      res.sendFile(path.join(__dirname, 'get.html')); // Direct serving of get.html after successful login
    } else {
      res.send('Invalid Username or Password');
    }
  });
});

// Route for handling file uploads
app.post('/upload', upload.single('image'), (req, res) => {
  if (req.file) {
    res.send('Image uploaded successfully!');
  } else {
    res.send('Error uploading file.');
  }
});

const port = 5000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});



// Serve static files directly from the root directory
app.use(express.static(path.join(__dirname)));

// Serve images from 'images1' directory
app.use('/images1', express.static(path.join(__dirname, 'images1')));

// Serve index.html from the root directory
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Endpoint to get images list
app.get('/images', (req, res) => {
    const directoryPath = path.join(__dirname, 'images1');
    fs.readdir(directoryPath, function(err, files) {
        if (err) {
            return res.status(500).send({
                message: "Unable to scan images directory",
                error: err
            });
        }
        const images = files.filter(file => file.endsWith('.jpg'));
        res.send(images);
    });
});

