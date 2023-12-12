// Import the required modules
const http = require('http');

// Create a simple HTTP server
const server = http.createServer((req, res) => {
  // Check if the request is for the root path
  if (req.url === '/') {
    // Set the response header
    res.writeHead(200, { 'Content-Type': 'text/plain' });

    // Send the response message
    res.end('Hello world, This is my Node.js server\n');
  } else {
    // If the request is for a different path, return a 404 response
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('404 Not Found\n');
  }
});

// Define the port to listen on
const port = 10000;

// Start the server and listen for incoming requests
server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
