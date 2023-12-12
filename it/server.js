// server.js

const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');
const mysql = require('mysql');
const { parse } = require('querystring');

// Create a MySQL connection
const connection = mysql.createConnection({
  host: 'your_mysql_host',
  user: 'your_mysql_user',
  password: 'your_mysql_password',
  database: 'your_mysql_database'
});

// Connect to MySQL
connection.connect(err => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL');
});

// Create a simple HTTP server
const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);

  if (req.method === 'GET' && parsedUrl.pathname === '/') {
    // Serve the index.html file
    const filePath = path.join(__dirname, 'index.html');
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Internal Server Error');
        return;
      }
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(data);
    });
  } else if (req.method === 'POST' && parsedUrl.pathname === '/signin') {
    // Handle SignIn form submission
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });

    req.on('end', () => {
      const formData = parse(body);
      const username = formData.username;
      const password = formData.password;

      // Check credentials in the MySQL database
      connection.query(
        'SELECT * FROM users WHERE username = ? AND password = ?',
        [username, password],
        (err, results) => {
          if (err) {
            console.error('Error querying MySQL:', err);
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('Internal Server Error');
            return;
          }

          if (results.length > 0) {
            // Successful SignIn, display welcome page
            res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.end('Welcome ' + username);
          } else {
            // Invalid credentials
            res.writeHead(401, { 'Content-Type': 'text/plain' });
            res.end('Invalid credentials');
          }
        }
      );
    });
  } else if (req.method === 'POST' && parsedUrl.pathname === '/signup') {
    // Handle SignUp form submission
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });

    req.on('end', () => {
      const formData = parse(body);
      const username = formData.username;
      const password = formData.password;

      // Insert new user into the MySQL database
      connection.query(
        'INSERT INTO users (username, password) VALUES (?, ?)',
        [username, password],
        (err, results) => {
          if (err) {
            console.error('Error querying MySQL:', err);
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('Internal Server Error');
            return;
          }

          // Successful SignUp, redirect to index.html
          res.writeHead(302, { 'Location': '/' });
          res.end();
        }
      );
    });
  } else {
    // Handle other paths
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  }
});

// Start the server and listen for incoming requests
const port = 10000;
server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
