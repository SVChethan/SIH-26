// Main Node.js Express REST API Server
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const { router: projectsRouter } = require('./routes/projects');
const auditLogsRouter = require('./routes/auditLogs');

app.use('/api/projects', projectsRouter);
app.use('/api/audit', auditLogsRouter);

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ONLINE',
    system: 'CIVIC-EYE AI Node.js Backend API',
    timestamp: new Date().toISOString(),
    version: '3.4.0'
  });
});

app.listen(PORT, () => {
  console.log(`🚀 CIVIC-EYE Node.js REST API Server running on port ${PORT}`);
});
