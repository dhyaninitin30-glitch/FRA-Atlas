// Claims Routes
const express = require('express');
const router = express.Router();
const claimsController = require('../controllers/claims.controller');

// GET /api/claims - Get all claims
router.get('/', claimsController.getAllClaims);

// GET /api/claims/:id - Get claim by ID
router.get('/:id', claimsController.getClaimById);

// POST /api/claims - Create new claim
router.post('/', claimsController.createClaim);

// PUT /api/claims/:id - Update claim
router.put('/:id', claimsController.updateClaim);

// DELETE /api/claims/:id - Delete claim
router.delete('/:id', claimsController.deleteClaim);

module.exports = router;
