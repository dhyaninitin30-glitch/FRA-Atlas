// Feedback Routes
const express = require('express');
const router = express.Router();
const feedbackController = require('../controllers/feedback.controller');

// GET /api/feedback - Get all feedback
router.get('/', feedbackController.getAllFeedback);

// POST /api/feedback - Submit feedback
router.post('/', feedbackController.submitFeedback);

module.exports = router;
