const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const profileRoutes = require('./routes/profile');
const uploadRoutes = require('./routes/upload');
const { errorHandler } = require('./middleware/errorHandler');
const { notFound } = require('./middleware/notFound');
const { initializeTables } = require('./database/database');

const app = express();
const PORT = process.env.PORT || 3001;

// Security middleware
app.use(helmet());

// CORS configuration
app.use(cors({
  origin: [
    process.env.CORS_ORIGIN || 'http://localhost:3000',
    'http://localhost:3002', // Test UI
    'http://127.0.0.1:3002'  // Test UI alternative
  ],
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.'
  }
});
app.use(limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static files for uploaded images
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// API root endpoint
app.get('/api', (req, res) => {
  res.json({
    message: 'Profile API is running!',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      profile: '/api/profile',
      upload: '/api/upload'
    },
    documentation: 'Check the README.md for detailed API documentation'
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/upload', uploadRoutes);

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

// Initialize database and start server
async function startServer() {
  try {
    console.log('🔄 Initializing database...');
    await initializeTables();
    console.log('✅ Database initialization complete');
    
    // Start server
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📊 Health check: http://localhost:${PORT}/health`);
      console.log(`🔗 API Base URL: http://localhost:${PORT}/api`);
      console.log(`📚 Available endpoints:`);
      console.log(`   - GET  /api (API info)`);
      console.log(`   - POST /api/auth/register (Register user)`);
      console.log(`   - POST /api/auth/login (Login user)`);
      console.log(`   - GET  /api/auth/me (Get current user)`);
      console.log(`   - POST /api/profile (Create profile)`);
      console.log(`   - GET  /api/profile/me (Get own profile)`);
      console.log(`   - PUT  /api/profile/me (Update profile)`);
      console.log(`   - GET  /api/profile/search (Search profiles)`);
    });
  } catch (error) {
    console.error('❌ Failed to initialize database:', error.message);
    process.exit(1);
  }
}

// Start the server
startServer();

module.exports = app; 