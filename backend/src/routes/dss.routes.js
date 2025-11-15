// DSS Routes
const express = require('express');
const router = express.Router();
const dssController = require('../controllers/dss.controller');

// POST /api/dss/recommend - Get scheme recommendations
router.post('/recommend', dssController.getRecommendations);

// GET /api/dss/schemes - Get all schemes
router.get('/schemes', dssController.getAllSchemes);

module.exports = router;
