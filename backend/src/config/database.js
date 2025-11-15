// Database Configuration
// Mock database for demo - Replace with MongoDB/PostgreSQL in production

const mockClaims = [
    {
        id: 'FRA2025-JH-001',
        claim_number: 'FRA2025-JH-001',
        applicant_name: 'Ramesh Kumar',
        aadhaar_number: '234567890123',
        mobile_number: '9876543210',
        village: 'Jharia',
        district: 'dhanbad',
        state: 'jharkhand',
        claim_type: 'IFR',
        land_area: 2.5,
        ai_score: 92,
        status: 'approved',
        latitude: 23.7957,
        longitude: 86.4304,
        created_at: '2025-01-15',
        updated_at: '2025-01-20'
    },
    {
        id: 'FRA2025-JH-002',
        claim_number: 'FRA2025-JH-002',
        applicant_name: 'Sunita Devi',
        aadhaar_number: '345678901234',
        mobile_number: '9123456789',
        village: 'Koderma',
        district: 'koderma',
        state: 'jharkhand',
        claim_type: 'CFR',
        land_area: 1.8,
        ai_score: 78,
        status: 'pending',
        latitude: 24.4669,
        longitude: 85.5956,
        created_at: '2025-01-18',
        updated_at: '2025-01-18'
    }
];

// Aadhaar verification database
const aadhaarDatabase = {
    verified: {
        '234567890123': {
            name: 'Ramesh Kumar Gond',
            village: 'Kanha Village',
            district: 'Mandla District',
            status: 'verified',
            autoApprove: true,
            message: 'Claim automatically approved'
        },
        '345678901234': {
            name: 'Sunita Devi',
            village: 'Koderma Village',
            district: 'Koderma District',
            status: 'verified',
            autoApprove: true,
            message: 'Claim automatically approved'
        }
    },
    disputed: {
        '456789012345': {
            name: 'Arjun Singh',
            village: 'Hazaribagh Village',
            district: 'Hazaribagh District',
            status: 'disputed',
            autoApprove: false,
            issue: 'Property ownership conflict',
            reason: 'Land already claimed by another person',
            message: 'Sent to District Officer for manual review'
        },
        '567890123456': {
            name: 'Priya Sharma',
            village: 'Ranchi Village',
            district: 'Ranchi District',
            status: 'disputed',
            autoApprove: false,
            issue: 'Boundary dispute with neighbor',
            reason: 'Overlapping land coordinates',
            message: 'Sent to District Officer for manual review'
        }
    },
    rejected: {
        '111111111111': {
            reason: 'Aadhaar number invalid/fake',
            message: 'Claim automatically rejected'
        },
        '999999999999': {
            reason: 'Already used in another claim',
            message: 'Claim automatically rejected'
        }
    }
};

// Schemes database
const schemesDatabase = [
    { 
        id: 1, 
        name: 'PM-KISAN', 
        beneficiaries: 1200,
        eligibility: 85, 
        description: 'Direct income support' 
    },
    { 
        id: 2, 
        name: 'Jal Jeevan Mission', 
        beneficiaries: 850,
        eligibility: 78, 
        description: 'Tap water connection' 
    },
    { 
        id: 3, 
        name: 'MGNREGA', 
        beneficiaries: 650,
        eligibility: 92, 
        description: 'Employment guarantee' 
    },
    { 
        id: 4, 
        name: 'Green India Mission', 
        beneficiaries: 420,
        eligibility: 88, 
        description: 'Forest conservation' 
    }
];

module.exports = {
    mockClaims,
    aadhaarDatabase,
    schemesDatabase
};
