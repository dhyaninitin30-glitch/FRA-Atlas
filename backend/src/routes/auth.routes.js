// Authentication Routes
const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

// POST /api/auth/verify-aadhaar - Verify Aadhaar number
router.post('/verify-aadhaar', authController.verifyAadhaar);

module.exports = router;
