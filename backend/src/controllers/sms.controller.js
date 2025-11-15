// SMS Controller
// Handles SMS notifications via Twilio

const { twilioClient, TWILIO_ENABLED, TWILIO_PHONE_NUMBER } = require('../config/twilio');
const { claims } = require('./claims.controller');

// Send approval SMS
const sendApprovalSMS = async (req, res) => {
    const { phoneNumber, claimId, role } = req.body;
    
    console.log(`📱 SMS Approval Request:`);
    console.log(`   Phone: ${phoneNumber}`);
    console.log(`   Claim: ${claimId}`);
    console.log(`   Role: ${role}`);
    
    try {
        // Update claim status
        const claimIndex = claims.findIndex(c => c.id === claimId || c.claim_number === claimId);
        if (claimIndex !== -1) {
            claims[claimIndex].status = role === 'district' ? 'state-review' : 'approved';
            claims[claimIndex].updated_at = new Date().toISOString();
        }
        
        // Prepare SMS message
        const smsText = `${role === 'district' ? 'District' : 'State'} approval successful for Claim ${claimId}. Your FRA claim has been approved. Ministry of Tribal Affairs.`;
        
        // Send real SMS if Twilio is configured
        if (TWILIO_ENABLED && twilioClient) {
            // Format phone number for Twilio (add +91 for India if not present)
            let formattedPhone = phoneNumber;
            if (!formattedPhone.startsWith('+')) {
                formattedPhone = '+91' + formattedPhone;
            }
            
            const message = await twilioClient.messages.create({
                body: smsText,
                from: TWILIO_PHONE_NUMBER,
                to: formattedPhone
            });
            
            console.log(`✅ Real SMS sent successfully!`);
            console.log(`   Message SID: ${message.sid}`);
            console.log(`   Status: ${message.status}`);
            
            res.json({
                success: true,
                message: 'SMS sent successfully',
                data: {
                    phoneNumber: formattedPhone,
                    claimId,
                    role,
                    smsText,
                    messageSid: message.sid,
                    status: message.status,
                    realSMS: true
                }
            });
        } else {
            // Mock SMS (for testing without Twilio)
            console.log(`📱 MOCK SMS (Twilio not configured):`);
            console.log(`   Message: ${smsText}`);
            
            res.json({
                success: true,
                message: 'SMS sent successfully (MOCK)',
                data: {
                    phoneNumber,
                    claimId,
                    role,
                    smsText,
                    realSMS: false,
                    note: 'Configure Twilio credentials in .env file to send real SMS'
                }
            });
        }
    } catch (error) {
        console.error(`❌ SMS sending failed:`, error.message);
        
        res.status(500).json({
            success: false,
            message: 'Failed to send SMS',
            error: error.message
        });
    }
};

// Send rejection SMS
const sendRejectionSMS = async (req, res) => {
    const { phoneNumber, claimId, role, reason } = req.body;
    
    console.log(`📱 SMS Rejection Request:`);
    console.log(`   Phone: ${phoneNumber}`);
    console.log(`   Claim: ${claimId}`);
    console.log(`   Role: ${role}`);
    console.log(`   Reason: ${reason}`);
    
    try {
        // Update claim status
        const claimIndex = claims.findIndex(c => c.id === claimId || c.claim_number === claimId);
        if (claimIndex !== -1) {
            claims[claimIndex].status = 'rejected';
            claims[claimIndex].remarks = reason;
            claims[claimIndex].updated_at = new Date().toISOString();
        }
        
        // Prepare SMS message
        const smsText = `${role === 'district' ? 'District' : 'State'} review: Claim ${claimId} requires revision. ${reason}. Ministry of Tribal Affairs.`;
        
        // Send real SMS if Twilio is configured
        if (TWILIO_ENABLED && twilioClient) {
            // Format phone number for Twilio (add +91 for India if not present)
            let formattedPhone = phoneNumber;
            if (!formattedPhone.startsWith('+')) {
                formattedPhone = '+91' + formattedPhone;
            }
            
            const message = await twilioClient.messages.create({
                body: smsText,
                from: TWILIO_PHONE_NUMBER,
                to: formattedPhone
            });
            
            console.log(`✅ Real SMS sent successfully!`);
            console.log(`   Message SID: ${message.sid}`);
            console.log(`   Status: ${message.status}`);
            
            res.json({
                success: true,
                message: 'SMS sent successfully',
                data: {
                    phoneNumber: formattedPhone,
                    claimId,
                    role,
                    reason,
                    smsText,
                    messageSid: message.sid,
                    status: message.status,
                    realSMS: true
                }
            });
        } else {
            // Mock SMS (for testing without Twilio)
            console.log(`📱 MOCK SMS (Twilio not configured):`);
            console.log(`   Message: ${smsText}`);
            
            res.json({
                success: true,
                message: 'SMS sent successfully (MOCK)',
                data: {
                    phoneNumber,
                    claimId,
                    role,
                    reason,
                    smsText,
                    realSMS: false,
                    note: 'Configure Twilio credentials in .env file to send real SMS'
                }
            });
        }
    } catch (error) {
        console.error(`❌ SMS sending failed:`, error.message);
        
        res.status(500).json({
            success: false,
            message: 'Failed to send SMS',
            error: error.message
        });
    }
};

module.exports = {
    sendApprovalSMS,
    sendRejectionSMS
};
