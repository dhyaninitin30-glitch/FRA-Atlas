// Authentication Controller
// Handles Aadhaar verification and authentication

const { aadhaarDatabase } = require('../config/database');

// Verify Aadhaar
const verifyAadhaar = (req, res) => {
    const { aadhaarNumber, mobileNumber } = req.body;
    
    console.log(`🔐 Aadhaar Verification Request:`);
    console.log(`   Aadhaar: ${aadhaarNumber}`);
    console.log(`   Mobile: ${mobileNumber}`);
    
    // Simulate processing delay
    setTimeout(() => {
        // Check if Aadhaar is in rejected list
        if (aadhaarDatabase.rejected[aadhaarNumber]) {
            const rejectedData = aadhaarDatabase.rejected[aadhaarNumber];
            console.log(`❌ Verification FAILED: ${rejectedData.reason}`);
            
            return res.status(400).json({
                success: false,
                message: 'Aadhaar verification failed',
                error: rejectedData.reason,
                data: {
                    verified: false,
                    aadhaarNumber: aadhaarNumber,
                    status: 'rejected',
                    reason: rejectedData.reason,
                    resultMessage: rejectedData.message
                }
            });
        }
        
        // Check if Aadhaar is in verified list
        if (aadhaarDatabase.verified[aadhaarNumber]) {
            const userData = aadhaarDatabase.verified[aadhaarNumber];
            console.log(`✅ Verification successful for: ${userData.name}`);
            console.log(`   Status: ${userData.status.toUpperCase()}`);
            
            return res.json({
                success: true,
                message: 'Aadhaar verified successfully',
                data: {
                    verified: true,
                    name: userData.name,
                    village: userData.village,
                    district: userData.district,
                    address: {
                        village: userData.village,
                        district: userData.district
                    },
                    aadhaarNumber: aadhaarNumber,
                    mobileNumber: mobileNumber,
                    status: userData.status,
                    autoApprove: userData.autoApprove,
                    resultMessage: userData.message,
                    verificationId: `VER-${Date.now()}`,
                    timestamp: new Date().toISOString()
                }
            });
        }
        
        // Check if Aadhaar is in disputed list
        if (aadhaarDatabase.disputed[aadhaarNumber]) {
            const userData = aadhaarDatabase.disputed[aadhaarNumber];
            console.log(`⚠️  Verification DISPUTED for: ${userData.name}`);
            console.log(`   Issue: ${userData.issue}`);
            
            return res.json({
                success: true,
                message: 'Aadhaar verified with disputes',
                data: {
                    verified: true,
                    name: userData.name,
                    village: userData.village,
                    district: userData.district,
                    address: {
                        village: userData.village,
                        district: userData.district
                    },
                    aadhaarNumber: aadhaarNumber,
                    mobileNumber: mobileNumber,
                    status: userData.status,
                    autoApprove: userData.autoApprove,
                    issue: userData.issue,
                    reason: userData.reason,
                    resultMessage: userData.message,
                    verificationId: `VER-${Date.now()}`,
                    timestamp: new Date().toISOString()
                },
                dispute: {
                    reason: userData.reason,
                    issue: userData.issue
                }
            });
        }
        
        // If Aadhaar not in database - reject
        console.log(`❌ Verification FAILED: Aadhaar not found in database`);
        
        res.status(404).json({
            success: false,
            message: 'Aadhaar verification failed',
            error: 'Aadhaar number not found in government database',
            data: {
                verified: false,
                aadhaarNumber: aadhaarNumber,
                status: 'not_found',
                reason: 'Aadhaar number not registered or invalid',
                resultMessage: 'Verification failed - Please check your Aadhaar number'
            }
        });
        
    }, 1500); // 1.5 second delay to simulate API call
};

module.exports = {
    verifyAadhaar
};
