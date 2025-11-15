// Main Router
// Combines all route modules

const express = require('express');
const router = express.Router();

// Import route modules
const claimsRoutes = require('./claims.routes');
const authRoutes = require('./auth.routes');
const smsRoutes = require('./sms.routes');
const dssRoutes = require('./dss.routes');
const reportsRoutes = require('./reports.routes');
const feedbackRoutes = require('./feedback.routes');
const issuesRoutes = require('./issues.routes');

// Health check
router.get('/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        message: 'FRA Atlas Backend Server is running',
        timestamp: new Date().toISOString(),
        version: '2.0'
    });
});

// Mount route modules
router.use('/claims', claimsRoutes);
router.use('/auth', authRoutes);
router.use('/sms', smsRoutes);
router.use('/dss', dssRoutes);
router.use('/reports', reportsRoutes);
router.use('/feedback', feedbackRoutes);
router.use('/issues', issuesRoutes);

module.exports = router;
