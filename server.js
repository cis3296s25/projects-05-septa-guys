const express = require('express');
const path = require('path');
const { spawn } = require('child_process');
const cors = require('cors');
const http = require('http');

// Create main Express app
const app = express();
const PORT = process.env.PORT || 8080;
const BACKEND_PORT = process.env.BACKEND_PORT || 3000;

// Enable CORS
app.use(cors());

// Serve static files from the frontend directory
app.use(express.static(path.join(__dirname, 'frontend')));

// Start the backend server as a separate process
const backendServer = spawn('node', ['backend/server.js'], {
  env: { ...process.env, PORT: BACKEND_PORT.toString() }
});

// Log backend server output
backendServer.stdout.on('data', (data) => {
  console.log(`Backend: ${data}`);
});

backendServer.stderr.on('data', (data) => {
  console.error(`Backend Error: ${data}`);
});

backendServer.on('close', (code) => {
  console.log(`Backend server exited with code ${code}`);
});

// Wait for backend to start up
console.log(`Waiting for backend to start on port ${BACKEND_PORT}...`);
setTimeout(() => {
  console.log('Backend should be ready now');
}, 2000);

// Route all API requests to the backend
app.all('/api/*', (req, res) => {
  console.log(`Proxying request to backend: ${req.method} ${req.url}`);
  
  // Fix the URL path if needed
  let apiPath = req.url;
  // Remove the trailing "1" if it exists (for the specific error in the screenshot)
  if (apiPath.endsWith('delays1')) {
    apiPath = apiPath.replace('delays1', 'delays');
  }
  
  const options = {
    hostname: 'localhost',
    port: BACKEND_PORT,
    path: apiPath,
    method: req.method,
    headers: {
      ...req.headers,
      host: `localhost:${BACKEND_PORT}`
    }
  };
  
  console.log(`Forwarding to: http://localhost:${BACKEND_PORT}${apiPath}`);
  
  const proxyReq = http.request(options, (proxyRes) => {
    console.log(`Backend responded with status: ${proxyRes.statusCode}`);
    res.writeHead(proxyRes.statusCode, proxyRes.headers);
    proxyRes.pipe(res);
  });
  
  proxyReq.on('error', (e) => {
    console.error('Proxy error:', e);
    res.status(500).send(`Backend server error: ${e.message}`);
  });
  
  // End the request properly
  if (req.body) {
    proxyReq.write(JSON.stringify(req.body));
  }
  proxyReq.end();
});

// Serve the index.html file for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'index.html'));
});

// Start the main server
app.listen(PORT, () => {
  console.log(`Main server running at http://localhost:${PORT}`);
  console.log(`Backend API proxied through http://localhost:${PORT}/api`);
});

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('Shutting down servers...');
  backendServer.kill();
  process.exit();
});