/**
 * HOME PPK - Backend API Server
 * Runs on Node.js/Express for Render deployment
 */

import express from 'express';
import cors from 'cors';
import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Load environment variables
config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Import routes
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import billRoutes from './routes/bills.js';
import paymentRoutes from './routes/payments.js';
import currentBillRoute from './routes/current-bill.js';
import paymentRoute from './routes/payment.js';
import paymentHistoryRoute from './routes/payment-history.js';
import requestRoutes from './routes/requests.js';
import expenseRoutes from './routes/expenses.js';
import utilityRoutes from './routes/utilities.js';
import regulationRoutes from './routes/regulations.js';
import adminRoutes from './routes/admin.js';
import statisticsRoutes from './routes/statistics.js';
import waterRecordRoute from './routes/water-record.js';
import formsRoute from './routes/forms.js';
import adminSettingsRoute from './routes/admin-settings.js';
import profileRoute from './routes/profile.js';
import slipVerifyRoute from './routes/slip-verify.js';
import accountingRoute from './routes/accounting.js';
import disbursementRoute from './routes/disbursement.js';
import monthlyBillRoute from './routes/monthly-bill.js';
import electricityRecordRoute from './routes/electricity-record.js';
import adminRequestsQueueRoute from './routes/AdminRequestsQueue.js';

const app = express();
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'HOME PPK Backend API is running',
    timestamp: new Date().toISOString(),
    environment: NODE_ENV
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/bills', billRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/payments/history', paymentHistoryRoute);
app.use('/api/current-bill', currentBillRoute);
app.use('/api/payment', paymentRoute);
app.use('/api/requests', requestRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/utilities', utilityRoutes);
app.use('/api/regulations', regulationRoutes);
app.use('/api/statistics', statisticsRoutes);
app.use('/api/water-record', waterRecordRoute);
app.use('/api/admin', adminRoutes);
app.use('/api/forms', formsRoute);
app.use('/api/admin-settings', adminSettingsRoute);
app.use('/api/profile', profileRoute);
app.use('/api/slip-verify', slipVerifyRoute);
app.use('/api/accounting', accountingRoute);
app.use('/api/disbursement', disbursementRoute);
app.use('/api/monthly-bill', monthlyBillRoute);
app.use('/api/electricity-record', electricityRecordRoute);
app.use('/api/admin-requests-queue', adminRequestsQueueRoute);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    app: 'HOME PPK Housing Management System',
    version: '1.0.0',
    environment: NODE_ENV,
    endpoints: {
      health: '/health',
      auth: '/api/auth',
      users: '/api/users',
      bills: '/api/bills',
      payments: '/api/payments',
      requests: '/api/requests',
      expenses: '/api/expenses',
      utilities: '/api/utilities',
      regulations: '/api/regulations',
      admin: '/api/admin'
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found',
    path: req.path,
    method: req.method
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  
  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';
  
  res.status(status).json({
    success: false,
    error: message,
    ...(NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════╗
║        HOME PPK Backend API            ║
║        Environment: ${NODE_ENV.padEnd(22)}║
║        Port: ${String(PORT).padEnd(30)}║
╚════════════════════════════════════════╝
  `);
  console.log(`✓ Server running at http://localhost:${PORT}`);
  console.log(`✓ CORS enabled for: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`);
});

export default app;
