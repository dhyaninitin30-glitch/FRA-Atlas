// FRA Atlas Backend Server
// Professional Node.js + Express server with modular architecture

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const routes = require('./routes');

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

// Mount API routes
app.use('/api', routes);

// Root endpoint
app.get('/', (req, res) => {
    res.json({
        message: 'FRA Atlas Backend API',
        version: '2.0',
        status: 'running',
        endpoints: {
            health: '/api/health',
            claims: '/api/claims',
            auth: '/api/auth/verify-aadhaar',
            sms: '/api/sms',
            dss: '/api/dss',
            reports: '/api/reports'
        }
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Endpoint not found',
        path: req.path
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// Start server
app.listen(PORT, () => {
    console.log('╔══════════════════════════════════════════════════════════╗');
    console.log('║                                                          ║');
    console.log('║        🌳 FRA Atlas Backend Server Running! 🌳          ║');
    console.log('║                                                          ║');
    console.log('╚══════════════════════════════════════════════════════════╝');
    console.log('');
    console.log(`🚀 Server: http://localhost:${PORT}`);
    console.log(`📍 API Base: http://localhost:${PORT}/api`);
    console.log(`💚 Health: http://localhost:${PORT}/api/health`);
    console.log('');
    console.log('📊 Available Endpoints:');
    console.log('   GET  /api/health');
    console.log('   POST /api/auth/verify-aadhaar');
    console.log('   GET  /api/claims');
    console.log('   POST /api/claims');
    console.log('   GET  /api/claims/:id');
    console.log('   PUT  /api/claims/:id');
    console.log('   DELETE /api/claims/:id');
    console.log('   POST /api/sms/approval');
    console.log('   POST /api/sms/rejection');
    console.log('   POST /api/dss/recommend');
    console.log('   GET  /api/dss/schemes');
    console.log('   GET  /api/reports/district/:id');
    console.log('   POST /api/reports/custom');
    console.log('');
    console.log('✅ Backend is ready! Frontend can now connect.');
    console.log('');
});

module.exports = app;
