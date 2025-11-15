// Reports Routes
const express = require('express');
const router = express.Router();
const reportsController = require('../controllers/reports.controller');

// GET /api/reports/district/:id - Get district report
router.get('/district/:id', reportsController.getDistrictReport);

// POST /api/reports/custom - Generate custom report
router.post('/custom', reportsController.generateCustomReport);

module.exports = router;
