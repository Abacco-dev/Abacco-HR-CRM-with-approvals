// src/server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');

// Import routes
const authRouter = require('./routes/auth');
const employeesRouter = require('./routes/employees');

const app = express();

// Middleware
app.use(cors({
  origin: process.env.CLIENT_ORIGIN || 'http://localhost:5174',
  credentials: true,
}));
app.use(express.json());

// Routes
app.get('/', (req, res) => res.send('Abacco HR CRM API is running'));
app.use('/api/auth', authRouter);
app.use('/api/employees', employeesRouter);

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});
// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

module.exports = app;
