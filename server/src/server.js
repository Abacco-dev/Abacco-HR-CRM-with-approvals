require('dotenv').config();

const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const morgan = require('morgan');

// Import routers
const { hashPassword, verifyPassword, signToken, authenticate, authorize } = require("../utils/auth");
const { authRouter } = require('./routes/auth');
// const { protectedRouter } = require('../../se');
const employeesRouter = require('./routes/employees');
const teamRoutes = require("./routes/teams");
const targetsRouter = require('./routes/targets');
const performanceRouter = require('./routes/performance');
const attendanceActivityRouter= require('./routes/attendanceActivity');
const trainingRouter = require('./routes/training');
const recruitmentRouter = require('./routes/recruitment');
const engagementRouter = require('./routes/engagement');
const compensationRouter = require('./routes/compensation');
const analyticsRouter = require('./routes/analytics');
const documentsRouter = require('./routes/documents');
const approvalsRouter = require('./routes/approvals');  // adjust path if approvals.js is not in routes
console.log('Approvals router required in server.js');  // <-- add this here

// Error handler middleware
const { errorHandler } = require('./utils/error');

const app = express();
app.use(express.json());
app.use(helmet());
app.use(express.json({ limit: '2mb' }));
app.use(cookieParser());
app.use(morgan('dev'));
app.use(cors({
  origin: process.env.CLIENT_ORIGIN || 'http://localhost:5174',
  credentials: true
}));

// Health check route
app.get('/', (req, res) => res.json({
  name: 'Abacco HR CRM API',
  status: 'ok'
}));

// Auth routes
app.use('/api/auth', authRouter);
app.use('/api/approvals', (req, res, next) => {
  console.log(`Request received for /api/approvals: ${req.method} ${req.url}`);
  next();
}, approvalsRouter);

// Protected routes (ensure these are protected by your auth logic)
// app.use('/api/protected', protectedRouter);

// Other domain-specific API routes
app.use('/api/employees', employeesRouter);
app.use("/api/teams", teamRoutes);
app.use('/api/targets', targetsRouter);
app.use('/api/performance', performanceRouter);
app.use("/api/attendance", attendanceActivityRouter);
app.use('/api/recruitment', recruitmentRouter);
app.use('/api/engagement', engagementRouter);
app.use('/api/compensation', compensationRouter);
app.use('/api/analytics', analyticsRouter);
app.use('/api/documents', documentsRouter);
app.use('/api/approvals', approvalsRouter);  


// Global error handler (important: last middleware)


// Auth routes
app.use('/api/auth', authRouter);
app.use(errorHandler);
app.listen(4000, () => {
  console.log("Server running on port 4000")
})

