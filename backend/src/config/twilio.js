// Twilio Configuration
require('dotenv').config();
const twilio = require('twilio');

const TWILIO_ENABLED = 
    process.env.TWILIO_ACCOUNT_SID && 
    process.env.TWILIO_AUTH_TOKEN && 
    process.env.TWILIO_ACCOUNT_SID.startsWith('AC');

let twilioClient = null;

if (TWILIO_ENABLED) {
    try {
        twilioClient = twilio(
            process.env.TWILIO_ACCOUNT_SID,
            process.env.TWILIO_AUTH_TOKEN
        );
        console.log('✅ Twilio SMS service initialized');
        console.log(`   Account SID: ${process.env.TWILIO_ACCOUNT_SID.substring(0, 10)}...`);
    } catch (error) {
        console.log('⚠️  Twilio initialization failed:', error.message);
        console.log('   SMS will be mocked');
    }
} else {
    console.log('⚠️  Twilio not configured - SMS will be mocked');
    console.log('   To enable real SMS:');
    console.log('   1. Sign up at https://www.twilio.com/try-twilio');
    console.log('   2. Get Account SID, Auth Token, and Phone Number');
    console.log('   3. Update backend/.env file');
    console.log('   4. Restart server');
}

module.exports = {
    twilioClient,
    TWILIO_ENABLED,
    TWILIO_PHONE_NUMBER: process.env.TWILIO_PHONE_NUMBER
};
