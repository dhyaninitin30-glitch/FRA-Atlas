// SMS Routes
const express = require('express');
const router = express.Router();
const smsController = require('../controllers/sms.controller');

// POST /api/sms/approval - Send approval SMS
router.post('/approval', smsController.sendApprovalSMS);

// POST /api/sms/rejection - Send rejection SMS
router.post('/rejection', smsController.sendRejectionSMS);

module.exports = router;
