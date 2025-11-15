// ============================================
// BACK4APP CONFIGURATION
// ============================================

const BACK4APP_CONFIG = {
    applicationId: '7v4ACBBMxwbJ2vdfaRLLz6HkktlcnmhJsSaQlq',
    javascriptKey: 'AYCDcKY2o8kjlATGKcF56Oq1rpS8r2LuDPWjlY9y',
    serverURL: 'https://parseapi.back4app.com'
};

// Back4App API Functions
async function getClaimsFromBack4App() {
    try {
        const response = await fetch(`${BACK4APP_CONFIG.serverURL}/classes/Class`, {
            headers: {
                'X-Parse-Application-Id': BACK4APP_CONFIG.applicationId,
                'X-Parse-JavaScript-Key': BACK4APP_CONFIG.javascriptKey
            }
        });
        const data = await response.json();
        console.log('✅ Claims from Back4App:', data.results);
        return data.results || [];
    } catch (error) {
        console.error('❌ Error fetching claims:', error);
        return [];
    }
}

async function createClaimInBack4App(claimData) {
    try {
        const response = await fetch(`${BACK4APP_CONFIG.serverURL}/classes/Class`, {
            method: 'POST',
            headers: {
                'X-Parse-Application-Id': BACK4APP_CONFIG.applicationId,
                'X-Parse-JavaScript-Key': BACK4APP_CONFIG.javascriptKey,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(claimData)
        });
        const data = await response.json();
        console.log('✅ Claim created in Back4App:', data);
        return data;
    } catch (error) {
        console.error('❌ Error creating claim:', error);
        throw error;
    }
}

console.log('🚀 Back4App integration loaded!');
