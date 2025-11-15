// Issues Routes
const express = require('express');
const router = express.Router();
const issuesController = require('../controllers/issues.controller');

// GET /api/issues - Get all issues
router.get('/', issuesController.getAllIssues);

// POST /api/issues - Report issue
router.post('/', issuesController.reportIssue);

module.exports = router;
