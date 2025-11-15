// FRA Atlas v2.0 - Updated: 2025-01-07
// Dashboard data
const dashboardData = {
    kpis: {
        total: 10000,
        approved: 5000,
        pending: 4000,
        rejected: 1000
    },
    monthlyApprovals: [420, 380, 450, 520, 480, 560, 620, 580, 640, 700],
    monthlyPending: [350, 320, 380, 420, 400, 450, 480, 460, 500, 520],
    monthlyTotal: [850, 780, 920, 1050, 960, 1120, 1200, 1140, 1240, 1320],
    accuracyTrend: [85, 87, 89, 91, 88, 92, 94, 93, 95, 96],
    recentClaims: [
        { id: 'FRA2025001', name: 'Ramesh Kumar', village: 'Jharia', score: 92, status: 'approved' },
        { id: 'FRA2025002', name: 'Sunita Devi', village: 'Koderma', score: 78, status: 'pending' },
        { id: 'FRA2025003', name: 'Arjun Singh', village: 'Hazaribagh', score: 65, status: 'rejected' },
        { id: 'FRA2025004', name: 'Priya Sharma', village: 'Ranchi', score: 88, status: 'approved' },
        { id: 'FRA2025005', name: 'Mohan Lal', village: 'Dhanbad', score: 82, status: 'pending' },
        { id: 'FRA2025006', name: 'Kavita Singh', village: 'Bokaro', score: 95, status: 'approved' },
        { id: 'FRA2025007', name: 'Rajesh Yadav', village: 'Deoghar', score: 71, status: 'pending' },
        { id: 'FRA2025008', name: 'Anita Kumari', village: 'Giridih', score: 58, status: 'rejected' },
        { id: 'FRA2025009', name: 'Suresh Mahto', village: 'Palamu', score: 89, status: 'approved' },
        { id: 'FRA2025010', name: 'Geeta Devi', village: 'Garhwa', score: 76, status: 'pending' }
    ]
};

// Chart instances
let monthlyChart, accuracyChart, distributionChart, claimTypesChart;

// Map variables
let map, claimsLayerGroup, forestLayerGroup, waterLayerGroup, landUseLayerGroup, infrastructureLayerGroup;

// Claims management data
let claimsDatabase = [
    {
        id: 'FRA2025-JH-001',
        applicantName: 'Ramesh Kumar',
        aadhaarNumber: '234567890123',
        mobileNumber: '9876543210',
        aadhaarVerified: true,
        village: 'Jharia',
        district: 'dhanbad',
        state: 'jharkhand',
        claimType: 'IFR',
        landArea: 2.5,
        aiScore: 92,
        status: 'approved',
        latitude: 23.7957,
        longitude: 86.4304,
        document: 'fra_document_001.pdf',
        remarks: 'Traditional cultivation area',
        submittedDate: '2025-01-15',
        timeline: ['submitted', 'district-review', 'state-review', 'approved']
    },
    {
        id: 'FRA2025-JH-002',
        applicantName: 'Sunita Devi',
        aadhaarNumber: '345678901234',
        mobileNumber: '9123456789',
        aadhaarVerified: true,
        village: 'Koderma',
        district: 'koderma',
        state: 'jharkhand',
        claimType: 'CFR',
        landArea: 1.8,
        aiScore: 78,
        status: 'pending',
        latitude: 24.4669,
        longitude: 85.5956,
        document: 'fra_document_002.pdf',
        remarks: 'Community forest area',
        submittedDate: '2025-01-18',
        timeline: ['submitted', 'district-review']
    },
    {
        id: 'FRA2025-JH-003',
        applicantName: 'Arjun Singh',
        aadhaarNumber: '456789012345',
        mobileNumber: '9234567890',
        aadhaarVerified: true,
        village: 'Hazaribagh',
        district: 'hazaribagh',
        state: 'jharkhand',
        claimType: 'IFR',
        landArea: 3.2,
        aiScore: 65,
        status: 'rejected',
        latitude: 23.9441,
        longitude: 85.3647,
        document: 'fra_document_003.pdf',
        remarks: 'Insufficient documentation',
        submittedDate: '2025-01-10',
        timeline: ['submitted', 'district-review', 'rejected']
    },
    {
        id: 'FRA2025-JH-004',
        applicantName: 'Priya Sharma',
        aadhaarNumber: '567890123456',
        mobileNumber: '9345678901',
        aadhaarVerified: true,
        village: 'Ranchi',
        district: 'ranchi',
        state: 'jharkhand',
        claimType: 'CR',
        landArea: 4.1,
        aiScore: 88,
        status: 'approved',
        latitude: 23.3441,
        longitude: 85.3096,
        document: 'fra_document_004.pdf',
        remarks: 'Well documented claim',
        submittedDate: '2025-01-12',
        timeline: ['submitted', 'district-review', 'state-review', 'approved']
    },
    {
        id: 'FRA2025-JH-005',
        applicantName: 'Mohan Lal',
        aadhaarNumber: '678901234567',
        mobileNumber: '9456789012',
        aadhaarVerified: true,
        village: 'Dhanbad',
        district: 'dhanbad',
        state: 'jharkhand',
        claimType: 'IFR',
        landArea: 2.9,
        aiScore: 82,
        status: 'under-review',
        latitude: 23.7957,
        longitude: 86.4499,
        document: 'fra_document_005.pdf',
        remarks: 'Under verification',
        submittedDate: '2025-01-20',
        timeline: ['submitted', 'district-review']
    }
];

let claimIdCounter = 6;

// Review workflow data
let reviewDatabase = [
    {
        id: 'FRA2025-JH-001',
        applicantName: 'Ramesh Kumar',
        aadhaarNumber: '234567890123',
        mobileNumber: '9876543210',
        aadhaarVerified: true,
        village: 'Jharia',
        district: 'dhanbad',
        state: 'jharkhand',
        claimType: 'IFR',
        landArea: 2.5,
        aiScore: 92,
        status: 'district-review',
        priority: 'high',
        latitude: 23.7957,
        longitude: 86.4304,
        document: 'fra_document_001.pdf',
        submittedDate: '2025-01-15',
        reviewNotes: '',
        aiExtracted: {
            name: 'Ramesh Kumar',
            village: 'Jharia',
            coordinates: '23.7957, 86.4304',
            landArea: '2.5 hectares',
            claimType: 'Individual Forest Rights',
            confidence: 95
        },
        timeline: ['submitted', 'district-review'],
        reviewHistory: []
    },
    {
        id: 'FRA2025-JH-007',
        applicantName: 'Kavita Singh',
        aadhaarNumber: '345678901234',
        mobileNumber: '9123456789',
        aadhaarVerified: true,
        village: 'Bokaro',
        district: 'dhanbad',
        state: 'jharkhand',
        claimType: 'CFR',
        landArea: 4.2,
        aiScore: 87,
        status: 'pending',
        priority: 'high',
        latitude: 23.6693,
        longitude: 86.1511,
        document: 'fra_document_007.pdf',
        submittedDate: '2025-01-22',
        reviewNotes: '',
        aiExtracted: {
            name: 'Kavita Singh',
            village: 'Bokaro',
            coordinates: '23.6693, 86.1511',
            landArea: '4.2 hectares',
            claimType: 'Community Forest Rights',
            confidence: 87
        },
        timeline: ['submitted'],
        reviewHistory: []
    },
    {
        id: 'FRA-1762473659139',
        applicantName: 'Arman Ansari',
        aadhaarNumber: '456789012345',
        mobileNumber: '9234567890',
        aadhaarVerified: true,
        village: 'Khairanji',
        district: 'dhanbad',
        state: 'jharkhand',
        claimType: 'CFR',
        landArea: 3.5,
        aiScore: 81,
        status: 'pending',
        priority: 'medium',
        latitude: 23.7234,
        longitude: 86.4123,
        document: 'fra_document_009.pdf',
        submittedDate: '2025-01-23',
        reviewNotes: '',
        aiExtracted: {
            name: 'Arman Ansari',
            village: 'Khairanji',
            coordinates: '23.7234, 86.4123',
            landArea: '3.5 hectares',
            claimType: 'Community Forest Rights',
            confidence: 81
        },
        timeline: ['submitted'],
        reviewHistory: []
    }
];

let currentReviewView = 'district';
let reviewRefreshInterval;

// Assets mapping data
let assetsDatabase = [
    {
        id: 'AST-001',
        type: 'water',
        name: 'Village Pond',
        village: 'Jharia',
        district: 'dhanbad',
        state: 'jharkhand',
        area: 0.8,
        latitude: 23.7957,
        longitude: 86.4304,
        linkedClaimIds: ['FRA2025-JH-001', 'FRA2025-JH-005'],
        aiAccuracy: 94,
        description: 'Community water source'
    },
    {
        id: 'AST-002',
        type: 'agriculture',
        name: 'Paddy Fields',
        village: 'Jharia',
        district: 'dhanbad',
        state: 'jharkhand',
        area: 12.5,
        latitude: 23.7967,
        longitude: 86.4314,
        linkedClaimIds: ['FRA2025-JH-001'],
        aiAccuracy: 89,
        description: 'Traditional agricultural land'
    },
    {
        id: 'AST-003',
        type: 'forest',
        name: 'Community Forest',
        village: 'Koderma',
        district: 'koderma',
        state: 'jharkhand',
        area: 45.2,
        latitude: 24.4669,
        longitude: 85.5956,
        linkedClaimIds: ['FRA2025-JH-002'],
        aiAccuracy: 96,
        description: 'Dense forest area with mixed vegetation'
    },
    {
        id: 'AST-004',
        type: 'infrastructure',
        name: 'Primary School',
        village: 'Hazaribagh',
        district: 'hazaribagh',
        state: 'jharkhand',
        area: 0.2,
        latitude: 23.9441,
        longitude: 85.3647,
        linkedClaimIds: ['FRA2025-JH-003'],
        aiAccuracy: 91,
        description: 'Government primary school'
    },
    {
        id: 'AST-005',
        type: 'water',
        name: 'River Stream',
        village: 'Ranchi',
        district: 'ranchi',
        state: 'jharkhand',
        area: 2.1,
        latitude: 23.3441,
        longitude: 85.3096,
        linkedClaimIds: ['FRA2025-JH-004'],
        aiAccuracy: 87,
        description: 'Seasonal water stream'
    }
];

// Map variables for assets
let assetsMap, assetsLayerGroups = {};

// Feedback database
let feedbackDatabase = [
    {
        id: 'FBK-2025-001',
        claimId: 'FRA2025-JH-001',
        userName: 'Ramesh Kumar',
        category: 'delay',
        district: 'dhanbad',
        description: 'My claim has been pending for over 3 months without any update.',
        date: '2025-01-15',
        status: 'in-progress',
        attachment: 'document_001.pdf',
        timeline: [
            { action: 'Submitted', by: 'Ramesh Kumar', date: '2025-01-15', notes: 'Feedback submitted' },
            { action: 'Under Review', by: 'District Officer', date: '2025-01-18', notes: 'Assigned to review team' }
        ],
        response: 'Your claim is currently under state-level review. Expected resolution within 15 days.'
    },
    {
        id: 'FBK-2025-002',
        claimId: 'FRA2025-JH-002',
        userName: 'Sunita Devi',
        category: 'document',
        district: 'koderma',
        description: 'Unable to upload land survey document. System shows error.',
        date: '2025-01-18',
        status: 'resolved',
        attachment: null,
        timeline: [
            { action: 'Submitted', by: 'Sunita Devi', date: '2025-01-18', notes: 'Technical issue reported' },
            { action: 'Resolved', by: 'Technical Team', date: '2025-01-19', notes: 'Issue fixed, please retry upload' }
        ],
        response: 'Technical issue has been resolved. Please try uploading your document again.'
    },
    {
        id: 'FBK-2025-003',
        claimId: 'FRA2025-JH-003',
        userName: 'Arjun Singh',
        category: 'map',
        district: 'hazaribagh',
        description: 'Map coordinates showing wrong location for my land.',
        date: '2025-01-20',
        status: 'pending',
        attachment: 'map_error.jpg',
        timeline: [
            { action: 'Submitted', by: 'Arjun Singh', date: '2025-01-20', notes: 'Map error reported' }
        ],
        response: ''
    }
];

let feedbackIdCounter = 4;
let feedbackRefreshInterval;
let feedbackCategoryChart, feedbackVolumeChart;

// Issues tracker data
let issuesDatabase = [
    {
        id: 'ISS-JH-2025-001',
        title: 'Map layer not loading for Ranchi district',
        category: 'gis',
        priority: 'high',
        assignedTo: 'Technical Team',
        district: 'ranchi',
        description: 'GIS map layer fails to load when selecting Ranchi district. Shows blank screen.',
        status: 'in-progress',
        lastUpdated: '2025-01-22',
        createdDate: '2025-01-20',
        attachment: 'screenshot_001.png',
        comments: [
            { author: 'Admin', date: '2025-01-20', text: 'Issue reported and assigned to technical team' },
            { author: 'Technical Team', date: '2025-01-22', text: 'Investigating the layer configuration' }
        ]
    },
    {
        id: 'ISS-JH-2025-002',
        title: 'Duplicate claim entries in database',
        category: 'data',
        priority: 'high',
        assignedTo: 'District Officer',
        district: 'dhanbad',
        description: 'Found 5 duplicate claim entries with same applicant name and coordinates.',
        status: 'open',
        lastUpdated: '2025-01-23',
        createdDate: '2025-01-23',
        attachment: null,
        comments: [
            { author: 'State Officer', date: '2025-01-23', text: 'Critical data integrity issue. Please resolve ASAP.' }
        ]
    },
    {
        id: 'ISS-JH-2025-003',
        title: 'User unable to access review dashboard',
        category: 'access',
        priority: 'medium',
        assignedTo: 'Admin',
        district: 'koderma',
        description: 'District officer from Koderma cannot access the review workflow page.',
        status: 'resolved',
        lastUpdated: '2025-01-21',
        createdDate: '2025-01-19',
        attachment: null,
        comments: [
            { author: 'Admin', date: '2025-01-19', text: 'Checking user permissions' },
            { author: 'Admin', date: '2025-01-21', text: 'Permissions updated. Issue resolved.' }
        ]
    }
];

let issueIdCounter = 4;
let issuesRefreshInterval;
let issuesCategoryChart, issuesPriorityChart, issuesTimelineChart;

// Admin panel data
let usersDatabase = [
    {
        id: 'USR-2025-001',
        name: 'Ramesh Kumar',
        email: 'ramesh.kumar@example.com',
        phone: '+91-9876543210',
        role: 'citizen',
        district: 'dhanbad',
        status: 'active',
        lastLogin: '2025-01-23',
        createdDate: '2024-12-15'
    },
    {
        id: 'USR-2025-002',
        name: 'Priya Sharma',
        email: 'priya.sharma@gov.in',
        phone: '+91-9876543211',
        role: 'district',
        district: 'ranchi',
        status: 'active',
        lastLogin: '2025-01-24',
        createdDate: '2024-11-20'
    },
    {
        id: 'USR-2025-003',
        name: 'Rajesh Singh',
        email: 'rajesh.singh@gov.in',
        phone: '+91-9876543212',
        role: 'state',
        district: '',
        status: 'active',
        lastLogin: '2025-01-24',
        createdDate: '2024-10-10'
    }
];

let activityLogsDatabase = [
    {
        id: 'LOG-001',
        user: 'Ramesh Kumar',
        action: 'Submitted new claim',
        module: 'Claims',
        timestamp: '2025-01-24 10:30:45',
        ipAddress: '192.168.1.100'
    },
    {
        id: 'LOG-002',
        user: 'Priya Sharma',
        action: 'Approved claim FRA2025-JH-001',
        module: 'Review',
        timestamp: '2025-01-24 11:15:22',
        ipAddress: '192.168.1.101'
    },
    {
        id: 'LOG-003',
        user: 'Rajesh Singh',
        action: 'Viewed dashboard analytics',
        module: 'Dashboard',
        timestamp: '2025-01-24 09:45:10',
        ipAddress: '192.168.1.102'
    }
];

let permissionsMatrix = {
    'Dashboard': { citizen: true, district: true, state: true, admin: true },
    'Map': { citizen: true, district: true, state: true, admin: true },
    'Claims': { citizen: true, district: true, state: true, admin: true },
    'Review': { citizen: false, district: true, state: true, admin: true },
    'Assets': { citizen: false, district: true, state: true, admin: true },
    'Feedback': { citizen: true, district: true, state: true, admin: true },
    'Issues': { citizen: false, district: true, state: true, admin: true },
    'Admin': { citizen: false, district: false, state: false, admin: true },
    'Reports': { citizen: false, district: true, state: true, admin: true }
};

let userIdCounter = 4;
let actionsPerModuleChart;

// DSS data and AI logic
let dssClaimsData = [
    {
        claimId: 'FRA2025-JH-001',
        village: 'Jharia',
        district: 'dhanbad',
        state: 'jharkhand',
        aiScore: 92,
        landArea: 2.5,
        waterIndex: 0.3,
        forestCover: 45,
        soilDegraded: false,
        aiVerified: true,
        linkedAssets: 2,
        recommendedSchemes: [],
        priority: 'high',
        status: 'pending'
    },
    {
        claimId: 'FRA2025-JH-002',
        village: 'Koderma',
        district: 'koderma',
        state: 'jharkhand',
        aiScore: 88,
        landArea: 4.2,
        waterIndex: 0.2,
        forestCover: 75,
        soilDegraded: false,
        aiVerified: true,
        linkedAssets: 3,
        recommendedSchemes: [],
        priority: 'high',
        status: 'pending'
    },
    {
        claimId: 'FRA2025-JH-003',
        village: 'Hazaribagh',
        district: 'hazaribagh',
        state: 'jharkhand',
        aiScore: 78,
        landArea: 1.8,
        waterIndex: 0.6,
        forestCover: 30,
        soilDegraded: true,
        aiVerified: true,
        linkedAssets: 1,
        recommendedSchemes: [],
        priority: 'medium',
        status: 'pending'
    }
];

let schemeDefinitions = {
    'pm-kisan': {
        name: 'PM-KISAN',
        description: 'Direct income support for small farmers',
        icon: 'wheat',
        beneficiaries: 1200
    },
    'jal-jeevan': {
        name: 'Jal Jeevan Mission',
        description: 'Providing tap water connection to every rural household',
        icon: 'droplet',
        beneficiaries: 850
    },
    'mgnrega': {
        name: 'MGNREGA',
        description: 'Employment guarantee and land reclamation',
        icon: 'hard-hat',
        beneficiaries: 650
    },
    'green-india': {
        name: 'Green India Mission',
        description: 'Forest conservation and afforestation',
        icon: 'trees',
        beneficiaries: 420
    }
};

let currentDSSView = 'district';
let dssMap, schemeDistributionChart;

// Reports data
let reportsData = {
    districtPerformance: [
        { district: 'Ranchi', filed: 1250, approved: 890, pending: 280, avgDays: 2.8 },
        { district: 'Dhanbad', filed: 980, approved: 720, pending: 180, avgDays: 3.1 },
        { district: 'Hazaribagh', filed: 850, approved: 620, pending: 150, avgDays: 3.5 },
        { district: 'Koderma', filed: 720, approved: 580, pending: 90, avgDays: 2.5 }
    ],
    schemeImpact: [
        { scheme: 'PM-KISAN', beneficiaries: 3200, budget: '₹45.5 Cr', coverage: 85 },
        { scheme: 'Jal Jeevan Mission', beneficiaries: 2100, budget: '₹32.8 Cr', coverage: 72 },
        { scheme: 'MGNREGA', beneficiaries: 1800, budget: '₹28.2 Cr', coverage: 68 },
        { scheme: 'Green India Mission', beneficiaries: 1400, budget: '₹22.5 Cr', coverage: 65 }
    ]
};

let claimsStatusChart, schemeDistChart, monthlyGrowthChart;

// DSS recommendations based on assets
const dssRecommendations = [
    {
        title: 'Jal Jeevan Mission',
        reason: 'Village has <2 water sources',
        condition: (assets) => assets.filter(a => a.type === 'water').length < 2
    },
    {
        title: 'PM-KISAN Scheme',
        reason: 'Large agricultural area detected',
        condition: (assets) => assets.filter(a => a.type === 'agriculture').reduce((sum, a) => sum + a.area, 0) > 10
    },
    {
        title: 'Green India Mission',
        reason: 'High forest cover area',
        condition: (assets) => assets.filter(a => a.type === 'forest').reduce((sum, a) => sum + a.area, 0) > 30
    },
    {
        title: 'Sarva Shiksha Abhiyan',
        reason: 'Limited educational infrastructure',
        condition: (assets) => assets.filter(a => a.type === 'infrastructure' && a.name.includes('School')).length < 2
    }
];

// Mock GeoJSON data for claims
const mockClaimsData = {
    type: "FeatureCollection",
    features: [
        {
            type: "Feature",
            properties: {
                claimId: "FRA2025001",
                holderName: "Ramesh Kumar",
                village: "Jharia",
                district: "Dhanbad",
                state: "Jharkhand",
                status: "approved",
                aiScore: 92,
                claimType: "IFR",
                area: "2.5 hectares"
            },
            geometry: {
                type: "Point",
                coordinates: [86.4304, 23.7957]
            }
        },
        {
            type: "Feature",
            properties: {
                claimId: "FRA2025002",
                holderName: "Sunita Devi",
                village: "Koderma",
                district: "Koderma",
                state: "Jharkhand",
                status: "pending",
                aiScore: 78,
                claimType: "CFR",
                area: "1.8 hectares"
            },
            geometry: {
                type: "Point",
                coordinates: [85.5956, 24.4669]
            }
        },
        {
            type: "Feature",
            properties: {
                claimId: "FRA2025003",
                holderName: "Arjun Singh",
                village: "Hazaribagh",
                district: "Hazaribagh",
                state: "Jharkhand",
                status: "rejected",
                aiScore: 65,
                claimType: "IFR",
                area: "3.2 hectares"
            },
            geometry: {
                type: "Point",
                coordinates: [85.3647, 23.9441]
            }
        },
        {
            type: "Feature",
            properties: {
                claimId: "FRA2025004",
                holderName: "Priya Sharma",
                village: "Ranchi",
                district: "Ranchi",
                state: "Jharkhand",
                status: "approved",
                aiScore: 88,
                claimType: "CR",
                area: "4.1 hectares"
            },
            geometry: {
                type: "Point",
                coordinates: [85.3096, 23.3441]
            }
        },
        {
            type: "Feature",
            properties: {
                claimId: "FRA2025005",
                holderName: "Mohan Lal",
                village: "Dhanbad",
                district: "Dhanbad",
                state: "Jharkhand",
                status: "pending",
                aiScore: 82,
                claimType: "IFR",
                area: "2.9 hectares"
            },
            geometry: {
                type: "Point",
                coordinates: [86.4499, 23.7957]
            }
        }
    ]
};

// Page content templates
const pageTemplates = {
    dashboard: {
        title: 'FRA Claim Monitoring Dashboard',
        content: 'dashboard' // Special case - handled separately
    },
    map: {
        title: 'Integrated FRA Atlas (Map View)',
        content: 'map' // Special case - handled separately
    },
    claims: {
        title: 'FRA Claims Management System',
        content: 'claims' // Special case - handled separately
    },
    review: {
        title: 'Claim Review & Verification Portal',
        content: 'review' // Special case - handled separately
    },
    assets: {
        title: 'FRA Asset Mapping & Geo Intelligence',
        content: 'assets' // Special case - handled separately
    },
    feedback: {
        title: 'FRA Feedback & Grievance Portal',
        content: 'feedback' // Special case - handled separately
    },
    issues: {
        title: 'FRA Internal Issues Monitor',
        content: 'issues' // Special case - handled separately
    },
    admin: {
        title: 'Administrative Control Center',
        content: 'admin' // Special case - handled separately
    },
    dss: {
        title: 'AI-Powered Decision Support System',
        content: 'dss' // Special case - handled separately
    },
    reports: {
        title: 'Reports & Performance Analytics',
        content: 'reports' // Special case - handled separately
    }
};

// DOM Elements
const sidebar = document.getElementById('sidebar');
const sidebarToggle = document.getElementById('sidebarToggle');
const mainContent = document.getElementById('mainContent');
const pageContent = document.getElementById('pageContent');
const navLinks = document.querySelectorAll('.nav-link');

// Current page state
let currentPage = 'dashboard';

// Utility function to safely get modal elements
function safeGetModalElements(...elementIds) {
    const elements = elementIds.map(id => document.getElementById(id));
    const allExist = elements.every(el => el !== null);
    
    if (!allExist) {
        const missingIds = elementIds.filter((id, index) => elements[index] === null);
        console.warn('Modal elements not found:', missingIds.join(', '));
        return null;
    }
    
    return elements.length === 1 ? elements[0] : elements;
}

// Initialize the application
function init() {
    // Set up navigation event listeners
    navLinks.forEach(link => {
        link.addEventListener('click', handleNavigation);
    });

    // Set up sidebar toggle for mobile
    sidebarToggle.addEventListener('click', toggleSidebar);

    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 768) {
            if (!sidebar.contains(e.target) && !sidebarToggle.contains(e.target)) {
                closeSidebar();
            }
        }
    });

    // Handle window resize
    window.addEventListener('resize', handleResize);

    // Load initial page
    loadPage('dashboard');
}

// Handle navigation clicks
function handleNavigation(e) {
    e.preventDefault();

    const link = e.currentTarget;
    const page = link.getAttribute('data-page');

    if (page && page !== currentPage) {
        // Update active state
        navLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');

        // Load new page
        loadPage(page);

        // Close sidebar on mobile after navigation
        if (window.innerWidth <= 768) {
            closeSidebar();
        }
    }
}

// Load page content
function loadPage(pageName) {
    const template = pageTemplates[pageName];

    if (template) {
        currentPage = pageName;

        if (pageName === 'dashboard') {
            // Dashboard is already in HTML, just show it
            showDashboard();
        } else if (pageName === 'map') {
            // Map page is already in HTML, just show it
            showMapPage();
        } else if (pageName === 'claims') {
            // Claims page is already in HTML, just show it
            showClaimsPage();
        } else if (pageName === 'review') {
            // Review page is already in HTML, just show it
            showReviewPage();
        } else if (pageName === 'assets') {
            // Assets page is already in HTML, just show it
            showAssetsPage();
        } else if (pageName === 'feedback') {
            // Feedback page is already in HTML, just show it
            showFeedbackPage();
        } else if (pageName === 'issues') {
            // Issues page is already in HTML, just show it
            showIssuesPage();
        } else if (pageName === 'admin') {
            // Admin page is already in HTML, just show it
            showAdminPage();
        } else if (pageName === 'dss') {
            // DSS page is already in HTML, just show it
            showDSSPage();
        } else if (pageName === 'reports') {
            // Reports page is already in HTML, just show it
            showReportsPage();
        } else {
            // Create page content for other pages
            const pageHTML = `
                <div class="page active" id="${pageName}-page">
                    <h2>${template.title}</h2>
                    ${template.content}
                </div>
            `;

            // Update page content with fade effect
            pageContent.style.opacity = '0';

            setTimeout(() => {
                pageContent.innerHTML = pageHTML;
                pageContent.style.opacity = '1';

                // Update page title
                document.title = `${template.title} - FRA Atlas & DSS`;
            }, 150);
        }
    }
}

// Show dashboard and initialize charts
function showDashboard() {
    // Hide all pages first
    const allPages = document.querySelectorAll('.page');
    allPages.forEach(page => page.classList.remove('active'));

    // Show dashboard
    const dashboardPage = document.getElementById('dashboard-page');
    if (dashboardPage) {
        dashboardPage.classList.add('active');

        // Initialize dashboard components
        setTimeout(() => {
            initializeDashboard();
        }, 100);
    }

    document.title = 'FRA Claim Monitoring Dashboard - FRA Atlas & DSS';
}

// Initialize dashboard components
function initializeDashboard() {
    updateKPIs();
    populateClaimsTable();
    initializeCharts();
}

// Update KPI numbers with animation
function updateKPIs() {
    const kpis = dashboardData.kpis;

    animateNumber('totalClaims', kpis.total);
    animateNumber('approvedClaims', kpis.approved);
    animateNumber('pendingClaims', kpis.pending);
    animateNumber('rejectedClaims', kpis.rejected);
}

// Animate number counting
function animateNumber(elementId, targetValue) {
    const element = document.getElementById(elementId);
    if (!element) return;

    const startValue = 0;
    const duration = 2000;
    const startTime = performance.now();

    function updateNumber(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Easing function
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const currentValue = Math.floor(startValue + (targetValue - startValue) * easeOutQuart);

        element.textContent = currentValue.toLocaleString();

        if (progress < 1) {
            requestAnimationFrame(updateNumber);
        }
    }

    requestAnimationFrame(updateNumber);
}

// Populate claims table
function populateClaimsTable() {
    const tableBody = document.getElementById('claimsTableBody');
    if (!tableBody) return;

    const claims = dashboardData.recentClaims;

    tableBody.innerHTML = claims.map(claim => `
        <tr>
            <td><strong>${claim.id}</strong></td>
            <td>${claim.name}</td>
            <td>${claim.village}</td>
            <td><strong>${claim.score}%</strong></td>
            <td><span class="status-badge ${claim.status}">${claim.status}</span></td>
            <td><button class="view-btn" onclick="viewClaimDetails('${claim.id}')">View Details</button></td>
        </tr>
    `).join('');
}

// Initialize all charts
function initializeCharts() {
    initializeMonthlyChart();
    initializeAccuracyChart();
    initializeDistributionChart();
}

// Monthly Approvals Chart
function initializeMonthlyChart() {
    const ctx = document.getElementById('monthlyApprovalsChart');
    if (!ctx) return;

    if (monthlyChart) {
        monthlyChart.destroy();
    }

    monthlyChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
            datasets: [
                {
                    label: 'Approved',
                    data: dashboardData.monthlyApprovals,
                    backgroundColor: 'rgba(76, 175, 80, 0.3)',
                    borderColor: '#4CAF50',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4,
                    pointRadius: 0,
                    pointHoverRadius: 6,
                    pointHoverBackgroundColor: '#4CAF50',
                    pointHoverBorderColor: '#fff',
                    pointHoverBorderWidth: 2
                },
                {
                    label: 'Pending',
                    data: dashboardData.monthlyPending,
                    backgroundColor: 'rgba(33, 150, 243, 0.3)',
                    borderColor: '#2196F3',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4,
                    pointRadius: 0,
                    pointHoverRadius: 6,
                    pointHoverBackgroundColor: '#2196F3',
                    pointHoverBorderColor: '#fff',
                    pointHoverBorderWidth: 2
                },
                {
                    label: 'Total',
                    data: dashboardData.monthlyTotal,
                    backgroundColor: 'rgba(156, 204, 101, 0.2)',
                    borderColor: '#8BC34A',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4,
                    pointRadius: 0,
                    pointHoverRadius: 6,
                    pointHoverBackgroundColor: '#8BC34A',
                    pointHoverBorderColor: '#fff',
                    pointHoverBorderWidth: 2
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                mode: 'index',
                intersect: false
            },
            plugins: {
                legend: {
                    display: true,
                    position: 'bottom',
                    labels: {
                        color: '#546E7A',
                        font: { size: 12 },
                        padding: 15,
                        usePointStyle: true
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(27, 94, 32, 0.95)',
                    titleColor: '#ffffff',
                    bodyColor: '#ffffff',
                    borderColor: '#4CAF50',
                    borderWidth: 1,
                    padding: 12,
                    displayColors: true,
                    callbacks: {
                        label: function(context) {
                            return context.dataset.label + ': ' + context.parsed.y;
                        }
                    }
                }
            },
            scales: {
                x: {
                    stacked: true,
                    grid: {
                        color: '#E0E0E0',
                        display: false
                    },
                    ticks: {
                        color: '#546E7A',
                        font: { size: 11 }
                    }
                },
                y: {
                    stacked: true,
                    beginAtZero: true,
                    grid: {
                        color: '#E0E0E0'
                    },
                    ticks: {
                        color: '#546E7A',
                        font: { size: 11 }
                    }
                }
            },
            animation: {
                duration: 2000,
                easing: 'easeOutQuart'
            }
        }
    });
}

// AI Accuracy Trend Chart
function initializeAccuracyChart() {
    const ctx = document.getElementById('accuracyTrendChart');
    if (!ctx) return;

    if (accuracyChart) {
        accuracyChart.destroy();
    }

    accuracyChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
            datasets: [{
                label: 'AI Accuracy %',
                data: dashboardData.accuracyTrend,
                borderColor: '#4CAF50',
                backgroundColor: function(context) {
                    const chart = context.chart;
                    const {ctx, chartArea} = chart;
                    if (!chartArea) {
                        return null;
                    }
                    const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
                    gradient.addColorStop(0, 'rgba(76, 175, 80, 0.4)');
                    gradient.addColorStop(1, 'rgba(76, 175, 80, 0.05)');
                    return gradient;
                },
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointRadius: 0,
                pointHoverRadius: 8,
                pointHoverBackgroundColor: '#4CAF50',
                pointHoverBorderColor: '#ffffff',
                pointHoverBorderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                mode: 'index',
                intersect: false
            },
            plugins: {
                legend: {
                    display: true,
                    position: 'bottom',
                    labels: {
                        color: '#546E7A',
                        font: { size: 12 },
                        padding: 15,
                        usePointStyle: true
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(27, 94, 32, 0.95)',
                    titleColor: '#ffffff',
                    bodyColor: '#ffffff',
                    borderColor: '#4CAF50',
                    borderWidth: 1,
                    padding: 12,
                    callbacks: {
                        label: function (context) {
                            return `Accuracy: ${context.parsed.y}%`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: false,
                    min: 80,
                    max: 100,
                    grid: {
                        color: '#E0E0E0'
                    },
                    ticks: {
                        color: '#546E7A',
                        font: { size: 11 },
                        callback: function (value) {
                            return value + '%';
                        }
                    }
                },
                x: {
                    grid: {
                        color: '#E0E0E0',
                        display: false
                    },
                    ticks: {
                        color: '#546E7A',
                        font: { size: 11 }
                    }
                }
            },
            animation: {
                duration: 2000,
                easing: 'easeOutQuart'
            }
        }
    });
}

// Distribution Donut Chart
function initializeDistributionChart() {
    const ctx = document.getElementById('distributionChart');
    if (!ctx) return;

    if (distributionChart) {
        distributionChart.destroy();
    }

    const data = dashboardData.kpis;

    distributionChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Approved', 'Pending', 'Rejected'],
            datasets: [{
                data: [data.approved, data.pending, data.rejected],
                backgroundColor: ['#4CAF50', '#2196F3', '#FF9800'],
                borderColor: '#ffffff',
                borderWidth: 3,
                cutout: '65%'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 15,
                        usePointStyle: true,
                        color: '#546E7A',
                        font: { size: 12 }
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(27, 94, 32, 0.95)',
                    titleColor: '#ffffff',
                    bodyColor: '#ffffff',
                    borderColor: '#4CAF50',
                    borderWidth: 1,
                    padding: 12,
                    callbacks: {
                        label: function (context) {
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = ((context.parsed / total) * 100).toFixed(1);
                            return `${context.label}: ${context.parsed.toLocaleString()} (${percentage}%)`;
                        }
                    }
                }
            },
            animation: {
                duration: 2000,
                easing: 'easeOutQuart'
            }
        }
    });
}

// View claim details function
function viewClaimDetails(claimId) {
    alert(`Viewing details for claim: ${claimId}\n\nThis would open a detailed view in a real application.`);
}

// Show map page and initialize map
function showMapPage() {
    // Hide all pages first
    const allPages = document.querySelectorAll('.page');
    allPages.forEach(page => page.classList.remove('active'));

    // Show map page
    const mapPage = document.getElementById('map-page');
    if (mapPage) {
        mapPage.classList.add('active');

        // Initialize map components
        setTimeout(() => {
            initializeMap();
            initializeMapControls();
            initializeClaimTypesChart();
            initGeoDropdowns(); // Initialize geo hierarchy dropdowns
            initGeoSearch(); // Initialize geo search
            
            // Initialize Draw New Claim button
            if (typeof initDrawClaimButton === 'function') {
                initDrawClaimButton();
            }
        }, 100);
    }

    document.title = 'Integrated FRA Atlas (Map View) - FRA Atlas & DSS';
}

// Initialize the map
function initializeMap() {
    // Initialize map if not already done
    if (!map) {
        map = L.map('mapContainer').setView([23.6345, 85.3803], 7); // Centered on Jharkhand

        // Add base layers
        const satelliteLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
            attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
        });

        const osmLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        });

        // Add default layer
        satelliteLayer.addTo(map);

        // Initialize layer groups
        claimsLayerGroup = L.layerGroup().addTo(map);
        forestLayerGroup = L.layerGroup();
        waterLayerGroup = L.layerGroup();
        landUseLayerGroup = L.layerGroup();
        infrastructureLayerGroup = L.layerGroup();

        // Add claims data
        loadClaimsLayer();

        // Add fullscreen control
        map.addControl(new L.Control.Fullscreen());
        
        // Make map globally accessible
        window.map = map;
        
        // Initialize MapIntegration
        setTimeout(() => {
            initMapIntegration();
            initDrawClaimManager();
        }, 100);
    }
}

// Load claims layer
function loadClaimsLayer() {
    claimsLayerGroup.clearLayers();

    mockClaimsData.features.forEach(feature => {
        const { properties, geometry } = feature;
        const [lng, lat] = geometry.coordinates;

        // Create marker with status-based color
        const markerColor = getStatusColor(properties.status);
        const marker = L.circleMarker([lat, lng], {
            radius: 8,
            fillColor: markerColor,
            color: '#ffffff',
            weight: 2,
            opacity: 1,
            fillOpacity: 0.8
        });

        // Create popup content
        const popupContent = createPopupContent(properties);
        marker.bindPopup(popupContent);

        // Add to layer group
        claimsLayerGroup.addLayer(marker);
    });
}

// Get status color
function getStatusColor(status) {
    switch (status) {
        case 'approved': return '#10b981';
        case 'pending': return '#f59e0b';
        case 'rejected': return '#ef4444';
        default: return '#6b7280';
    }
}

// Create popup content
function createPopupContent(properties) {
    return `
        <div class="popup-content">
            <h4>${properties.claimId}</h4>
            <p><strong>Holder:</strong> ${properties.holderName}</p>
            <p><strong>Village:</strong> ${properties.village}</p>
            <p><strong>District:</strong> ${properties.district}</p>
            <p><strong>AI Score:</strong> ${properties.aiScore}%</p>
            <p><strong>Area:</strong> ${properties.area}</p>
            <p><strong>Status:</strong> <span class="popup-status ${properties.status}">${properties.status}</span></p>
            <button class="popup-btn" onclick="openClaimModal('${properties.claimId}')">View Full Details</button>
        </div>
    `;
}

// Initialize map controls
function initializeMapControls() {
    // Layer toggles
    document.getElementById('claimsLayer').addEventListener('change', function (e) {
        if (e.target.checked) {
            map.addLayer(claimsLayerGroup);
        } else {
            map.removeLayer(claimsLayerGroup);
        }
    });

    document.getElementById('forestLayer').addEventListener('change', function (e) {
        if (e.target.checked) {
            addForestLayer();
        } else {
            map.removeLayer(forestLayerGroup);
        }
    });

    document.getElementById('waterLayer').addEventListener('change', function (e) {
        if (e.target.checked) {
            addWaterLayer();
        } else {
            map.removeLayer(waterLayerGroup);
        }
    });

    document.getElementById('landUseLayer').addEventListener('change', function (e) {
        if (e.target.checked) {
            addLandUseLayer();
        } else {
            map.removeLayer(landUseLayerGroup);
        }
    });

    document.getElementById('infrastructureLayer').addEventListener('change', function (e) {
        if (e.target.checked) {
            addInfrastructureLayer();
        } else {
            map.removeLayer(infrastructureLayerGroup);
        }
    });

    // Filter controls
    document.getElementById('stateFilter').addEventListener('change', filterClaims);
    document.getElementById('districtFilter').addEventListener('change', filterClaims);
    document.getElementById('villageFilter').addEventListener('change', filterClaims);

    // Search functionality
    document.getElementById('mapSearch').addEventListener('input', searchClaims);
}

// Add forest layer (mock data)
function addForestLayer() {
    forestLayerGroup.clearLayers();

    // Add some mock forest polygons
    const forestAreas = [
        [[23.7, 85.3], [23.8, 85.3], [23.8, 85.4], [23.7, 85.4]],
        [[23.5, 85.5], [23.6, 85.5], [23.6, 85.6], [23.5, 85.6]]
    ];

    forestAreas.forEach(coords => {
        const polygon = L.polygon(coords, {
            color: '#22c55e',
            fillColor: '#22c55e',
            fillOpacity: 0.3,
            weight: 2
        });
        polygon.bindPopup('<div class="popup-content"><h4>Forest Area</h4><p>Protected forest region</p></div>');
        forestLayerGroup.addLayer(polygon);
    });

    map.addLayer(forestLayerGroup);
}

// Add water layer (mock data)
function addWaterLayer() {
    waterLayerGroup.clearLayers();

    // Add some mock water bodies
    const waterBodies = [
        [[23.6, 85.2], [23.65, 85.2], [23.65, 85.25], [23.6, 85.25]],
        [[23.9, 85.4], [23.95, 85.4], [23.95, 85.45], [23.9, 85.45]]
    ];

    waterBodies.forEach(coords => {
        const polygon = L.polygon(coords, {
            color: '#3b82f6',
            fillColor: '#3b82f6',
            fillOpacity: 0.5,
            weight: 2
        });
        polygon.bindPopup('<div class="popup-content"><h4>Water Body</h4><p>River/Pond/Lake</p></div>');
        waterLayerGroup.addLayer(polygon);
    });

    map.addLayer(waterLayerGroup);
}

// Add land use layer (mock data)
function addLandUseLayer() {
    landUseLayerGroup.clearLayers();

    // Add some mock land use areas
    const landUseAreas = [
        { coords: [[23.4, 85.1], [23.5, 85.1], [23.5, 85.2], [23.4, 85.2]], type: 'Agriculture', color: '#fbbf24' },
        { coords: [[23.8, 85.6], [23.9, 85.6], [23.9, 85.7], [23.8, 85.7]], type: 'Settlement', color: '#f87171' }
    ];

    landUseAreas.forEach(area => {
        const polygon = L.polygon(area.coords, {
            color: area.color,
            fillColor: area.color,
            fillOpacity: 0.4,
            weight: 2
        });
        polygon.bindPopup(`<div class="popup-content"><h4>Land Use</h4><p>Type: ${area.type}</p></div>`);
        landUseLayerGroup.addLayer(polygon);
    });

    map.addLayer(landUseLayerGroup);
}

// Add infrastructure layer (mock data)
function addInfrastructureLayer() {
    infrastructureLayerGroup.clearLayers();

    // Add some mock roads
    const roads = [
        [[23.3, 85.0], [23.4, 85.1], [23.5, 85.2], [23.6, 85.3]],
        [[23.7, 85.4], [23.8, 85.5], [23.9, 85.6]]
    ];

    roads.forEach(coords => {
        const polyline = L.polyline(coords, {
            color: '#6b7280',
            weight: 3,
            opacity: 0.8
        });
        polyline.bindPopup('<div class="popup-content"><h4>Road</h4><p>Transportation infrastructure</p></div>');
        infrastructureLayerGroup.addLayer(polyline);
    });

    map.addLayer(infrastructureLayerGroup);
}

// Filter claims based on dropdowns
function filterClaims() {
    const stateFilter = document.getElementById('stateFilter').value;
    const districtFilter = document.getElementById('districtFilter').value;
    const villageFilter = document.getElementById('villageFilter').value;

    claimsLayerGroup.clearLayers();

    let filteredFeatures = mockClaimsData.features;

    if (stateFilter) {
        filteredFeatures = filteredFeatures.filter(f =>
            f.properties.state.toLowerCase().replace(' ', '-') === stateFilter
        );
    }

    if (districtFilter) {
        filteredFeatures = filteredFeatures.filter(f =>
            f.properties.district.toLowerCase() === districtFilter
        );
    }

    if (villageFilter) {
        filteredFeatures = filteredFeatures.filter(f =>
            f.properties.village.toLowerCase() === villageFilter
        );
    }

    // Add filtered markers
    filteredFeatures.forEach(feature => {
        const { properties, geometry } = feature;
        const [lng, lat] = geometry.coordinates;

        const markerColor = getStatusColor(properties.status);
        const marker = L.circleMarker([lat, lng], {
            radius: 8,
            fillColor: markerColor,
            color: '#ffffff',
            weight: 2,
            opacity: 1,
            fillOpacity: 0.8
        });

        const popupContent = createPopupContent(properties);
        marker.bindPopup(popupContent);
        claimsLayerGroup.addLayer(marker);
    });

    // Update statistics
    updateMapStatistics(filteredFeatures);
}

// Search claims
function searchClaims() {
    const searchTerm = document.getElementById('mapSearch').value.toLowerCase();

    if (!searchTerm) {
        loadClaimsLayer();
        updateMapStatistics(mockClaimsData.features);
        return;
    }

    const filteredFeatures = mockClaimsData.features.filter(feature =>
        feature.properties.claimId.toLowerCase().includes(searchTerm) ||
        feature.properties.holderName.toLowerCase().includes(searchTerm)
    );

    claimsLayerGroup.clearLayers();

    filteredFeatures.forEach(feature => {
        const { properties, geometry } = feature;
        const [lng, lat] = geometry.coordinates;

        const markerColor = getStatusColor(properties.status);
        const marker = L.circleMarker([lat, lng], {
            radius: 10,
            fillColor: markerColor,
            color: '#ffffff',
            weight: 3,
            opacity: 1,
            fillOpacity: 0.9
        });

        const popupContent = createPopupContent(properties);
        marker.bindPopup(popupContent);
        claimsLayerGroup.addLayer(marker);
    });

    updateMapStatistics(filteredFeatures);
}

// Update map statistics
function updateMapStatistics(features) {
    const total = features.length;
    const approved = features.filter(f => f.properties.status === 'approved').length;
    const approvedPercent = total > 0 ? Math.round((approved / total) * 100) : 0;
    const avgScore = total > 0 ? Math.round(features.reduce((sum, f) => sum + f.properties.aiScore, 0) / total) : 0;

    document.getElementById('visibleClaims').textContent = total;
    document.getElementById('approvedPercent').textContent = approvedPercent + '%';
    document.getElementById('avgAiScore').textContent = avgScore + '%';
}

// Initialize claim types chart
function initializeClaimTypesChart() {
    const ctx = document.getElementById('claimTypesChart');
    if (!ctx) return;

    if (claimTypesChart) {
        claimTypesChart.destroy();
    }

    // Count claim types
    const claimTypes = {};
    mockClaimsData.features.forEach(feature => {
        const type = feature.properties.claimType;
        claimTypes[type] = (claimTypes[type] || 0) + 1;
    });

    claimTypesChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: Object.keys(claimTypes),
            datasets: [{
                data: Object.values(claimTypes),
                backgroundColor: ['#4CAF50', '#FF9800', '#E91E63'],
                borderColor: '#ffffff',
                borderWidth: 3,
                cutout: '65%'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 15,
                        usePointStyle: true,
                        color: '#546E7A',
                        font: { size: 12 }
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(27, 94, 32, 0.95)',
                    titleColor: '#ffffff',
                    bodyColor: '#ffffff',
                    borderColor: '#4CAF50',
                    borderWidth: 1,
                    padding: 12
                }
            },
            animation: {
                duration: 1500,
                easing: 'easeOutQuart'
            }
        }
    });
}

// Open claim modal
function openClaimModal(claimId) {
    const claim = mockClaimsData.features.find(f => f.properties.claimId === claimId);
    if (!claim) return;

    const modal = document.getElementById('claimModal');
    const modalBody = document.getElementById('modalBody');
    
    if (!modal || !modalBody) {
        console.error('Modal elements not found');
        return;
    }

    const properties = claim.properties;

    modalBody.innerHTML = `
        <div class="claim-detail-grid">
            <div class="detail-item">
                <span class="detail-label">Claim ID</span>
                <span class="detail-value">${properties.claimId}</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Holder Name</span>
                <span class="detail-value">${properties.holderName}</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Village</span>
                <span class="detail-value">${properties.village}</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">District</span>
                <span class="detail-value">${properties.district}</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">State</span>
                <span class="detail-value">${properties.state}</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Status</span>
                <span class="detail-value">
                    <span class="status-badge ${properties.status}">${properties.status}</span>
                </span>
            </div>
            <div class="detail-item">
                <span class="detail-label">AI Score</span>
                <span class="detail-value">${properties.aiScore}%</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Claim Type</span>
                <span class="detail-value">${properties.claimType}</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Area</span>
                <span class="detail-value">${properties.area}</span>
            </div>
        </div>
        <div class="modal-actions">
            <button class="modal-btn secondary" onclick="closeClaimModal()">Close</button>
            <button class="modal-btn primary">Download Documents</button>
        </div>
    `;

    modal.style.display = 'block';
}

// Close claim modal
function closeClaimModal() {
    document.getElementById('claimModal').style.display = 'none';
}

// Show claims page and initialize components
function showClaimsPage() {
    // Hide all pages first
    const allPages = document.querySelectorAll('.page');
    allPages.forEach(page => page.classList.remove('active'));

    // Show claims page
    const claimsPage = document.getElementById('claims-page');
    if (claimsPage) {
        claimsPage.classList.add('active');

        // Initialize claims components
        setTimeout(() => {
            initializeClaimsPage();
        }, 100);
    }

    document.title = 'FRA Claims Management System - FRA Atlas & DSS';
}

// Initialize claims page components
function initializeClaimsPage() {
    updateClaimsSummary();
    populateClaimsTable();
    initializeClaimsControls();
}

// Update claims summary cards
function updateClaimsSummary() {
    const total = claimsDatabase.length;
    const approved = claimsDatabase.filter(c => c.status === 'approved').length;
    const pending = claimsDatabase.filter(c => c.status === 'pending' || c.status === 'under-review').length;
    const rejected = claimsDatabase.filter(c => c.status === 'rejected').length;

    document.getElementById('totalClaimsCount').textContent = total;
    document.getElementById('approvedClaimsCount').textContent = approved;
    document.getElementById('pendingClaimsCount').textContent = pending;
    document.getElementById('rejectedClaimsCount').textContent = rejected;
}

// Populate claims table
function populateClaimsTable(filteredClaims = null) {
    const tableBody = document.getElementById('claimsTableBody');
    if (!tableBody) return;

    const claims = filteredClaims || claimsDatabase;

    tableBody.innerHTML = claims.map(claim => `
        <tr>
            <td><strong>${claim.id}</strong></td>
            <td>${claim.applicantName}</td>
            <td>${claim.village}</td>
            <td>${claim.district.charAt(0).toUpperCase() + claim.district.slice(1)}</td>
            <td>${claim.landArea}</td>
            <td><span class="claim-type-badge">${claim.claimType}</span></td>
            <td>
                <div class="ai-score-container">
                    <div class="ai-score-bar">
                        <div class="ai-score-fill ${getScoreClass(claim.aiScore)}" style="width: ${claim.aiScore}%"></div>
                    </div>
                    <span>${claim.aiScore}%</span>
                    ${claim.aiScore > 80 ? '<i class="ai-verified" data-lucide="check-circle"></i>' : ''}
                </div>
            </td>
            <td><span class="status-badge ${claim.status}">${formatStatus(claim.status)}</span></td>
            <td>
                <div class="action-buttons">
                    <button class="action-btn view" onclick="viewClaimDetails('${claim.id}')">View</button>
                    <button class="action-btn approve" onclick="confirmAction('approve', '${claim.id}')">Approve</button>
                    <button class="action-btn reject" onclick="confirmAction('reject', '${claim.id}')">Reject</button>
                    <button class="action-btn send-back" onclick="confirmAction('send-back', '${claim.id}')">Send Back</button>
                </div>
            </td>
        </tr>
    `).join('');

    // Re-initialize Lucide icons
    setTimeout(() => lucide.createIcons(), 100);
}

// Get AI score class for color coding
function getScoreClass(score) {
    if (score >= 80) return 'high';
    if (score >= 60) return 'medium';
    return 'low';
}

// Format status for display
function formatStatus(status) {
    const statusMap = {
        'approved': 'Approved',
        'pending': 'Pending',
        'rejected': 'Rejected',
        'under-review': 'Under Review'
    };
    return statusMap[status] || status;
}

// Initialize claims controls
function initializeClaimsControls() {
    // Filter controls
    document.getElementById('districtClaimsFilter').addEventListener('change', filterClaims);
    document.getElementById('statusClaimsFilter').addEventListener('change', filterClaims);
    document.getElementById('typeClaimsFilter').addEventListener('change', filterClaims);

    // Search functionality
    document.getElementById('claimsSearch').addEventListener('input', searchClaims);

    // New claim form - updated to use API
    const newClaimForm = document.getElementById('newClaimForm');
    if (newClaimForm) {
        newClaimForm.addEventListener('submit', handleNewClaimSubmission);
    }

    // File upload handling
    document.getElementById('documentUpload').addEventListener('change', handleFileUpload);
}

// Filter claims based on controls
function filterClaims() {
    const districtFilter = document.getElementById('districtClaimsFilter').value;
    const statusFilter = document.getElementById('statusClaimsFilter').value;
    const typeFilter = document.getElementById('typeClaimsFilter').value;
    const searchTerm = document.getElementById('claimsSearch').value.toLowerCase();

    let filteredClaims = claimsDatabase;

    if (districtFilter) {
        filteredClaims = filteredClaims.filter(c => c.district === districtFilter);
    }

    if (statusFilter) {
        filteredClaims = filteredClaims.filter(c => c.status === statusFilter);
    }

    if (typeFilter) {
        filteredClaims = filteredClaims.filter(c => c.claimType === typeFilter);
    }

    if (searchTerm) {
        filteredClaims = filteredClaims.filter(c =>
            c.id.toLowerCase().includes(searchTerm) ||
            c.applicantName.toLowerCase().includes(searchTerm)
        );
    }

    populateClaimsTable(filteredClaims);
}

// Search claims
function searchClaims() {
    filterClaims();
}

// Filter claims by status (from summary cards)
function filterClaimsByStatus(status) {
    document.getElementById('statusClaimsFilter').value = status;
    filterClaims();
}

// Open new claim form
function openNewClaimForm() {
    const modal = document.getElementById('newClaimModal');
    if (modal) {
        modal.style.display = 'block';
        
        // Initialize geo hierarchy dropdowns
        initializeClaimFormGeoHierarchy();
        
        // Focus on first input field
        setTimeout(() => {
            const firstInput = modal.querySelector('input[type="text"]');
            if (firstInput) {
                firstInput.focus();
            }
        }, 100);
        // Prevent body scroll when modal is open
        document.body.style.overflow = 'hidden';

        // Add ESC key listener
        document.addEventListener('keydown', handleModalEscape);

        // Add click outside to close
        modal.addEventListener('click', handleModalOutsideClick);
    }
}

// Track if geo hierarchy is already initialized
let claimFormGeoInitialized = false;

// Initialize geo hierarchy for claim form
async function initializeClaimFormGeoHierarchy() {
    const stateSelect = document.getElementById('claimState');
    const districtSelect = document.getElementById('claimDistrict');
    
    if (!stateSelect || !districtSelect) {
        console.error('❌ State or District select elements not found');
        return;
    }
    
    // Only set up event listener once
    if (!claimFormGeoInitialized) {
        console.log('🔧 Setting up state change listener...');
        
        // Set up state change listener (only once)
        stateSelect.addEventListener('change', async (e) => {
            const stateCode = e.target.value;
            
            console.log(`🗺️ State changed to: ${stateCode}`);
            
            // Reset district dropdown
            districtSelect.innerHTML = '<option value="">Select District</option>';
            districtSelect.disabled = !stateCode;
            
            if (!stateCode) return;
            
            try {
                console.log(`📍 Loading districts for ${stateCode}...`);
                
                // Load districts for selected state
                const response = await fetch(`${api.baseURL}/geo/districts/${stateCode}`);
                const result = await response.json();
                
                console.log(`Response:`, result);
                
                if (result.success && result.data) {
                    result.data.forEach(district => {
                        const option = document.createElement('option');
                        option.value = district.district_code;
                        option.textContent = district.district_name;
                        districtSelect.appendChild(option);
                    });
                    
                    console.log(`✅ Loaded ${result.data.length} districts for ${stateCode}`);
                    showToast(`Loaded ${result.data.length} districts`, 'success');
                } else {
                    throw new Error(result.error?.message || 'Failed to load districts');
                }
            } catch (error) {
                console.error('❌ Error loading districts:', error);
                showToast('Failed to load districts', 'error');
            }
        });
        
        claimFormGeoInitialized = true;
    }
    
    // Load states every time form opens (in case data changed)
    try {
        console.log('📍 Loading states...');
        
        const response = await fetch(`${api.baseURL}/geo/states`);
        const result = await response.json();
        
        console.log(`States response:`, result);
        
        if (result.success && result.data) {
            // Clear existing options
            stateSelect.innerHTML = '<option value="">Select State</option>';
            
            // Populate states
            result.data.forEach(state => {
                const option = document.createElement('option');
                option.value = state.state_code;
                option.textContent = state.state_name;
                stateSelect.appendChild(option);
            });
            
            console.log(`✅ Loaded ${result.data.length} states into claim form`);
            
            // Reset district dropdown
            districtSelect.innerHTML = '<option value="">Select State First</option>';
            districtSelect.disabled = true;
        } else {
            throw new Error('Invalid response format');
        }
    } catch (error) {
        console.error('❌ Error loading states for claim form:', error);
        showToast('Failed to load states', 'error');
        stateSelect.innerHTML = '<option value="">Error loading states</option>';
    }
}

// Close new claim form
function closeNewClaimForm() {
    const modal = document.getElementById('newClaimModal');
    if (modal) {
        modal.style.display = 'none';
        // Restore body scroll
        document.body.style.overflow = 'auto';

        // Remove event listeners
        document.removeEventListener('keydown', handleModalEscape);
        modal.removeEventListener('click', handleModalOutsideClick);
    }

    const form = document.getElementById('newClaimForm');
    if (form) {
        form.reset();
    }

    const uploadedFileName = document.getElementById('uploadedFileName');
    if (uploadedFileName) {
        uploadedFileName.style.display = 'none';
    }
}

// Handle ESC key to close modal
function handleModalEscape(event) {
    if (event.key === 'Escape') {
        closeNewClaimForm();
    }
}

// Handle click outside modal to close
function handleModalOutsideClick(event) {
    if (event.target === event.currentTarget) {
        closeNewClaimForm();
    }
}

// Handle file upload
function handleFileUpload(event) {
    const file = event.target.files[0];
    const fileNameDiv = document.getElementById('uploadedFileName');

    if (file) {
        fileNameDiv.textContent = `Selected: ${file.name}`;
        fileNameDiv.style.display = 'block';
    } else {
        fileNameDiv.style.display = 'none';
    }
}

// Handle new claim submission
function handleNewClaimSubmission(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const aiScore = generateAIScore();
    
    console.log('Generated AI Score:', aiScore);
    
    const claimData = {
        id: generateClaimId(),
        applicantName: formData.get('applicantName'),
        village: formData.get('villageName'),
        district: formData.get('district'),
        state: formData.get('state'),
        claimType: formData.get('claimType'),
        landArea: parseFloat(formData.get('landArea')),
        latitude: parseFloat(formData.get('latitude')),
        longitude: parseFloat(formData.get('longitude')),
        document: formData.get('document')?.name || 'document.pdf',
        remarks: formData.get('remarks') || '',
        aiScore: aiScore,
        status: 'pending',
        submittedDate: new Date().toISOString().split('T')[0],
        timeline: ['submitted']
    };
    
    console.log('New claim data:', claimData);

    // Add to database
    claimsDatabase.unshift(claimData);
    
    // Also add to review database with additional fields
    const reviewClaimData = {
        ...claimData,
        priority: claimData.aiScore >= 85 ? 'high' : claimData.aiScore >= 70 ? 'medium' : 'low',
        reviewNotes: '',
        aiExtracted: {
            name: claimData.applicantName,
            village: claimData.village,
            coordinates: `${claimData.latitude}, ${claimData.longitude}`,
            landArea: `${claimData.landArea} hectares`,
            claimType: claimData.claimType === 'IFR' ? 'Individual Forest Rights' : 
                       claimData.claimType === 'CFR' ? 'Community Forest Rights' : 
                       'Community Rights',
            confidence: claimData.aiScore
        },
        reviewHistory: []
    };
    reviewDatabase.unshift(reviewClaimData);

    // Update UI
    updateClaimsSummary();
    populateClaimsTable();
    
    // Update review page if active
    if (document.getElementById('review-page')?.classList.contains('active')) {
        updateReviewAnalytics();
        populateReviewTable();
    }
    
    closeNewClaimForm();

    // Show success message
    showToast(`Claim ${claimData.id} submitted successfully!`, 'success');
}

// Generate claim ID
function generateClaimId() {
    const year = new Date().getFullYear();
    const id = String(claimIdCounter++).padStart(3, '0');
    return `FRA${year}-JH-${id}`;
}

// Generate AI score
function generateAIScore() {
    return Math.floor(Math.random() * (98 - 70 + 1)) + 70;
}

// View claim details
function viewClaimDetails(claimId) {
    const claim = claimsDatabase.find(c => c.id === claimId);
    if (!claim) return;

    const modal = document.getElementById('claimDetailsModal');
    const modalBody = document.getElementById('claimDetailsBody');
    
    if (!modal || !modalBody) {
        console.error('Modal elements not found');
        return;
    }

    modalBody.innerHTML = `
        <div class="claim-details-grid">
            <div class="detail-section">
                <h4>Basic Information</h4>
                <div class="detail-row">
                    <span class="label">Claim ID</span>
                    <span class="value">${claim.id}</span>
                </div>
                <div class="detail-row">
                    <span class="label">Applicant Name</span>
                    <span class="value">${claim.applicantName}</span>
                </div>
                <div class="detail-row">
                    <span class="label">Village</span>
                    <span class="value">${claim.village}</span>
                </div>
                <div class="detail-row">
                    <span class="label">District</span>
                    <span class="value">${claim.district.charAt(0).toUpperCase() + claim.district.slice(1)}</span>
                </div>
                <div class="detail-row">
                    <span class="label">State</span>
                    <span class="value">${claim.state.charAt(0).toUpperCase() + claim.state.slice(1)}</span>
                </div>
            </div>
            
            <div class="detail-section">
                <h4>Claim Details</h4>
                <div class="detail-row">
                    <span class="label">Claim Type</span>
                    <span class="value">${claim.claimType}</span>
                </div>
                <div class="detail-row">
                    <span class="label">Land Area</span>
                    <span class="value">${claim.landArea} hectares</span>
                </div>
                <div class="detail-row">
                    <span class="label">AI Score</span>
                    <span class="value">${claim.aiScore}% ${claim.aiScore > 80 ? '✓ Verified' : ''}</span>
                </div>
                <div class="detail-row">
                    <span class="label">Status</span>
                    <span class="value">
                        <span class="status-badge ${claim.status}">${formatStatus(claim.status)}</span>
                    </span>
                </div>
                <div class="detail-row">
                    <span class="label">Submitted Date</span>
                    <span class="value">${claim.submittedDate}</span>
                </div>
            </div>
        </div>
        
        <div class="detail-section">
            <h4>Location & Documents</h4>
            <div class="detail-row">
                <span class="label">Coordinates</span>
                <span class="value">${claim.latitude}, ${claim.longitude}</span>
            </div>
            <div class="detail-row">
                <span class="label">Document</span>
                <span class="value">${claim.document}</span>
            </div>
            <div class="detail-row">
                <span class="label">Remarks</span>
                <span class="value">${claim.remarks || 'No remarks'}</span>
            </div>
        </div>
        
        <div class="timeline">
            <h4>Processing Timeline</h4>
            <div class="timeline-steps">
                <div class="timeline-step ${claim.timeline.includes('submitted') ? 'completed' : ''}">
                    <div class="timeline-icon">1</div>
                    <div class="timeline-label">Submitted</div>
                </div>
                <div class="timeline-step ${claim.timeline.includes('district-review') ? 'completed' : claim.timeline.length === 1 ? 'current' : ''}">
                    <div class="timeline-icon">2</div>
                    <div class="timeline-label">District Review</div>
                </div>
                <div class="timeline-step ${claim.timeline.includes('state-review') ? 'completed' : claim.timeline.length === 2 ? 'current' : ''}">
                    <div class="timeline-icon">3</div>
                    <div class="timeline-label">State Review</div>
                </div>
                <div class="timeline-step ${claim.timeline.includes('approved') || claim.timeline.includes('rejected') ? 'completed' : claim.timeline.length === 3 ? 'current' : ''}">
                    <div class="timeline-icon">${claim.status === 'approved' ? '✓' : claim.status === 'rejected' ? '✗' : '4'}</div>
                    <div class="timeline-label">${claim.status === 'approved' ? 'Approved' : claim.status === 'rejected' ? 'Rejected' : 'Final Decision'}</div>
                </div>
            </div>
        </div>
    `;

    modal.style.display = 'block';
}

// Close claim details modal
function closeClaimDetailsModal() {
    document.getElementById('claimDetailsModal').style.display = 'none';
}

// Confirm action
function confirmAction(action, claimId) {
    const claim = claimsDatabase.find(c => c.id === claimId);
    if (!claim) return;
    
    // For approve and reject actions, use SMS modal
    if (action === 'approve') {
        approveClaimWithSMS(claimId, claim.mobileNumber);
        return;
    }
    
    if (action === 'reject') {
        rejectClaimWithSMS(claimId, claim.mobileNumber);
        return;
    }
    
    // For other actions (send back), keep original modal
    const actionModal = document.getElementById('actionModal');
    const titleElement = document.getElementById('actionModalTitle');
    const messageElement = document.getElementById('actionModalMessage');
    const confirmBtn = document.getElementById('confirmActionBtn');

    let title, message, buttonText;

    switch (action) {
        case 'send-back':
            title = 'Send Back for Correction';
            message = `Are you sure you want to send back claim ${claimId} for corrections?`;
            buttonText = 'Send Back';
            break;
    }

    titleElement.textContent = title;
    messageElement.textContent = message;
    confirmBtn.textContent = buttonText;

    confirmBtn.onclick = () => {
        executeAction(action, claimId);
        closeActionModal();
    };

    actionModal.style.display = 'block';
}

// Execute action
function executeAction(action, claimId) {
    const claim = claimsDatabase.find(c => c.id === claimId);
    if (!claim) return;

    switch (action) {
        case 'approve':
            claim.status = 'approved';
            if (!claim.timeline.includes('approved')) {
                claim.timeline.push('approved');
            }
            break;
        case 'reject':
            claim.status = 'rejected';
            if (!claim.timeline.includes('rejected')) {
                claim.timeline.push('rejected');
            }
            break;
        case 'send-back':
            claim.status = 'pending';
            claim.remarks += ' [Sent back for corrections]';
            break;
    }

    // Update UI
    updateClaimsSummary();
    populateClaimsTable();

    // Show success message
    alert(`Claim ${claimId} has been ${action === 'send-back' ? 'sent back for corrections' : action + 'd'} successfully!`);
}

// Close action modal
function closeActionModal() {
    document.getElementById('actionModal').style.display = 'none';
}

// Show review page and initialize components
function showReviewPage() {
    // Hide all pages first
    const allPages = document.querySelectorAll('.page');
    allPages.forEach(page => page.classList.remove('active'));

    // Show review page
    const reviewPage = document.getElementById('review-page');
    if (reviewPage) {
        reviewPage.classList.add('active');

        // Initialize review components
        setTimeout(() => {
            initializeReviewPage();
            startAutoRefresh();
        }, 100);
    }

    document.title = 'Claim Review & Verification Portal - FRA Atlas & DSS';
}

// Initialize review page components
function initializeReviewPage() {
    updateReviewAnalytics();
    populateReviewTable();
    initializeReviewControls();
}

// Update review analytics
function updateReviewAnalytics() {
    const totalUnderReview = reviewDatabase.filter(c =>
        c.status === 'pending' || c.status === 'district-review' || c.status === 'state-review'
    ).length;

    const aiVerified = reviewDatabase.filter(c => c.aiScore > 80).length;
    const aiVerifiedPercent = Math.round((aiVerified / reviewDatabase.length) * 100);

    const avgReviewTime = 3.2; // Mock data
    const approvedThisWeek = 18; // Mock data

    document.getElementById('totalUnderReview').textContent = totalUnderReview;
    document.getElementById('aiVerifiedPercent').textContent = aiVerifiedPercent + '%';
    document.getElementById('avgReviewTime').textContent = avgReviewTime;
    document.getElementById('approvedThisWeek').textContent = approvedThisWeek;
}

// Populate review table
function populateReviewTable(filteredClaims = null) {
    const tableBody = document.getElementById('reviewTableBody');
    if (!tableBody) return;

    let claims = filteredClaims || reviewDatabase;

    // Filter by current view
    if (currentReviewView === 'district') {
        claims = claims.filter(c => c.status === 'pending' || c.status === 'district-review');
    } else {
        claims = claims.filter(c => c.status === 'state-review');
    }

    // Sort by priority and AI score
    claims.sort((a, b) => {
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
            return priorityOrder[b.priority] - priorityOrder[a.priority];
        }
        return b.aiScore - a.aiScore;
    });

    tableBody.innerHTML = claims.map(claim => `
        <tr data-claim-id="${claim.id}" style="cursor: pointer;">
            <td><strong>${claim.id}</strong></td>
            <td>${claim.applicantName}</td>
            <td>${claim.village}</td>
            <td>
                <div class="review-ai-score">
                    <div class="review-score-bar">
                        <div class="review-score-fill ${getReviewScoreClass(claim.aiScore)}" style="width: ${claim.aiScore}%"></div>
                    </div>
                    <span>${claim.aiScore}%</span>
                    ${claim.aiScore > 80 ? '<div class="ai-verified-badge"><i data-lucide="check-circle"></i>AI</div>' : ''}
                </div>
            </td>
            <td><span class="claim-type-badge">${claim.claimType}</span></td>
            <td><span class="status-badge ${claim.status}">${formatReviewStatus(claim.status)}</span></td>
            <td><span class="priority-badge ${claim.priority}">${claim.priority}</span></td>
            <td>
                <div class="review-actions" onclick="event.stopPropagation()">
                    <button class="review-action-btn approve" onclick="confirmReviewAction('approve', '${claim.id}')">Approve</button>
                    <button class="review-action-btn reject" onclick="confirmReviewAction('reject', '${claim.id}')">Reject</button>
                    <button class="review-action-btn correct" onclick="confirmReviewAction('correct', '${claim.id}')">Send Back</button>
                </div>
            </td>
        </tr>
    `).join('');

    // Re-initialize Lucide icons
    setTimeout(() => lucide.createIcons(), 100);
}

// Get review score class
function getReviewScoreClass(score) {
    if (score >= 85) return 'high';
    if (score >= 70) return 'medium';
    return 'low';
}

// Format review status
function formatReviewStatus(status) {
    const statusMap = {
        'pending': 'Pending',
        'district-review': 'District Review',
        'state-review': 'State Review',
        'approved': 'Approved',
        'rejected': 'Rejected'
    };
    return statusMap[status] || status;
}

// Initialize review controls
function initializeReviewControls() {
    // Filter controls
    document.getElementById('reviewStateFilter').addEventListener('change', filterReviewClaims);
    document.getElementById('reviewDistrictFilter').addEventListener('change', filterReviewClaims);
    document.getElementById('reviewStatusFilter').addEventListener('change', filterReviewClaims);
    
    // Add event delegation for table row clicks
    const reviewTableBody = document.getElementById('reviewTableBody');
    if (reviewTableBody) {
        reviewTableBody.addEventListener('click', function(e) {
            const row = e.target.closest('tr');
            if (row && row.hasAttribute('data-claim-id')) {
                const claimId = row.getAttribute('data-claim-id');
                openReviewPanel(claimId);
            }
        });
    }
}

// Filter review claims
function filterReviewClaims() {
    const stateFilter = document.getElementById('reviewStateFilter').value;
    const districtFilter = document.getElementById('reviewDistrictFilter').value;
    const statusFilter = document.getElementById('reviewStatusFilter').value;

    let filteredClaims = reviewDatabase;

    if (stateFilter) {
        filteredClaims = filteredClaims.filter(c => c.state === stateFilter);
    }

    if (districtFilter) {
        filteredClaims = filteredClaims.filter(c => c.district === districtFilter);
    }

    if (statusFilter) {
        filteredClaims = filteredClaims.filter(c => c.status === statusFilter);
    }

    populateReviewTable(filteredClaims);
}

// Switch view between district and state
function switchView(view) {
    currentReviewView = view;

    // Update button states
    document.getElementById('districtViewBtn').classList.toggle('active', view === 'district');
    document.getElementById('stateViewBtn').classList.toggle('active', view === 'state');

    // Refresh table
    populateReviewTable();
}

// Open review panel
function openReviewPanel(claimId) {
    console.log('Opening review panel for claim:', claimId);
    
    const claim = reviewDatabase.find(c => c.id === claimId);
    if (!claim) {
        console.error('Claim not found:', claimId);
        return;
    }

    const modal = document.getElementById('reviewPanelModal');
    const modalBody = document.getElementById('reviewPanelBody');
    const titleElement = document.getElementById('reviewPanelTitle');
    
    if (!modal || !modalBody || !titleElement) {
        console.error('Review panel modal elements not found', {
            modal: !!modal,
            modalBody: !!modalBody,
            titleElement: !!titleElement
        });
        return;
    }

    console.log('Opening modal for claim:', claim.id);
    titleElement.textContent = `Detailed Review - ${claim.id}`;

    modalBody.innerHTML = `
        <div class="review-panel-grid">
            <div class="review-section">
                <h4><i data-lucide="user"></i>Applicant Information</h4>
                <div class="review-detail-row">
                    <span class="review-detail-label">Claim ID</span>
                    <span class="review-detail-value">${claim.id}</span>
                </div>
                <div class="review-detail-row">
                    <span class="review-detail-label">Applicant Name</span>
                    <span class="review-detail-value">${claim.applicantName}</span>
                </div>
                <div class="review-detail-row">
                    <span class="review-detail-label">Aadhaar Number</span>
                    <span class="review-detail-value">${claim.aadhaarNumber || 'Not provided'} ${claim.aadhaarVerified ? '<span style="color: #4CAF50; font-weight: 600;">✓ Verified</span>' : ''}</span>
                </div>
                <div class="review-detail-row">
                    <span class="review-detail-label">Mobile Number</span>
                    <span class="review-detail-value">${claim.mobileNumber || 'Not provided'}</span>
                </div>
                <div class="review-detail-row">
                    <span class="review-detail-label">Village</span>
                    <span class="review-detail-value">${claim.village}</span>
                </div>
                <div class="review-detail-row">
                    <span class="review-detail-label">District</span>
                    <span class="review-detail-value">${claim.district.charAt(0).toUpperCase() + claim.district.slice(1)}</span>
                </div>
                <div class="review-detail-row">
                    <span class="review-detail-label">State</span>
                    <span class="review-detail-value">${claim.state.charAt(0).toUpperCase() + claim.state.slice(1)}</span>
                </div>
            </div>
            
            <div class="review-section">
                <h4><i data-lucide="map-pin"></i>Claim Details</h4>
                <div class="review-detail-row">
                    <span class="review-detail-label">Claim Type</span>
                    <span class="review-detail-value">${claim.claimType}</span>
                </div>
                <div class="review-detail-row">
                    <span class="review-detail-label">Land Area</span>
                    <span class="review-detail-value">${claim.landArea} hectares</span>
                </div>
                <div class="review-detail-row">
                    <span class="review-detail-label">Coordinates</span>
                    <span class="review-detail-value">${claim.latitude}, ${claim.longitude}</span>
                </div>
                <div class="review-detail-row">
                    <span class="review-detail-label">AI Score</span>
                    <span class="review-detail-value">${claim.aiScore}% ${claim.aiScore > 80 ? '✓ Verified' : ''}</span>
                </div>
                <div class="review-detail-row">
                    <span class="review-detail-label">Document</span>
                    <span class="review-detail-value">${claim.document}</span>
                </div>
            </div>
            
            <div class="review-section ai-extracted-section">
                <h4><i data-lucide="brain"></i>AI Extracted Details</h4>
                <div class="ai-extracted-grid">
                    <div class="ai-extracted-item">
                        <div class="ai-extracted-label">Name</div>
                        <div class="ai-extracted-value">${claim.aiExtracted.name}</div>
                        <div class="ai-confidence">Confidence: ${claim.aiExtracted.confidence}%</div>
                    </div>
                    <div class="ai-extracted-item">
                        <div class="ai-extracted-label">Village</div>
                        <div class="ai-extracted-value">${claim.aiExtracted.village}</div>
                        <div class="ai-confidence">Confidence: ${claim.aiExtracted.confidence}%</div>
                    </div>
                    <div class="ai-extracted-item">
                        <div class="ai-extracted-label">Coordinates</div>
                        <div class="ai-extracted-value">${claim.aiExtracted.coordinates}</div>
                        <div class="ai-confidence">Confidence: ${claim.aiExtracted.confidence}%</div>
                    </div>
                    <div class="ai-extracted-item">
                        <div class="ai-extracted-label">Land Area</div>
                        <div class="ai-extracted-value">${claim.aiExtracted.landArea}</div>
                        <div class="ai-confidence">Confidence: ${claim.aiExtracted.confidence}%</div>
                    </div>
                    <div class="ai-extracted-item">
                        <div class="ai-extracted-label">Claim Type</div>
                        <div class="ai-extracted-value">${claim.aiExtracted.claimType}</div>
                        <div class="ai-confidence">Confidence: ${claim.aiExtracted.confidence}%</div>
                    </div>
                </div>
            </div>
            
            <div class="manual-notes-section">
                <h4><i data-lucide="edit-3"></i>Manual Verification Notes</h4>
                <textarea id="reviewNotes" placeholder="Enter your verification notes and observations...">${claim.reviewNotes}</textarea>
            </div>
        </div>
        
        <div class="review-timeline">
            <h4>Review Timeline</h4>
            <div class="timeline-container">
                <div class="timeline-step ${claim.timeline.includes('submitted') ? 'completed' : ''}">
                    <div class="timeline-step-icon">1</div>
                    <div class="timeline-step-label">Submitted</div>
                </div>
                <div class="timeline-step ${claim.timeline.includes('district-review') ? 'completed' : claim.timeline.length === 1 ? 'current' : ''}">
                    <div class="timeline-step-icon">2</div>
                    <div class="timeline-step-label">District Review</div>
                </div>
                <div class="timeline-step ${claim.timeline.includes('state-review') ? 'completed' : claim.timeline.length === 2 ? 'current' : ''}">
                    <div class="timeline-step-icon">3</div>
                    <div class="timeline-step-label">State Review</div>
                </div>
                <div class="timeline-step ${claim.timeline.includes('approved') ? 'completed' : claim.timeline.length === 3 ? 'current' : ''}">
                    <div class="timeline-step-icon">4</div>
                    <div class="timeline-step-label">Approved</div>
                </div>
                <div class="timeline-step ${claim.timeline.includes('patta-granted') ? 'completed' : claim.timeline.length === 4 ? 'current' : ''}">
                    <div class="timeline-step-icon">5</div>
                    <div class="timeline-step-label">Patta Granted</div>
                </div>
            </div>
        </div>
        
        <div class="review-panel-actions">
            <button class="review-panel-btn secondary" onclick="closeReviewPanel()">Close</button>
            <button class="review-panel-btn schedule" onclick="openFieldVerificationScheduler('${claim.id}')">
                <i data-lucide="calendar-check"></i>Schedule Field Verification
            </button>
            <button class="review-panel-btn correct" onclick="confirmReviewAction('correct', '${claim.id}')">
                <i data-lucide="arrow-left"></i>Send for Correction
            </button>
            <button class="review-panel-btn reject" onclick="confirmReviewAction('reject', '${claim.id}')">
                <i data-lucide="x"></i>Reject Claim
            </button>
            <button class="review-panel-btn approve" onclick="confirmReviewAction('approve', '${claim.id}')">
                <i data-lucide="check"></i>Approve Claim
            </button>
        </div>
    `;

    modal.style.display = 'block';

    // Re-initialize Lucide icons
    setTimeout(() => lucide.createIcons(), 100);
}

// Close review panel
function closeReviewPanel() {
    // Save notes before closing
    const claimId = document.getElementById('reviewPanelTitle').textContent.split(' - ')[1];
    const notes = document.getElementById('reviewNotes')?.value;

    if (notes && claimId) {
        const claim = reviewDatabase.find(c => c.id === claimId);
        if (claim) {
            claim.reviewNotes = notes;
        }
    }

    document.getElementById('reviewPanelModal').style.display = 'none';
}

// Open field verification scheduler
function openFieldVerificationScheduler(claimId) {
    console.log('Opening field verification scheduler for claim:', claimId);
    
    const modal = document.getElementById('fieldVerificationModal');
    if (!modal) {
        console.error('Field verification modal not found');
        return;
    }
    
    // Store claim ID for later use
    modal.dataset.claimId = claimId;
    
    // Set minimum date to today
    const dateInput = document.getElementById('verificationDate');
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.min = today;
        dateInput.value = today;
    }
    
    // Set default time to 10:00 AM
    const timeInput = document.getElementById('verificationTime');
    if (timeInput) {
        timeInput.value = '10:00';
    }
    
    modal.style.display = 'block';
    
    // Re-initialize Lucide icons
    setTimeout(() => lucide.createIcons(), 100);
}

// Close field verification scheduler
function closeFieldVerificationScheduler() {
    const modal = document.getElementById('fieldVerificationModal');
    if (modal) {
        modal.style.display = 'none';
        document.getElementById('fieldVerificationForm')?.reset();
    }
}

// Submit field verification schedule
function submitFieldVerification(event) {
    event.preventDefault();
    
    const modal = document.getElementById('fieldVerificationModal');
    const claimId = modal.dataset.claimId;
    const formData = new FormData(event.target);
    
    const verificationData = {
        claimId: claimId,
        date: formData.get('verificationDate'),
        time: formData.get('verificationTime'),
        teamLead: formData.get('teamLead'),
        teamMembers: formData.getAll('teamMembers'),
        purpose: formData.get('verificationPurpose'),
        notes: formData.get('verificationNotes'),
        notifyTeam: formData.get('notifyTeam') === 'on',
        scheduledBy: 'Current User',
        scheduledDate: new Date().toISOString(),
        status: 'scheduled'
    };
    
    console.log('Field verification scheduled:', verificationData);
    
    // Update claim with verification info
    const claim = reviewDatabase.find(c => c.id === claimId);
    if (claim) {
        if (!claim.fieldVerifications) {
            claim.fieldVerifications = [];
        }
        claim.fieldVerifications.push(verificationData);
        
        // Add to timeline
        claim.timeline.push('field-verification-scheduled');
        
        // Add to review history
        claim.reviewHistory.push({
            action: 'field-verification-scheduled',
            by: 'Current User',
            date: new Date().toISOString().split('T')[0],
            notes: `Field verification scheduled for ${verificationData.date} at ${verificationData.time}`
        });
    }
    
    // Show success message
    showToast(`Field verification scheduled successfully for ${verificationData.date}!`, 'success');
    
    // Close modal
    closeFieldVerificationScheduler();
    
    // Optionally close review panel
    // closeReviewPanel();
}

// Confirm review action
function confirmReviewAction(action, claimId) {
    const claim = reviewDatabase.find(c => c.id === claimId);
    if (!claim) return;
    
    // For approve and reject actions, use SMS modal
    if (action === 'approve') {
        // Close review panel if open
        const reviewPanel = document.getElementById('reviewPanelModal');
        if (reviewPanel) {
            reviewPanel.style.display = 'none';
        }
        
        // Show SMS approval modal
        approveClaimWithSMS(claimId, claim.mobileNumber);
        return;
    }
    
    if (action === 'reject') {
        // Close review panel if open
        const reviewPanel = document.getElementById('reviewPanelModal');
        if (reviewPanel) {
            reviewPanel.style.display = 'none';
        }
        
        // Show SMS rejection modal
        rejectClaimWithSMS(claimId, claim.mobileNumber);
        return;
    }
    
    // For other actions (send back for correction), keep original modal
    const modal = document.getElementById('reviewActionModal');
    const titleElement = document.getElementById('reviewActionTitle');
    const messageElement = document.getElementById('reviewActionMessage');
    const reasonSection = document.getElementById('reviewReasonSection');
    const confirmBtn = document.getElementById('confirmReviewActionBtn');

    let title, message, buttonText, showReason = false;

    switch (action) {
        case 'correct':
            title = 'Send for Correction';
            message = `Are you sure you want to send claim ${claimId} back for corrections?`;
            buttonText = 'Send Back';
            showReason = true;
            break;
    }

    titleElement.textContent = title;
    messageElement.textContent = message;
    confirmBtn.textContent = buttonText;
    reasonSection.style.display = showReason ? 'block' : 'none';

    confirmBtn.onclick = () => {
        const reason = document.getElementById('reviewReason').value;
        executeReviewAction(action, claimId, reason);
        closeReviewActionModal();
    };

    modal.style.display = 'block';
}

// Execute review action
function executeReviewAction(action, claimId, reason = '') {
    const claim = reviewDatabase.find(c => c.id === claimId);
    if (!claim) return;

    const currentUser = currentReviewView === 'district' ? 'District Officer' : 'State Officer';
    const currentDate = new Date().toISOString().split('T')[0];

    switch (action) {
        case 'approve':
            if (currentReviewView === 'district') {
                claim.status = 'state-review';
                if (!claim.timeline.includes('district-review')) {
                    claim.timeline.push('district-review');
                }
                if (!claim.timeline.includes('state-review')) {
                    claim.timeline.push('state-review');
                }
            } else {
                // State level approval - create asset
                claim.status = 'approved';
                if (!claim.timeline.includes('approved')) {
                    claim.timeline.push('approved');
                }
                
                // Create asset from approved claim
                createAssetFromClaim(claim);
            }
            break;
        case 'reject':
            claim.status = 'rejected';
            if (!claim.timeline.includes('rejected')) {
                claim.timeline.push('rejected');
            }
            break;
        case 'correct':
            claim.status = 'pending';
            claim.reviewNotes += ` [Sent back for corrections: ${reason}]`;
            break;
    }

    // Add to review history
    claim.reviewHistory.push({
        action: action,
        by: currentUser,
        date: currentDate,
        notes: reason || 'No additional notes'
    });

    // Update UI
    updateReviewAnalytics();
    populateReviewTable();
    closeReviewPanel();

    // Show success message
    const actionText = action === 'correct' ? 'sent back for corrections' : action + 'd';
    alert(`Claim ${claimId} has been ${actionText} successfully!`);
}

// Close review action modal
function closeReviewActionModal() {
    document.getElementById('reviewActionModal').style.display = 'none';
    document.getElementById('reviewReason').value = '';
}

// Start auto-refresh
function startAutoRefresh() {
    // Clear existing interval
    if (reviewRefreshInterval) {
        clearInterval(reviewRefreshInterval);
    }

    // Set up auto-refresh every 60 seconds
    reviewRefreshInterval = setInterval(() => {
        if (document.getElementById('review-page').classList.contains('active')) {
            updateReviewAnalytics();
            populateReviewTable();
        }
    }, 60000);
}

// Create asset from approved claim
function createAssetFromClaim(claim) {
    // Determine asset type based on claim type
    let assetType = 'forest'; // Default
    if (claim.claimType === 'IFR') {
        assetType = 'agriculture';
    } else if (claim.claimType === 'CFR') {
        assetType = 'forest';
    } else if (claim.claimType === 'CR') {
        assetType = 'water';
    }
    
    // Generate unique asset ID
    const assetId = `AST-${String(assetsDatabase.length + 1).padStart(3, '0')}`;
    
    // Create new asset
    const newAsset = {
        id: assetId,
        type: assetType,
        name: `${claim.claimType} - ${claim.village}`,
        village: claim.village,
        district: claim.district,
        state: claim.state,
        area: claim.landArea,
        latitude: claim.latitude,
        longitude: claim.longitude,
        linkedClaimIds: [claim.id],
        aiAccuracy: claim.aiScore,
        description: `Approved FRA claim for ${claim.applicantName}`,
        createdDate: new Date().toISOString().split('T')[0],
        status: 'active'
    };
    
    // Add to assets database
    assetsDatabase.push(newAsset);
    
    console.log('✅ Asset created from approved claim:', newAsset);
    console.log('📊 Total assets in database:', assetsDatabase.length);
    
    // Show success notification
    showToast(`Asset ${assetId} created successfully from approved claim!`, 'success');
    
    // Always refresh assets page components if they exist
    const assetsPage = document.getElementById('assets-page');
    if (assetsPage) {
        // Update summary cards
        updateAssetsSummary();
        
        // Refresh table if page is active
        if (assetsPage.classList.contains('active')) {
            populateAssetsTable();
            console.log('🔄 Assets table refreshed');
            
            // Refresh map layers to show new asset
            if (assetsMap) {
                loadAssetsLayers();
                console.log('🗺️ Assets map refreshed');
            }
        }
    }
    
    // Return the created asset
    return newAsset;
}

// Show assets page and initialize components
function showAssetsPage() {
    console.log('🗺️ Showing assets page');
    
    // Hide all pages first
    const allPages = document.querySelectorAll('.page');
    allPages.forEach(page => page.classList.remove('active'));

    // Show assets page
    const assetsPage = document.getElementById('assets-page');
    if (assetsPage) {
        assetsPage.classList.add('active');

        // Initialize assets components
        setTimeout(() => {
            console.log('🔄 Initializing assets page with', assetsDatabase.length, 'assets');
            initializeAssetsPage();
        }, 100);
    }

    document.title = 'FRA Asset Mapping & Geo Intelligence - FRA Atlas & DSS';
}

// Initialize assets page components
function initializeAssetsPage() {
    updateAssetsSummary();
    initializeAssetsMap();
    
    // Refresh map layers with latest assets
    if (assetsMap) {
        loadAssetsLayers();
        console.log('🗺️ Assets map loaded with', assetsDatabase.length, 'assets');
    }
    
    populateAssetsTable();
    updateDSSRecommendations();
    initializeAssetsControls();
}

// Update assets summary cards
function updateAssetsSummary() {
    const totalAssets = assetsDatabase.length;
    const waterBodies = assetsDatabase.filter(a => a.type === 'water').length;
    const agricultureFields = assetsDatabase.filter(a => a.type === 'agriculture').length;
    const forestArea = Math.round(assetsDatabase.filter(a => a.type === 'forest').reduce((sum, a) => sum + a.area, 0));
    const infrastructureSites = assetsDatabase.filter(a => a.type === 'infrastructure').length;

    document.getElementById('totalAssets').textContent = totalAssets;
    document.getElementById('waterBodies').textContent = waterBodies;
    document.getElementById('agricultureFields').textContent = agricultureFields;
    document.getElementById('forestArea').textContent = forestArea;
    document.getElementById('infrastructureSites').textContent = infrastructureSites;
}

// Initialize assets map
function initializeAssetsMap() {
    if (!assetsMap) {
        assetsMap = L.map('assetsMapContainer').setView([23.6345, 85.3803], 8);

        // Add base layer
        const satelliteLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
            attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
        });

        satelliteLayer.addTo(assetsMap);

        // Initialize layer groups
        assetsLayerGroups = {
            water: L.layerGroup().addTo(assetsMap),
            agriculture: L.layerGroup().addTo(assetsMap),
            forest: L.layerGroup().addTo(assetsMap),
            infrastructure: L.layerGroup().addTo(assetsMap)
        };

        // Load assets data
        loadAssetsLayers();

        // Add fullscreen control
        assetsMap.addControl(new L.Control.Fullscreen());
    }
}

// Load assets layers
function loadAssetsLayers() {
    // Clear existing layers
    Object.values(assetsLayerGroups).forEach(group => group.clearLayers());

    assetsDatabase.forEach(asset => {
        const { latitude, longitude, type } = asset;

        // Create marker based on asset type
        const markerOptions = getAssetMarkerOptions(type);
        const marker = L.circleMarker([latitude, longitude], markerOptions);

        // Create popup content
        const popupContent = createAssetPopupContent(asset);
        marker.bindPopup(popupContent);

        // Add to appropriate layer group
        if (assetsLayerGroups[type]) {
            assetsLayerGroups[type].addLayer(marker);
        }
    });
}

// Get asset marker options
function getAssetMarkerOptions(type) {
    const options = {
        radius: 8,
        weight: 2,
        opacity: 1,
        fillOpacity: 0.8,
        color: '#ffffff'
    };

    switch (type) {
        case 'water':
            options.fillColor = '#06b6d4';
            break;
        case 'agriculture':
            options.fillColor = '#65a30d';
            break;
        case 'forest':
            options.fillColor = '#16a34a';
            break;
        case 'infrastructure':
            options.fillColor = '#d97706';
            break;
        default:
            options.fillColor = '#6b7280';
    }

    return options;
}

// Create asset popup content
function createAssetPopupContent(asset) {
    const nearbyClaims = asset.linkedClaimIds.slice(0, 3).join(', ');

    return `
        <div class="popup-content">
            <h4>${asset.name}</h4>
            <p><strong>Type:</strong> ${asset.type.charAt(0).toUpperCase() + asset.type.slice(1)}</p>
            <p><strong>Village:</strong> ${asset.village}</p>
            <p><strong>Area:</strong> ${asset.area} hectares</p>
            <p><strong>Coordinates:</strong> ${asset.latitude}, ${asset.longitude}</p>
            <p><strong>Nearby Claims:</strong> ${nearbyClaims}</p>
            <p><strong>AI Accuracy:</strong> ${asset.aiAccuracy}%</p>
            <button class="popup-btn" onclick="addToDSSLayer('${asset.id}')">Add to DSS Layer</button>
            <button class="popup-btn" onclick="viewAssetDetails('${asset.id}')" style="margin-left: 5px;">View Details</button>
        </div>
    `;
}

// Populate assets table
function populateAssetsTable(filteredAssets = null) {
    const tableBody = document.getElementById('assetsTableBody');
    if (!tableBody) {
        console.warn('⚠️ Assets table body not found');
        return;
    }

    const assets = filteredAssets || assetsDatabase;
    console.log('📋 Populating assets table with', assets.length, 'assets');

    tableBody.innerHTML = assets.map(asset => `
        <tr>
            <td><strong>${asset.id}</strong></td>
            <td><span class="asset-type-badge ${asset.type}">${asset.type}</span></td>
            <td>${asset.village}</td>
            <td>${asset.area}</td>
            <td>${asset.latitude}, ${asset.longitude}</td>
            <td>${asset.linkedClaimIds.join(', ')}</td>
            <td><strong>${asset.aiAccuracy}%</strong></td>
            <td>
                <button class="asset-action-btn" onclick="viewAssetDetails('${asset.id}')">View Details</button>
            </td>
        </tr>
    `).join('');
}

// Update DSS recommendations
function updateDSSRecommendations() {
    const recommendationsContainer = document.getElementById('dssRecommendations');
    if (!recommendationsContainer) return;

    const applicableRecommendations = dssRecommendations.filter(rec =>
        rec.condition(assetsDatabase)
    );

    if (applicableRecommendations.length === 0) {
        recommendationsContainer.innerHTML = `
            <div class="dss-recommendation-card">
                <div class="dss-recommendation-title">All Schemes Covered</div>
                <div class="dss-recommendation-reason">Current assets meet all scheme requirements</div>
            </div>
        `;
    } else {
        recommendationsContainer.innerHTML = applicableRecommendations.map(rec => `
            <div class="dss-recommendation-card">
                <div class="dss-recommendation-title">${rec.title}</div>
                <div class="dss-recommendation-reason">${rec.reason}</div>
            </div>
        `).join('');
    }
}

// Initialize assets controls
function initializeAssetsControls() {
    // Filter controls
    document.getElementById('assetsStateFilter').addEventListener('change', filterAssets);
    document.getElementById('assetsDistrictFilter').addEventListener('change', filterAssets);
    document.getElementById('assetsVillageFilter').addEventListener('change', filterAssets);
    document.getElementById('assetsTypeFilter').addEventListener('change', filterAssets);

    // Layer toggles
    document.getElementById('waterAssetsLayer').addEventListener('change', function (e) {
        toggleAssetLayer('water', e.target.checked);
    });

    document.getElementById('agricultureAssetsLayer').addEventListener('change', function (e) {
        toggleAssetLayer('agriculture', e.target.checked);
    });

    document.getElementById('forestAssetsLayer').addEventListener('change', function (e) {
        toggleAssetLayer('forest', e.target.checked);
    });

    document.getElementById('infrastructureAssetsLayer').addEventListener('change', function (e) {
        toggleAssetLayer('infrastructure', e.target.checked);
    });
}

// Filter assets
function filterAssets() {
    // Show loading indicator
    const loadingIndicator = document.getElementById('assetsLoading');
    loadingIndicator.style.display = 'flex';

    setTimeout(() => {
        const stateFilter = document.getElementById('assetsStateFilter').value;
        const districtFilter = document.getElementById('assetsDistrictFilter').value;
        const villageFilter = document.getElementById('assetsVillageFilter').value;
        const typeFilter = document.getElementById('assetsTypeFilter').value;

        let filteredAssets = assetsDatabase;

        if (stateFilter) {
            filteredAssets = filteredAssets.filter(a => a.state === stateFilter);
        }

        if (districtFilter) {
            filteredAssets = filteredAssets.filter(a => a.district === districtFilter);
        }

        if (villageFilter) {
            filteredAssets = filteredAssets.filter(a => a.village === villageFilter);
        }

        if (typeFilter) {
            filteredAssets = filteredAssets.filter(a => a.type === typeFilter);
        }

        // Update table
        populateAssetsTable(filteredAssets);

        // Update map center if village is selected
        if (villageFilter) {
            const villageAsset = filteredAssets[0];
            if (villageAsset) {
                assetsMap.setView([villageAsset.latitude, villageAsset.longitude], 12);
            }
        }

        // Hide loading indicator
        loadingIndicator.style.display = 'none';
    }, 500);
}

// Toggle asset layer
function toggleAssetLayer(type, show) {
    if (assetsLayerGroups[type]) {
        if (show) {
            assetsMap.addLayer(assetsLayerGroups[type]);
        } else {
            assetsMap.removeLayer(assetsLayerGroups[type]);
        }
    }
}

// Add to DSS layer
function addToDSSLayer(assetId) {
    const asset = assetsDatabase.find(a => a.id === assetId);
    if (!asset) return;

    console.log('➕ Adding asset to DSS layer:', asset);

    // Get linked claims for this asset
    const linkedClaims = asset.linkedClaimIds || [];
    
    // Determine recommended schemes based on asset type
    let recommendedSchemes = [];
    if (asset.type === 'water') {
        recommendedSchemes = ['jal-jeevan'];
    } else if (asset.type === 'agriculture') {
        recommendedSchemes = ['pm-kisan', 'mgnrega'];
    } else if (asset.type === 'forest') {
        recommendedSchemes = ['green-india'];
    } else if (asset.type === 'infrastructure') {
        recommendedSchemes = ['mgnrega'];
    }
    
    // Add or update DSS claim data for each linked claim
    linkedClaims.forEach(claimId => {
        let dssEntry = dssClaimsData.find(d => d.claimId === claimId);
        
        if (!dssEntry) {
            // Create new DSS entry
            dssEntry = {
                claimId: claimId,
                village: asset.village,
                district: asset.district,
                state: asset.state,
                aiScore: asset.aiAccuracy,
                landArea: asset.area,
                waterIndex: asset.type === 'water' ? 0.8 : 0.3,
                forestCover: asset.type === 'forest' ? 75 : 30,
                soilDegraded: false,
                aiVerified: true,
                linkedAssets: 1,
                recommendedSchemes: recommendedSchemes,
                priority: asset.aiAccuracy >= 85 ? 'high' : 'medium',
                status: 'pending',
                assetId: assetId,
                assetType: asset.type,
                coordinates: { lat: asset.latitude, lng: asset.longitude }
            };
            dssClaimsData.push(dssEntry);
            console.log('✅ Created new DSS entry:', dssEntry);
        } else {
            // Update existing entry
            dssEntry.linkedAssets = (dssEntry.linkedAssets || 0) + 1;
            dssEntry.recommendedSchemes = [...new Set([...dssEntry.recommendedSchemes, ...recommendedSchemes])];
            dssEntry.assetId = assetId;
            dssEntry.assetType = asset.type;
            dssEntry.coordinates = { lat: asset.latitude, lng: asset.longitude };
            console.log('🔄 Updated DSS entry:', dssEntry);
        }
    });
    
    // Show success message
    showToast(`Asset ${assetId} added to DSS layer with ${recommendedSchemes.length} scheme(s)!`, 'success');
    
    // Refresh DSS page if it's active
    const dssPage = document.getElementById('dss-page');
    if (dssPage && dssPage.classList.contains('active')) {
        populateDSSRecommendations();
        initializeDSSMap(); // Refresh map to show new marker
        console.log('🔄 DSS page refreshed');
    }
}

// View asset details
function viewAssetDetails(assetId) {
    const asset = assetsDatabase.find(a => a.id === assetId);
    if (!asset) return;

    const modal = document.getElementById('assetDetailsModal');
    const modalBody = document.getElementById('assetDetailsBody');
    const titleElement = document.getElementById('assetDetailsTitle');
    
    if (!modal || !modalBody || !titleElement) {
        console.error('Asset details modal elements not found');
        return;
    }

    titleElement.textContent = `Asset Details - ${asset.name}`;

    modalBody.innerHTML = `
        <div class="asset-details-grid">
            <div class="asset-detail-section">
                <h5>Basic Information</h5>
                <div class="asset-detail-row">
                    <span class="asset-detail-label">Asset ID</span>
                    <span class="asset-detail-value">${asset.id}</span>
                </div>
                <div class="asset-detail-row">
                    <span class="asset-detail-label">Name</span>
                    <span class="asset-detail-value">${asset.name}</span>
                </div>
                <div class="asset-detail-row">
                    <span class="asset-detail-label">Type</span>
                    <span class="asset-detail-value">${asset.type.charAt(0).toUpperCase() + asset.type.slice(1)}</span>
                </div>
                <div class="asset-detail-row">
                    <span class="asset-detail-label">Village</span>
                    <span class="asset-detail-value">${asset.village}</span>
                </div>
                <div class="asset-detail-row">
                    <span class="asset-detail-label">District</span>
                    <span class="asset-detail-value">${asset.district.charAt(0).toUpperCase() + asset.district.slice(1)}</span>
                </div>
            </div>
            
            <div class="asset-detail-section">
                <h5>Technical Details</h5>
                <div class="asset-detail-row">
                    <span class="asset-detail-label">Area</span>
                    <span class="asset-detail-value">${asset.area} hectares</span>
                </div>
                <div class="asset-detail-row">
                    <span class="asset-detail-label">Latitude</span>
                    <span class="asset-detail-value">${asset.latitude}</span>
                </div>
                <div class="asset-detail-row">
                    <span class="asset-detail-label">Longitude</span>
                    <span class="asset-detail-value">${asset.longitude}</span>
                </div>
                <div class="asset-detail-row">
                    <span class="asset-detail-label">AI Accuracy</span>
                    <span class="asset-detail-value">${asset.aiAccuracy}%</span>
                </div>
                <div class="asset-detail-row">
                    <span class="asset-detail-label">Description</span>
                    <span class="asset-detail-value">${asset.description}</span>
                </div>
            </div>
            
            <div class="asset-detail-section nearby-claims-section">
                <h5>Linked FRA Claims</h5>
                <div class="nearby-claims-list">
                    ${asset.linkedClaimIds.map(claimId =>
        `<span class="nearby-claim-badge">${claimId}</span>`
    ).join('')}
                </div>
            </div>
        </div>
        
        <div class="asset-modal-actions">
            <button class="asset-modal-btn secondary" onclick="closeAssetDetailsModal()">Close</button>
            <button class="asset-modal-btn primary" onclick="addToDSSLayer('${asset.id}'); closeAssetDetailsModal();">Add to DSS Layer</button>
        </div>
    `;

    modal.style.display = 'block';
}

// Close asset details modal
function closeAssetDetailsModal() {
    document.getElementById('assetDetailsModal').style.display = 'none';
}

// Export assets data
function exportAssetsData() {
    const headers = ['Asset ID', 'Type', 'Name', 'Village', 'District', 'State', 'Area (ha)', 'Latitude', 'Longitude', 'Linked Claims', 'AI Accuracy %'];

    const csvContent = [
        headers.join(','),
        ...assetsDatabase.map(asset => [
            asset.id,
            asset.type,
            asset.name,
            asset.village,
            asset.district,
            asset.state,
            asset.area,
            asset.latitude,
            asset.longitude,
            asset.linkedClaimIds.join(';'),
            asset.aiAccuracy
        ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'fra_assets_export.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
}

// Export claims to CSV
function exportClaims() {
    const headers = ['Claim ID', 'Applicant Name', 'Village', 'District', 'State', 'Claim Type', 'Land Area (ha)', 'AI Score (%)', 'Status', 'Submitted Date'];

    const csvContent = [
        headers.join(','),
        ...claimsDatabase.map(claim => [
            claim.id,
            claim.applicantName,
            claim.village,
            claim.district,
            claim.state,
            claim.claimType,
            claim.landArea,
            claim.aiScore,
            claim.status,
            claim.submittedDate
        ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'fra_claims_export.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
}

// Show feedback page and initialize components
function showFeedbackPage() {
    // Hide all pages first
    const allPages = document.querySelectorAll('.page');
    allPages.forEach(page => page.classList.remove('active'));

    // Show feedback page
    const feedbackPage = document.getElementById('feedback-page');
    if (feedbackPage) {
        feedbackPage.classList.add('active');

        // Initialize feedback components
        setTimeout(() => {
            initializeFeedbackPage();
            startFeedbackAutoRefresh();
        }, 100);
    }

    document.title = 'FRA Feedback & Grievance Portal - FRA Atlas & DSS';
}

// Initialize feedback page components
function initializeFeedbackPage() {
    updateFeedbackSummary();
    populateFeedbackTable();
    initializeFeedbackControls();
    initializeFeedbackCharts();
}

// Update feedback summary
function updateFeedbackSummary() {
    const total = feedbackDatabase.length;
    const pending = feedbackDatabase.filter(f => f.status === 'pending').length;
    const resolved = feedbackDatabase.filter(f => f.status === 'resolved').length;
    const inProgress = feedbackDatabase.filter(f => f.status === 'in-progress').length;

    document.getElementById('totalFeedback').textContent = total;
    document.getElementById('pendingFeedback').textContent = pending;
    document.getElementById('resolvedFeedback').textContent = resolved;
    document.getElementById('inProgressFeedback').textContent = inProgress;

    // Update notification badge
    updateNotificationBadge(pending);
}

// Update notification badge
function updateNotificationBadge(count) {
    const feedbackNavLink = document.querySelector('[data-page="feedback"]');
    if (!feedbackNavLink) return;

    let badge = feedbackNavLink.querySelector('.notification-badge');

    if (count > 0) {
        if (!badge) {
            badge = document.createElement('span');
            badge.className = 'notification-badge';
            feedbackNavLink.style.position = 'relative';
            feedbackNavLink.appendChild(badge);
        }
        badge.textContent = count;
    } else if (badge) {
        badge.remove();
    }
}

// Populate feedback table
function populateFeedbackTable(filteredFeedback = null) {
    const tableBody = document.getElementById('feedbackTableBody');
    if (!tableBody) return;

    const feedback = filteredFeedback || feedbackDatabase;

    tableBody.innerHTML = feedback.map(item => `
        <tr onclick="viewFeedbackDetails('${item.id}')">
            <td><strong>${item.id}</strong></td>
            <td>${item.claimId}</td>
            <td>${item.userName}</td>
            <td>${formatFeedbackCategory(item.category)}</td>
            <td>${item.date}</td>
            <td><span class="feedback-status-badge ${item.status}">${formatFeedbackStatus(item.status)}</span></td>
            <td>
                <button class="feedback-view-btn" onclick="event.stopPropagation(); viewFeedbackDetails('${item.id}')">View</button>
            </td>
        </tr>
    `).join('');
}

// Format feedback category
function formatFeedbackCategory(category) {
    const categoryMap = {
        'delay': 'Delay in Approval',
        'document': 'Document Issue',
        'map': 'Map Error',
        'other': 'Other'
    };
    return categoryMap[category] || category;
}

// Format feedback status
function formatFeedbackStatus(status) {
    const statusMap = {
        'pending': 'Pending',
        'in-progress': 'In Progress',
        'resolved': 'Resolved',
        'rejected': 'Rejected'
    };
    return statusMap[status] || status;
}

// Initialize feedback controls
function initializeFeedbackControls() {
    // Filter controls
    document.getElementById('feedbackStatusFilter').addEventListener('change', filterFeedback);
    document.getElementById('feedbackCategoryFilter').addEventListener('change', filterFeedback);
    document.getElementById('feedbackDistrictFilter').addEventListener('change', filterFeedback);

    // Form controls
    document.getElementById('feedbackForm').addEventListener('submit', handleFeedbackSubmission);
    document.getElementById('feedbackAttachment').addEventListener('change', handleFeedbackFileUpload);
    document.getElementById('feedbackDescription').addEventListener('input', updateCharCounter);
}

// Filter feedback
function filterFeedback() {
    const statusFilter = document.getElementById('feedbackStatusFilter').value;
    const categoryFilter = document.getElementById('feedbackCategoryFilter').value;
    const districtFilter = document.getElementById('feedbackDistrictFilter').value;

    let filteredFeedback = feedbackDatabase;

    if (statusFilter) {
        filteredFeedback = filteredFeedback.filter(f => f.status === statusFilter);
    }

    if (categoryFilter) {
        filteredFeedback = filteredFeedback.filter(f => f.category === categoryFilter);
    }

    if (districtFilter) {
        filteredFeedback = filteredFeedback.filter(f => f.district === districtFilter);
    }

    populateFeedbackTable(filteredFeedback);
}

// Toggle feedback form
function toggleFeedbackForm() {
    const formContainer = document.getElementById('feedbackFormContainer');
    const toggleBtn = document.getElementById('toggleFormBtn');

    if (formContainer.style.display === 'none') {
        formContainer.style.display = 'block';
        toggleBtn.innerHTML = '<i data-lucide="x"></i> Close Form';
    } else {
        formContainer.style.display = 'none';
        toggleBtn.innerHTML = '<i data-lucide="plus"></i> New Feedback';
        document.getElementById('feedbackForm').reset();
        document.getElementById('feedbackFileName').style.display = 'none';
    }

    // Re-initialize Lucide icons
    setTimeout(() => lucide.createIcons(), 100);
}

// Handle feedback file upload
function handleFeedbackFileUpload(event) {
    const file = event.target.files[0];
    const fileNameDiv = document.getElementById('feedbackFileName');

    if (file) {
        fileNameDiv.textContent = `Selected: ${file.name}`;
        fileNameDiv.style.display = 'block';
    } else {
        fileNameDiv.style.display = 'none';
    }
}

// Update character counter
function updateCharCounter() {
    const textarea = document.getElementById('feedbackDescription');
    const counter = document.getElementById('charCount');
    counter.textContent = textarea.value.length;
}

// Handle feedback submission
function handleFeedbackSubmission(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const feedbackId = generateFeedbackId();

    const newFeedback = {
        id: feedbackId,
        claimId: formData.get('claimId'),
        userName: formData.get('name'),
        category: formData.get('category'),
        district: formData.get('district'),
        description: formData.get('description'),
        date: new Date().toISOString().split('T')[0],
        status: 'pending',
        attachment: formData.get('attachment').name || null,
        timeline: [
            {
                action: 'Submitted',
                by: formData.get('name'),
                date: new Date().toISOString().split('T')[0],
                notes: 'Feedback submitted'
            }
        ],
        response: ''
    };

    // Add to database
    feedbackDatabase.unshift(newFeedback);

    // Update UI
    updateFeedbackSummary();
    populateFeedbackTable();
    toggleFeedbackForm();

    // Show success modal
    showFeedbackSuccessModal(feedbackId);
}

// Generate feedback ID
function generateFeedbackId() {
    const year = new Date().getFullYear();
    const id = String(feedbackIdCounter++).padStart(3, '0');
    return `FBK-${year}-${id}`;
}

// Show feedback success modal
function showFeedbackSuccessModal(feedbackId) {
    const modal = document.getElementById('feedbackSuccessModal');
    document.getElementById('generatedFeedbackId').textContent = feedbackId;
    modal.style.display = 'block';

    // Re-initialize Lucide icons
    setTimeout(() => lucide.createIcons(), 100);
}

// Close feedback success modal
function closeFeedbackSuccessModal() {
    document.getElementById('feedbackSuccessModal').style.display = 'none';
}

// View feedback details
function viewFeedbackDetails(feedbackId) {
    console.log('Opening feedback details for:', feedbackId);
    
    const feedback = feedbackDatabase.find(f => f.id === feedbackId);
    if (!feedback) {
        console.error('Feedback not found:', feedbackId);
        showToast('Feedback not found', 'error');
        return;
    }

    const modal = document.getElementById('feedbackDetailsModal');
    const modalBody = document.getElementById('feedbackDetailsBody');
    const titleElement = document.getElementById('feedbackDetailsTitle');
    
    if (!modal || !modalBody || !titleElement) {
        console.error('Feedback details modal elements not found');
        return;
    }

    titleElement.textContent = `Feedback Details - ${feedback.id}`;

    modalBody.innerHTML = `
        <div class="feedback-details-grid">
            <div class="feedback-detail-section">
                <h5>Basic Information</h5>
                <div class="feedback-detail-row">
                    <span class="feedback-detail-label">Feedback ID</span>
                    <span class="feedback-detail-value">${feedback.id}</span>
                </div>
                <div class="feedback-detail-row">
                    <span class="feedback-detail-label">Claim ID</span>
                    <span class="feedback-detail-value">${feedback.claimId}</span>
                </div>
                <div class="feedback-detail-row">
                    <span class="feedback-detail-label">User Name</span>
                    <span class="feedback-detail-value">${feedback.userName}</span>
                </div>
                <div class="feedback-detail-row">
                    <span class="feedback-detail-label">Category</span>
                    <span class="feedback-detail-value">${formatFeedbackCategory(feedback.category)}</span>
                </div>
                <div class="feedback-detail-row">
                    <span class="feedback-detail-label">District</span>
                    <span class="feedback-detail-value">${feedback.district.charAt(0).toUpperCase() + feedback.district.slice(1)}</span>
                </div>
            </div>
            
            <div class="feedback-detail-section">
                <h5>Status Information</h5>
                <div class="feedback-detail-row">
                    <span class="feedback-detail-label">Date Submitted</span>
                    <span class="feedback-detail-value">${feedback.date}</span>
                </div>
                <div class="feedback-detail-row">
                    <span class="feedback-detail-label">Current Status</span>
                    <span class="feedback-detail-value">
                        <span class="feedback-status-badge ${feedback.status}">${formatFeedbackStatus(feedback.status)}</span>
                    </span>
                </div>
                <div class="feedback-detail-row">
                    <span class="feedback-detail-label">Attachment</span>
                    <span class="feedback-detail-value">${feedback.attachment || 'No attachment'}</span>
                </div>
            </div>
            
            <div class="feedback-detail-section feedback-description-section">
                <h5>Description</h5>
                <div class="feedback-description-text">${feedback.description}</div>
            </div>
            
            <div class="feedback-detail-section feedback-response-section">
                <h5>Officer Response / Action Taken Note</h5>
                <textarea class="feedback-response-textarea" id="feedbackResponse" placeholder="Enter your response or action taken...">${feedback.response}</textarea>
            </div>
            
            <div class="feedback-detail-section feedback-timeline-section">
                <h5>Feedback Timeline</h5>
                <div class="feedback-timeline">
                    ${feedback.timeline.map(item => `
                        <div class="feedback-timeline-item">
                            <div class="feedback-timeline-icon">
                                <i data-lucide="check"></i>
                            </div>
                            <div class="feedback-timeline-content">
                                <div class="feedback-timeline-title">${item.action}</div>
                                <div class="feedback-timeline-meta">By ${item.by} on ${item.date}</div>
                                ${item.notes ? `<div class="feedback-timeline-note">${item.notes}</div>` : ''}
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
        
        <div class="feedback-modal-actions">
            <button class="feedback-modal-btn secondary" onclick="closeFeedbackDetailsModal()">Close</button>
            <button class="feedback-modal-btn reject" onclick="updateFeedbackStatus('${feedback.id}', 'rejected')">Reject</button>
            <button class="feedback-modal-btn progress" onclick="updateFeedbackStatus('${feedback.id}', 'in-progress')">Mark as In Progress</button>
            <button class="feedback-modal-btn resolve" onclick="updateFeedbackStatus('${feedback.id}', 'resolved')">Mark as Resolved</button>
        </div>
    `;

    modal.style.display = 'block';

    // Re-initialize Lucide icons
    setTimeout(() => lucide.createIcons(), 100);
}

// Close feedback details modal
function closeFeedbackDetailsModal() {
    document.getElementById('feedbackDetailsModal').style.display = 'none';
}

// Update feedback status
function updateFeedbackStatus(feedbackId, newStatus) {
    const feedback = feedbackDatabase.find(f => f.id === feedbackId);
    if (!feedback) return;

    const response = document.getElementById('feedbackResponse')?.value || '';

    // Update status
    feedback.status = newStatus;
    feedback.response = response;

    // Add to timeline
    feedback.timeline.push({
        action: formatFeedbackStatus(newStatus),
        by: 'District Officer',
        date: new Date().toISOString().split('T')[0],
        notes: response || 'Status updated'
    });

    // Update UI
    updateFeedbackSummary();
    populateFeedbackTable();
    closeFeedbackDetailsModal();

    // Show success message
    alert(`Feedback ${feedbackId} has been marked as ${formatFeedbackStatus(newStatus)}!`);
}

// Initialize feedback charts
function initializeFeedbackCharts() {
    initializeFeedbackCategoryChart();
    initializeFeedbackVolumeChart();
}

// Initialize feedback category chart
function initializeFeedbackCategoryChart() {
    const ctx = document.getElementById('feedbackCategoryChart');
    if (!ctx) return;

    if (feedbackCategoryChart) {
        feedbackCategoryChart.destroy();
    }

    const categoryCounts = {
        'Delay': feedbackDatabase.filter(f => f.category === 'delay').length,
        'Document': feedbackDatabase.filter(f => f.category === 'document').length,
        'Map Error': feedbackDatabase.filter(f => f.category === 'map').length,
        'Other': feedbackDatabase.filter(f => f.category === 'other').length
    };

    feedbackCategoryChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: Object.keys(categoryCounts),
            datasets: [{
                data: Object.values(categoryCounts),
                backgroundColor: ['#f59e0b', '#3b82f6', '#10b981', '#6b7280'],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 15,
                        usePointStyle: true,
                        color: '#64748b'
                    }
                },
                tooltip: {
                    backgroundColor: '#1E5631',
                    titleColor: '#ffffff',
                    bodyColor: '#ffffff',
                    borderColor: '#D4AF37',
                    borderWidth: 1
                }
            },
            animation: {
                duration: 1500,
                easing: 'easeOutQuart'
            }
        }
    });
}

// Initialize feedback volume chart
function initializeFeedbackVolumeChart() {
    const ctx = document.getElementById('feedbackVolumeChart');
    if (!ctx) return;

    if (feedbackVolumeChart) {
        feedbackVolumeChart.destroy();
    }

    feedbackVolumeChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
            datasets: [{
                label: 'Feedback Count',
                data: [12, 15, 18, 14, 20, 16, 22, 19, 25, 23],
                backgroundColor: '#1E5631',
                borderColor: '#1E5631',
                borderWidth: 1,
                borderRadius: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: '#1E5631',
                    titleColor: '#ffffff',
                    bodyColor: '#ffffff',
                    borderColor: '#D4AF37',
                    borderWidth: 1
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: '#f1f5f9'
                    },
                    ticks: {
                        color: '#64748b'
                    }
                },
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        color: '#64748b'
                    }
                }
            },
            animation: {
                duration: 2000,
                easing: 'easeOutQuart'
            }
        }
    });
}

// Start feedback auto-refresh
function startFeedbackAutoRefresh() {
    // Clear existing interval
    if (feedbackRefreshInterval) {
        clearInterval(feedbackRefreshInterval);
    }

    // Set up auto-refresh every 60 seconds
    feedbackRefreshInterval = setInterval(() => {
        if (document.getElementById('feedback-page').classList.contains('active')) {
            updateFeedbackSummary();
            populateFeedbackTable();
        }
    }, 60000);
}

// Export feedback data
function exportFeedbackData() {
    const headers = ['Feedback ID', 'Claim ID', 'User Name', 'Category', 'District', 'Description', 'Date', 'Status', 'Response'];

    const csvContent = [
        headers.join(','),
        ...feedbackDatabase.map(feedback => [
            feedback.id,
            feedback.claimId,
            feedback.userName,
            feedback.category,
            feedback.district,
            `"${feedback.description}"`,
            feedback.date,
            feedback.status,
            `"${feedback.response}"`
        ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'fra_feedback_export.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
}

// Show issues page and initialize components
function showIssuesPage() {
    // Hide all pages first
    const allPages = document.querySelectorAll('.page');
    allPages.forEach(page => page.classList.remove('active'));

    // Show issues page
    const issuesPage = document.getElementById('issues-page');
    if (issuesPage) {
        issuesPage.classList.add('active');

        // Initialize issues components
        setTimeout(() => {
            initializeIssuesPage();
            startIssuesAutoRefresh();
        }, 100);
    }

    document.title = 'FRA Internal Issues Monitor - FRA Atlas & DSS';
}

// Initialize issues page components
function initializeIssuesPage() {
    updateIssuesSummary();
    populateIssuesTable();
    initializeIssuesControls();
    initializeIssuesCharts();
}

// Update issues summary
function updateIssuesSummary() {
    const total = issuesDatabase.length;
    const open = issuesDatabase.filter(i => i.status === 'open').length;
    const inProgress = issuesDatabase.filter(i => i.status === 'in-progress').length;
    const resolved = issuesDatabase.filter(i => i.status === 'resolved').length;
    const critical = issuesDatabase.filter(i => i.priority === 'high').length;

    document.getElementById('totalIssues').textContent = total;
    document.getElementById('openIssues').textContent = open;
    document.getElementById('inProgressIssues').textContent = inProgress;
    document.getElementById('resolvedIssues').textContent = resolved;
    document.getElementById('criticalIssues').textContent = critical;

    // Update progress
    const resolvedPercent = total > 0 ? Math.round((resolved / total) * 100) : 0;
    document.getElementById('resolvedThisMonth').textContent = resolved;
    document.getElementById('totalThisMonth').textContent = total;
    document.getElementById('issuesProgressFill').style.width = resolvedPercent + '%';

    // Update notification badge
    updateIssuesNotificationBadge(open);

    // Check for critical issues
    if (critical > 0) {
        showCriticalIssueNotification(critical);
    }
}

// Update issues notification badge
function updateIssuesNotificationBadge(count) {
    const issuesNavLink = document.querySelector('[data-page="issues"]');
    if (!issuesNavLink) return;

    let badge = issuesNavLink.querySelector('.notification-badge');

    if (count > 0) {
        if (!badge) {
            badge = document.createElement('span');
            badge.className = 'notification-badge';
            issuesNavLink.style.position = 'relative';
            issuesNavLink.appendChild(badge);
        }
        badge.textContent = count;
    } else if (badge) {
        badge.remove();
    }
}

// Show critical issue notification
function showCriticalIssueNotification(count) {
    // Only show once per session
    if (sessionStorage.getItem('criticalIssueNotified')) return;

    setTimeout(() => {
        alert(`⚠️ ALERT: ${count} critical issue(s) require immediate attention!`);
        sessionStorage.setItem('criticalIssueNotified', 'true');
    }, 1000);
}

// Populate issues table
function populateIssuesTable(filteredIssues = null) {
    const tableBody = document.getElementById('issuesTableBody');
    if (!tableBody) return;

    const issues = filteredIssues || issuesDatabase;

    tableBody.innerHTML = issues.map(issue => `
        <tr onclick="viewIssueDetails('${issue.id}')">
            <td><strong>${issue.id}</strong></td>
            <td>${issue.title}</td>
            <td>${formatIssueCategory(issue.category)}</td>
            <td><span class="issue-priority-badge ${issue.priority}">${issue.priority}</span></td>
            <td>${issue.assignedTo}</td>
            <td><span class="issue-status-badge ${issue.status}">${formatIssueStatus(issue.status)}</span></td>
            <td>${issue.lastUpdated}</td>
            <td>
                <button class="issue-view-btn" onclick="event.stopPropagation(); viewIssueDetails('${issue.id}')">View</button>
            </td>
        </tr>
    `).join('');
}

// Format issue category
function formatIssueCategory(category) {
    const categoryMap = {
        'data': 'Data Error',
        'gis': 'GIS Layer Problem',
        'access': 'User Access',
        'performance': 'Performance',
        'other': 'Other'
    };
    return categoryMap[category] || category;
}

// Format issue status
function formatIssueStatus(status) {
    const statusMap = {
        'open': 'Open',
        'in-progress': 'In Progress',
        'resolved': 'Resolved'
    };
    return statusMap[status] || status;
}

// Initialize issues controls
function initializeIssuesControls() {
    // Filter controls
    document.getElementById('issuesCategoryFilter').addEventListener('change', filterIssues);
    document.getElementById('issuesPriorityFilter').addEventListener('change', filterIssues);
    document.getElementById('issuesStatusFilter').addEventListener('change', filterIssues);
    document.getElementById('issuesSearch').addEventListener('input', filterIssues);

    // Form controls
    document.getElementById('newIssueForm').addEventListener('submit', handleIssueSubmission);
    document.getElementById('issueAttachment').addEventListener('change', handleIssueFileUpload);
    document.getElementById('issueDescription').addEventListener('input', updateIssueCharCounter);
}

// Filter issues
function filterIssues() {
    const categoryFilter = document.getElementById('issuesCategoryFilter').value;
    const priorityFilter = document.getElementById('issuesPriorityFilter').value;
    const statusFilter = document.getElementById('issuesStatusFilter').value;
    const searchTerm = document.getElementById('issuesSearch').value.toLowerCase();

    let filteredIssues = issuesDatabase;

    if (categoryFilter) {
        filteredIssues = filteredIssues.filter(i => i.category === categoryFilter);
    }

    if (priorityFilter) {
        filteredIssues = filteredIssues.filter(i => i.priority === priorityFilter);
    }

    if (statusFilter) {
        filteredIssues = filteredIssues.filter(i => i.status === statusFilter);
    }

    if (searchTerm) {
        filteredIssues = filteredIssues.filter(i =>
            i.id.toLowerCase().includes(searchTerm) ||
            i.title.toLowerCase().includes(searchTerm) ||
            i.description.toLowerCase().includes(searchTerm)
        );
    }

    populateIssuesTable(filteredIssues);
}

// Open new issue form
function openNewIssueForm() {
    document.getElementById('newIssueModal').style.display = 'block';
}

// Close new issue form
function closeNewIssueForm() {
    document.getElementById('newIssueModal').style.display = 'none';
    document.getElementById('newIssueForm').reset();
    document.getElementById('issueFileName').style.display = 'none';
}

// Handle issue file upload
function handleIssueFileUpload(event) {
    const file = event.target.files[0];
    const fileNameDiv = document.getElementById('issueFileName');

    if (file) {
        fileNameDiv.textContent = `Selected: ${file.name}`;
        fileNameDiv.style.display = 'block';
    } else {
        fileNameDiv.style.display = 'none';
    }
}

// Update issue character counter
function updateIssueCharCounter() {
    const textarea = document.getElementById('issueDescription');
    const counter = document.getElementById('issueCharCount');
    counter.textContent = textarea.value.length;
}

// Handle issue submission
function handleIssueSubmission(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const issueId = generateIssueId();
    const currentDate = new Date().toISOString().split('T')[0];

    const newIssue = {
        id: issueId,
        title: formData.get('title'),
        category: formData.get('category'),
        priority: formData.get('priority'),
        assignedTo: formData.get('assignedTo'),
        district: formData.get('district') || '',
        description: formData.get('description'),
        status: 'open',
        lastUpdated: currentDate,
        createdDate: currentDate,
        attachment: formData.get('attachment').name || null,
        comments: [
            {
                author: 'Admin',
                date: currentDate,
                text: 'Issue reported and assigned'
            }
        ]
    };

    // Add to database
    issuesDatabase.unshift(newIssue);

    // Update UI
    updateIssuesSummary();
    populateIssuesTable();
    initializeIssuesCharts();
    closeNewIssueForm();

    // Show success message
    alert(`Issue ${issueId} has been created successfully!`);
}

// Generate issue ID
function generateIssueId() {
    const year = new Date().getFullYear();
    const id = String(issueIdCounter++).padStart(3, '0');
    return `ISS-JH-${year}-${id}`;
}

// View issue details
function viewIssueDetails(issueId) {
    const issue = issuesDatabase.find(i => i.id === issueId);
    if (!issue) return;

    const modal = document.getElementById('issueDetailsModal');
    const modalBody = document.getElementById('issueDetailsBody');
    const titleElement = document.getElementById('issueDetailsTitle');

    titleElement.textContent = `Issue Details - ${issue.id}`;

    modalBody.innerHTML = `
        <div class="issue-details-grid">
            <div class="issue-detail-section">
                <h5>Basic Information</h5>
                <div class="issue-detail-row">
                    <span class="issue-detail-label">Issue ID</span>
                    <span class="issue-detail-value">${issue.id}</span>
                </div>
                <div class="issue-detail-row">
                    <span class="issue-detail-label">Title</span>
                    <span class="issue-detail-value">${issue.title}</span>
                </div>
                <div class="issue-detail-row">
                    <span class="issue-detail-label">Category</span>
                    <span class="issue-detail-value">${formatIssueCategory(issue.category)}</span>
                </div>
                <div class="issue-detail-row">
                    <span class="issue-detail-label">Priority</span>
                    <span class="issue-detail-value">
                        <span class="issue-priority-badge ${issue.priority}">${issue.priority}</span>
                    </span>
                </div>
            </div>
            
            <div class="issue-detail-section">
                <h5>Status Information</h5>
                <div class="issue-detail-row">
                    <span class="issue-detail-label">Status</span>
                    <span class="issue-detail-value">
                        <span class="issue-status-badge ${issue.status}">${formatIssueStatus(issue.status)}</span>
                    </span>
                </div>
                <div class="issue-detail-row">
                    <span class="issue-detail-label">Assigned To</span>
                    <span class="issue-detail-value">${issue.assignedTo}</span>
                </div>
                <div class="issue-detail-row">
                    <span class="issue-detail-label">Created Date</span>
                    <span class="issue-detail-value">${issue.createdDate}</span>
                </div>
                <div class="issue-detail-row">
                    <span class="issue-detail-label">Last Updated</span>
                    <span class="issue-detail-value">${issue.lastUpdated}</span>
                </div>
            </div>
            
            <div class="issue-detail-section" style="grid-column: 1 / -1;">
                <h5>Description</h5>
                <div style="background: white; padding: 1rem; border-radius: 6px; border: 1px solid #d1d5db;">
                    ${issue.description}
                </div>
            </div>
            
            <div class="issue-detail-section issue-comments-section">
                <h5>Comments Thread</h5>
                <div class="issue-comments-thread">
                    ${issue.comments.map(comment => `
                        <div class="issue-comment">
                            <div class="issue-comment-header">
                                <span class="issue-comment-author">${comment.author}</span>
                                <span class="issue-comment-date">${comment.date}</span>
                            </div>
                            <div class="issue-comment-text">${comment.text}</div>
                        </div>
                    `).join('')}
                </div>
                <div class="issue-add-comment">
                    <textarea class="issue-comment-textarea" id="newComment" placeholder="Add a comment..."></textarea>
                </div>
            </div>
        </div>
        
        <div class="issue-modal-actions">
            <button class="issue-modal-btn secondary" onclick="closeIssueDetailsModal()">Close</button>
            <button class="issue-modal-btn reassign" onclick="reassignIssue('${issue.id}')">Reassign</button>
            <button class="issue-modal-btn start" onclick="updateIssueStatus('${issue.id}', 'in-progress')">Start Progress</button>
            <button class="issue-modal-btn resolve" onclick="updateIssueStatus('${issue.id}', 'resolved')">Mark Resolved</button>
        </div>
    `;

    modal.style.display = 'block';
}

// Close issue details modal
function closeIssueDetailsModal() {
    // Save comment if any
    const newComment = document.getElementById('newComment')?.value;
    if (newComment) {
        const issueId = document.getElementById('issueDetailsTitle').textContent.split(' - ')[1];
        const issue = issuesDatabase.find(i => i.id === issueId);
        if (issue) {
            issue.comments.push({
                author: 'Current User',
                date: new Date().toISOString().split('T')[0],
                text: newComment
            });
        }
    }

    document.getElementById('issueDetailsModal').style.display = 'none';
}

// Update issue status
function updateIssueStatus(issueId, newStatus) {
    const issue = issuesDatabase.find(i => i.id === issueId);
    if (!issue) return;

    issue.status = newStatus;
    issue.lastUpdated = new Date().toISOString().split('T')[0];

    // Add comment
    issue.comments.push({
        author: 'Current User',
        date: issue.lastUpdated,
        text: `Status changed to ${formatIssueStatus(newStatus)}`
    });

    // Update UI
    updateIssuesSummary();
    populateIssuesTable();
    initializeIssuesCharts();
    closeIssueDetailsModal();

    alert(`Issue ${issueId} has been marked as ${formatIssueStatus(newStatus)}!`);
}

// Reassign issue
function reassignIssue(issueId) {
    const newAssignee = prompt('Assign to:', 'District Officer');
    if (!newAssignee) return;

    const issue = issuesDatabase.find(i => i.id === issueId);
    if (!issue) return;

    issue.assignedTo = newAssignee;
    issue.lastUpdated = new Date().toISOString().split('T')[0];

    // Add comment
    issue.comments.push({
        author: 'Current User',
        date: issue.lastUpdated,
        text: `Reassigned to ${newAssignee}`
    });

    // Update UI
    populateIssuesTable();
    closeIssueDetailsModal();

    alert(`Issue ${issueId} has been reassigned to ${newAssignee}!`);
}

// Initialize issues charts
function initializeIssuesCharts() {
    initializeIssuesCategoryChart();
    initializeIssuesPriorityChart();
    initializeIssuesTimelineChart();
}

// Initialize issues category chart
function initializeIssuesCategoryChart() {
    const ctx = document.getElementById('issuesCategoryChart');
    if (!ctx) return;

    if (issuesCategoryChart) {
        issuesCategoryChart.destroy();
    }

    const categoryCounts = {
        'Data Error': issuesDatabase.filter(i => i.category === 'data').length,
        'GIS Problem': issuesDatabase.filter(i => i.category === 'gis').length,
        'User Access': issuesDatabase.filter(i => i.category === 'access').length,
        'Performance': issuesDatabase.filter(i => i.category === 'performance').length,
        'Other': issuesDatabase.filter(i => i.category === 'other').length
    };

    issuesCategoryChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: Object.keys(categoryCounts),
            datasets: [{
                data: Object.values(categoryCounts),
                backgroundColor: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#6b7280'],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 15,
                        usePointStyle: true,
                        color: '#64748b'
                    }
                },
                tooltip: {
                    backgroundColor: '#1E5631',
                    titleColor: '#ffffff',
                    bodyColor: '#ffffff',
                    borderColor: '#D4AF37',
                    borderWidth: 1
                }
            }
        }
    });
}

// Initialize issues priority chart
function initializeIssuesPriorityChart() {
    const ctx = document.getElementById('issuesPriorityChart');
    if (!ctx) return;

    if (issuesPriorityChart) {
        issuesPriorityChart.destroy();
    }

    const priorityCounts = {
        'High': issuesDatabase.filter(i => i.priority === 'high').length,
        'Medium': issuesDatabase.filter(i => i.priority === 'medium').length,
        'Low': issuesDatabase.filter(i => i.priority === 'low').length
    };

    issuesPriorityChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: Object.keys(priorityCounts),
            datasets: [{
                data: Object.values(priorityCounts),
                backgroundColor: ['#ef4444', '#f59e0b', '#10b981'],
                borderWidth: 0,
                cutout: '60%'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 15,
                        usePointStyle: true,
                        color: '#64748b'
                    }
                },
                tooltip: {
                    backgroundColor: '#1E5631',
                    titleColor: '#ffffff',
                    bodyColor: '#ffffff',
                    borderColor: '#D4AF37',
                    borderWidth: 1
                }
            }
        }
    });
}

// Initialize issues timeline chart
function initializeIssuesTimelineChart() {
    const ctx = document.getElementById('issuesTimelineChart');
    if (!ctx) return;

    if (issuesTimelineChart) {
        issuesTimelineChart.destroy();
    }

    // Mock data for last 30 days
    const labels = [];
    const data = [];
    for (let i = 29; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        labels.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
        data.push(Math.floor(Math.random() * 5) + 1);
    }

    issuesTimelineChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Issues Reported',
                data: data,
                borderColor: '#1E5631',
                backgroundColor: 'rgba(30, 86, 49, 0.1)',
                borderWidth: 2,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: '#1E5631',
                pointBorderColor: '#ffffff',
                pointBorderWidth: 2,
                pointRadius: 3
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: '#1E5631',
                    titleColor: '#ffffff',
                    bodyColor: '#ffffff',
                    borderColor: '#D4AF37',
                    borderWidth: 1
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: '#f1f5f9'
                    },
                    ticks: {
                        color: '#64748b'
                    }
                },
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        color: '#64748b',
                        maxRotation: 45,
                        minRotation: 45
                    }
                }
            }
        }
    });
}

// Start issues auto-refresh
function startIssuesAutoRefresh() {
    // Clear existing interval
    if (issuesRefreshInterval) {
        clearInterval(issuesRefreshInterval);
    }

    // Set up auto-refresh every 60 seconds
    issuesRefreshInterval = setInterval(() => {
        if (document.getElementById('issues-page').classList.contains('active')) {
            updateIssuesSummary();
            populateIssuesTable();
        }
    }, 60000);
}

// Export issues CSV
function exportIssuesCSV() {
    const headers = ['Issue ID', 'Title', 'Category', 'Priority', 'Assigned To', 'Status', 'Created Date', 'Last Updated', 'Description'];

    const csvContent = [
        headers.join(','),
        ...issuesDatabase.map(issue => [
            issue.id,
            `"${issue.title}"`,
            issue.category,
            issue.priority,
            issue.assignedTo,
            issue.status,
            issue.createdDate,
            issue.lastUpdated,
            `"${issue.description}"`
        ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'fra_issues_export.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
}

// Export analytics PDF
function exportAnalyticsPDF() {
    alert('PDF export functionality would generate a comprehensive analytics report with all charts and statistics.');
}

// Show admin page and initialize components
function showAdminPage() {
    // Hide all pages first
    const allPages = document.querySelectorAll('.page');
    allPages.forEach(page => page.classList.remove('active'));

    // Show admin page
    const adminPage = document.getElementById('admin-page');
    if (adminPage) {
        adminPage.classList.add('active');

        // Initialize admin components
        setTimeout(() => {
            initializeAdminPage();
        }, 100);
    }

    document.title = 'Administrative Control Center - FRA Atlas & DSS';
}

// Initialize admin page components
function initializeAdminPage() {
    updateAdminSummary();
    populateUsersTable();
    populatePermissionMatrix();
    populateActivityLogs();
    initializeAdminControls();
    initializeAdminCharts();
}

// Update admin summary
function updateAdminSummary() {
    const total = usersDatabase.length;
    const citizens = usersDatabase.filter(u => u.role === 'citizen').length;
    const district = usersDatabase.filter(u => u.role === 'district').length;
    const state = usersDatabase.filter(u => u.role === 'state').length;
    const admins = usersDatabase.filter(u => u.role === 'admin').length;

    document.getElementById('totalUsers').textContent = total;
    document.getElementById('citizenUsers').textContent = citizens;
    document.getElementById('districtOfficers').textContent = district;
    document.getElementById('stateOfficers').textContent = state;
    document.getElementById('adminUsers').textContent = admins;
}

// Populate users table
function populateUsersTable(filteredUsers = null) {
    const tableBody = document.getElementById('adminUsersTableBody');
    if (!tableBody) return;

    const users = filteredUsers || usersDatabase;

    tableBody.innerHTML = users.map(user => `
        <tr>
            <td><strong>${user.id}</strong></td>
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td><span class="user-role-badge ${user.role}">${formatUserRole(user.role)}</span></td>
            <td><span class="user-status-badge ${user.status}">${user.status}</span></td>
            <td>${user.lastLogin}</td>
            <td>
                <div class="user-actions">
                    <button class="user-action-btn edit" onclick="editUser('${user.id}')">Edit Role</button>
                    <button class="user-action-btn deactivate" onclick="toggleUserStatus('${user.id}')">${user.status === 'active' ? 'Deactivate' : 'Activate'}</button>
                    <button class="user-action-btn reset" onclick="resetPassword('${user.id}')">Reset Password</button>
                </div>
            </td>
        </tr>
    `).join('');
}

// Format user role
function formatUserRole(role) {
    const roleMap = {
        'citizen': 'Citizen',
        'district': 'District Officer',
        'state': 'State Officer',
        'admin': 'Admin'
    };
    return roleMap[role] || role;
}

// Populate permission matrix
function populatePermissionMatrix() {
    const tableBody = document.getElementById('permissionMatrixBody');
    if (!tableBody) return;

    tableBody.innerHTML = Object.keys(permissionsMatrix).map(module => `
        <tr>
            <td>${module}</td>
            <td>
                <div class="permission-checkbox">
                    <input type="checkbox" id="perm-${module}-citizen" ${permissionsMatrix[module].citizen ? 'checked' : ''}>
                    <label for="perm-${module}-citizen">Access</label>
                </div>
            </td>
            <td>
                <div class="permission-checkbox">
                    <input type="checkbox" id="perm-${module}-district" ${permissionsMatrix[module].district ? 'checked' : ''}>
                    <label for="perm-${module}-district">Access</label>
                </div>
            </td>
            <td>
                <div class="permission-checkbox">
                    <input type="checkbox" id="perm-${module}-state" ${permissionsMatrix[module].state ? 'checked' : ''}>
                    <label for="perm-${module}-state">Access</label>
                </div>
            </td>
            <td>
                <div class="permission-checkbox">
                    <input type="checkbox" id="perm-${module}-admin" ${permissionsMatrix[module].admin ? 'checked' : ''}>
                    <label for="perm-${module}-admin">Access</label>
                </div>
            </td>
        </tr>
    `).join('');
}

// Populate activity logs
function populateActivityLogs(filteredLogs = null) {
    const tableBody = document.getElementById('activityLogsTableBody');
    if (!tableBody) return;

    const logs = filteredLogs || activityLogsDatabase;

    tableBody.innerHTML = logs.map(log => `
        <tr>
            <td><strong>${log.id}</strong></td>
            <td>${log.user}</td>
            <td>${log.action}</td>
            <td>${log.module}</td>
            <td>${log.timestamp}</td>
            <td>${log.ipAddress}</td>
        </tr>
    `).join('');
}

// Initialize admin controls
function initializeAdminControls() {
    // User filters
    document.getElementById('adminRoleFilter').addEventListener('change', filterUsers);
    document.getElementById('adminDistrictFilter').addEventListener('change', filterUsers);
    document.getElementById('adminStatusFilter').addEventListener('change', filterUsers);
    document.getElementById('adminSearch').addEventListener('input', filterUsers);

    // Log filters
    document.getElementById('logStartDate').addEventListener('change', filterActivityLogs);
    document.getElementById('logEndDate').addEventListener('change', filterActivityLogs);
    document.getElementById('logUserRoleFilter').addEventListener('change', filterActivityLogs);

    // Add user form
    document.getElementById('addUserForm').addEventListener('submit', handleAddUser);
}

// Filter users
function filterUsers() {
    const roleFilter = document.getElementById('adminRoleFilter').value;
    const districtFilter = document.getElementById('adminDistrictFilter').value;
    const statusFilter = document.getElementById('adminStatusFilter').value;
    const searchTerm = document.getElementById('adminSearch').value.toLowerCase();

    let filteredUsers = usersDatabase;

    if (roleFilter) {
        filteredUsers = filteredUsers.filter(u => u.role === roleFilter);
    }

    if (districtFilter) {
        filteredUsers = filteredUsers.filter(u => u.district === districtFilter);
    }

    if (statusFilter) {
        filteredUsers = filteredUsers.filter(u => u.status === statusFilter);
    }

    if (searchTerm) {
        filteredUsers = filteredUsers.filter(u =>
            u.name.toLowerCase().includes(searchTerm) ||
            u.email.toLowerCase().includes(searchTerm)
        );
    }

    populateUsersTable(filteredUsers);
}

// Filter activity logs
function filterActivityLogs() {
    const startDate = document.getElementById('logStartDate').value;
    const endDate = document.getElementById('logEndDate').value;
    const roleFilter = document.getElementById('logUserRoleFilter').value;

    let filteredLogs = activityLogsDatabase;

    // Date filtering would be implemented here
    // Role filtering would need user lookup

    populateActivityLogs(filteredLogs);
}

// Open add user form
function openAddUserForm() {
    document.getElementById('addUserModal').style.display = 'block';
}

// Close add user form
function closeAddUserForm() {
    document.getElementById('addUserModal').style.display = 'none';
    document.getElementById('addUserForm').reset();
}

// Handle add user
function handleAddUser(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const userId = generateUserId();
    const currentDate = new Date().toISOString().split('T')[0];

    const newUser = {
        id: userId,
        name: formData.get('name'),
        email: formData.get('email'),
        phone: formData.get('phone') || '',
        role: formData.get('role'),
        district: formData.get('district') || '',
        status: 'active',
        lastLogin: 'Never',
        createdDate: currentDate
    };

    // Add to database
    usersDatabase.unshift(newUser);

    // Add activity log
    activityLogsDatabase.unshift({
        id: `LOG-${String(activityLogsDatabase.length + 1).padStart(3, '0')}`,
        user: 'Admin',
        action: `Created new user: ${newUser.name}`,
        module: 'Admin',
        timestamp: new Date().toLocaleString(),
        ipAddress: '192.168.1.1'
    });

    // Update UI
    updateAdminSummary();
    populateUsersTable();
    populateActivityLogs();
    closeAddUserForm();

    // Show notification
    alert(`✅ User ${userId} created successfully!\n\nWelcome notification sent to ${newUser.email}`);
}

// Generate user ID
function generateUserId() {
    const year = new Date().getFullYear();
    const id = String(userIdCounter++).padStart(3, '0');
    return `USR-${year}-${id}`;
}

// Edit user
function editUser(userId) {
    const user = usersDatabase.find(u => u.id === userId);
    if (!user) return;

    const newRole = prompt(`Change role for ${user.name}:\n\n1. Citizen\n2. District Officer\n3. State Officer\n4. Admin\n\nEnter choice (1-4):`, '1');

    const roleMap = {
        '1': 'citizen',
        '2': 'district',
        '3': 'state',
        '4': 'admin'
    };

    if (roleMap[newRole]) {
        user.role = roleMap[newRole];

        // Add activity log
        activityLogsDatabase.unshift({
            id: `LOG-${String(activityLogsDatabase.length + 1).padStart(3, '0')}`,
            user: 'Admin',
            action: `Changed role for ${user.name} to ${formatUserRole(user.role)}`,
            module: 'Admin',
            timestamp: new Date().toLocaleString(),
            ipAddress: '192.168.1.1'
        });

        // Update UI
        updateAdminSummary();
        populateUsersTable();
        populateActivityLogs();

        alert(`Role updated successfully for ${user.name}!`);
    }
}

// Toggle user status
function toggleUserStatus(userId) {
    const user = usersDatabase.find(u => u.id === userId);
    if (!user) return;

    const action = user.status === 'active' ? 'deactivate' : 'activate';
    const confirmed = confirm(`Are you sure you want to ${action} ${user.name}?`);

    if (confirmed) {
        user.status = user.status === 'active' ? 'inactive' : 'active';

        // Add activity log
        activityLogsDatabase.unshift({
            id: `LOG-${String(activityLogsDatabase.length + 1).padStart(3, '0')}`,
            user: 'Admin',
            action: `${action.charAt(0).toUpperCase() + action.slice(1)}d user: ${user.name}`,
            module: 'Admin',
            timestamp: new Date().toLocaleString(),
            ipAddress: '192.168.1.1'
        });

        // Update UI
        populateUsersTable();
        populateActivityLogs();

        alert(`User ${user.name} has been ${action}d successfully!`);
    }
}

// Reset password
function resetPassword(userId) {
    const user = usersDatabase.find(u => u.id === userId);
    if (!user) return;

    const confirmed = confirm(`Reset password for ${user.name}?\n\nA temporary password will be sent to ${user.email}`);

    if (confirmed) {
        // Add activity log
        activityLogsDatabase.unshift({
            id: `LOG-${String(activityLogsDatabase.length + 1).padStart(3, '0')}`,
            user: 'Admin',
            action: `Reset password for ${user.name}`,
            module: 'Admin',
            timestamp: new Date().toLocaleString(),
            ipAddress: '192.168.1.1'
        });

        // Update UI
        populateActivityLogs();

        alert(`Password reset email sent to ${user.email}!`);
    }
}

// Save permissions
function savePermissions() {
    // Update permissions matrix from checkboxes
    Object.keys(permissionsMatrix).forEach(module => {
        ['citizen', 'district', 'state', 'admin'].forEach(role => {
            const checkbox = document.getElementById(`perm-${module}-${role}`);
            if (checkbox) {
                permissionsMatrix[module][role] = checkbox.checked;
            }
        });
    });

    // Add activity log
    activityLogsDatabase.unshift({
        id: `LOG-${String(activityLogsDatabase.length + 1).padStart(3, '0')}`,
        user: 'Admin',
        action: 'Updated role permissions',
        module: 'Admin',
        timestamp: new Date().toLocaleString(),
        ipAddress: '192.168.1.1'
    });

    // Update UI
    populateActivityLogs();

    alert('✅ Permissions saved successfully!');
}

// Initialize admin charts
function initializeAdminCharts() {
    initializeActionsPerModuleChart();
}

// Initialize actions per module chart
function initializeActionsPerModuleChart() {
    const ctx = document.getElementById('actionsPerModuleChart');
    if (!ctx) return;

    if (actionsPerModuleChart) {
        actionsPerModuleChart.destroy();
    }

    actionsPerModuleChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Dashboard', 'Map', 'Claims', 'Review', 'Assets', 'Feedback', 'Issues'],
            datasets: [{
                label: 'Actions',
                data: [45, 32, 28, 22, 18, 15, 12],
                backgroundColor: '#1E5631',
                borderColor: '#1E5631',
                borderWidth: 1,
                borderRadius: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: '#1E5631',
                    titleColor: '#ffffff',
                    bodyColor: '#ffffff',
                    borderColor: '#D4AF37',
                    borderWidth: 1
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: '#f1f5f9'
                    },
                    ticks: {
                        color: '#64748b'
                    }
                },
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        color: '#64748b'
                    }
                }
            }
        }
    });
}

// Export activity logs
function exportActivityLogs() {
    const headers = ['Log ID', 'User', 'Action Performed', 'Module', 'Timestamp', 'IP Address'];

    const csvContent = [
        headers.join(','),
        ...activityLogsDatabase.map(log => [
            log.id,
            log.user,
            `"${log.action}"`,
            log.module,
            log.timestamp,
            log.ipAddress
        ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'fra_activity_logs_export.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
}

// Close edit user modal
function closeEditUserModal() {
    document.getElementById('editUserModal').style.display = 'none';
}

// Show DSS page and initialize components
function showDSSPage() {
    // Hide all pages first
    const allPages = document.querySelectorAll('.page');
    allPages.forEach(page => page.classList.remove('active'));

    // Show DSS page
    const dssPage = document.getElementById('dss-page');
    if (dssPage) {
        dssPage.classList.add('active');

        // Initialize DSS components
        setTimeout(() => {
            initializeDSSPage();
        }, 100);
    }

    document.title = 'AI-Powered Decision Support System - FRA Atlas & DSS';
}

// Initialize DSS page components
function initializeDSSPage() {
    runAIRecommendationEngine();
    updateDSSSummary();
    populateSchemeCards();
    populateDSSRecommendations();
    initializeDSSMap();
    initializeDSSCharts();
    initializeDSSControls();
}

// AI Recommendation Engine - Rule-based logic
function runAIRecommendationEngine() {
    dssClaimsData.forEach(claim => {
        claim.recommendedSchemes = [];

        // Rule 1: PM-KISAN for small landholders
        if (claim.aiVerified && claim.landArea < 3) {
            claim.recommendedSchemes.push('pm-kisan');
        }

        // Rule 2: Jal Jeevan Mission for water scarcity
        if (claim.waterIndex < 0.5) {
            claim.recommendedSchemes.push('jal-jeevan');
        }

        // Rule 3: MGNREGA for soil degradation
        if (claim.soilDegraded) {
            claim.recommendedSchemes.push('mgnrega');
        }

        // Rule 4: Green India Mission for high forest cover
        if (claim.forestCover > 70) {
            claim.recommendedSchemes.push('green-india');
        }

        // Rule 5: Multiple schemes for multiple assets
        if (claim.linkedAssets > 2 && claim.recommendedSchemes.length < 2) {
            claim.recommendedSchemes.push('pm-kisan', 'jal-jeevan');
        }

        // Remove duplicates
        claim.recommendedSchemes = [...new Set(claim.recommendedSchemes)];
    });
}

// Update DSS summary
function updateDSSSummary() {
    const verifiedClaims = dssClaimsData.filter(c => c.aiVerified).length;
    const villages = [...new Set(dssClaimsData.map(c => c.village))].length;
    const beneficiaries = dssClaimsData.reduce((sum, c) => {
        return sum + c.recommendedSchemes.reduce((schemeSum, scheme) => {
            return schemeSum + (schemeDefinitions[scheme]?.beneficiaries || 0);
        }, 0);
    }, 0);
    const coverage = Math.round((verifiedClaims / dssClaimsData.length) * 100);

    document.getElementById('verifiedClaims').textContent = verifiedClaims;
    document.getElementById('villagesMapped').textContent = villages;
    document.getElementById('eligibleBeneficiaries').textContent = beneficiaries.toLocaleString();
    document.getElementById('developmentCoverage').textContent = coverage + '%';
}

// Populate scheme cards
function populateSchemeCards() {
    const container = document.getElementById('schemeCards');
    if (!container) return;

    const schemeCounts = {};
    dssClaimsData.forEach(claim => {
        claim.recommendedSchemes.forEach(scheme => {
            schemeCounts[scheme] = (schemeCounts[scheme] || 0) + 1;
        });
    });

    container.innerHTML = Object.keys(schemeDefinitions).map(schemeKey => {
        const scheme = schemeDefinitions[schemeKey];
        const count = schemeCounts[schemeKey] || 0;

        return `
            <div class="scheme-card ${schemeKey}">
                <div class="scheme-card-header">
                    <div class="scheme-card-icon">
                        <i data-lucide="${scheme.icon}"></i>
                    </div>
                    <div class="scheme-card-title">${scheme.name}</div>
                </div>
                <div class="scheme-card-description">${scheme.description}</div>
                <div class="scheme-card-stats">
                    <div class="scheme-stat">
                        <strong>${count}</strong>
                        Claims Eligible
                    </div>
                    <div class="scheme-stat">
                        <strong>${scheme.beneficiaries}</strong>
                        Beneficiaries
                    </div>
                </div>
            </div>
        `;
    }).join('');

    // Re-initialize Lucide icons
    setTimeout(() => lucide.createIcons(), 100);
}

// Populate DSS recommendations table
function populateDSSRecommendations(filteredClaims = null) {
    const tableBody = document.getElementById('dssRecommendationsBody');
    if (!tableBody) return;

    const claims = filteredClaims || dssClaimsData;

    tableBody.innerHTML = claims.map(claim => `
        <tr>
            <td><strong>${claim.claimId}</strong></td>
            <td>${claim.village}</td>
            <td><strong>${claim.aiScore}%</strong></td>
            <td>
                <div class="scheme-badges">
                    ${claim.recommendedSchemes.map(scheme =>
        `<span class="scheme-badge ${scheme}">${schemeDefinitions[scheme].name}</span>`
    ).join('')}
                </div>
            </td>
            <td><span class="priority-badge ${claim.priority}">${claim.priority}</span></td>
            <td>
                <div class="dss-action-btns">
                    <button class="dss-action-btn view" onclick="viewEligibilityDetails('${claim.claimId}')">View Details</button>
                    <button class="dss-action-btn send" onclick="sendToImplementation('${claim.claimId}')">Send to Team</button>
                </div>
            </td>
        </tr>
    `).join('');
}

// Initialize DSS map
function initializeDSSMap() {
    const mapContainer = document.getElementById('dssMapContainer');
    if (!mapContainer) return;

    if (!dssMap) {
        dssMap = L.map('dssMapContainer').setView([23.6345, 85.3803], 8);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap contributors'
        }).addTo(dssMap);
        
        // Create layer group for markers
        window.dssMarkersLayer = L.layerGroup().addTo(dssMap);
    }
    
    // Clear existing markers
    if (window.dssMarkersLayer) {
        window.dssMarkersLayer.clearLayers();
    }

    // Add village markers with scheme colors
    dssClaimsData.forEach(claim => {
        // Get coordinates from claim or coordinates object
        const lat = claim.coordinates?.lat || claim.latitude || 23.6 + Math.random();
        const lng = claim.coordinates?.lng || claim.longitude || 85.3 + Math.random();
        
        const color = getSchemeColor(claim.recommendedSchemes[0]);
        const marker = L.circleMarker([lat, lng], {
            radius: 8,
            fillColor: color,
            color: '#ffffff',
            weight: 2,
            opacity: 1,
            fillOpacity: 0.8
        });

        marker.bindPopup(`
            <div class="popup-content">
                <h4>${claim.village}</h4>
                <p><strong>Claim ID:</strong> ${claim.claimId}</p>
                <p><strong>Beneficiaries:</strong> ${claim.recommendedSchemes.length * 100}</p>
                <p><strong>Schemes:</strong> ${claim.recommendedSchemes.map(s => schemeDefinitions[s]?.name || s).join(', ')}</p>
                ${claim.assetType ? `<p><strong>Asset Type:</strong> ${claim.assetType}</p>` : ''}
            </div>
        `);

        if (window.dssMarkersLayer) {
            window.dssMarkersLayer.addLayer(marker);
        } else {
            marker.addTo(dssMap);
        }
    });
    
    console.log('🗺️ DSS map updated with', dssClaimsData.length, 'markers');
}

// Get scheme color
function getSchemeColor(scheme) {
    const colors = {
        'pm-kisan': '#10b981',
        'jal-jeevan': '#3b82f6',
        'mgnrega': '#f59e0b',
        'green-india': '#16a34a'
    };
    return colors[scheme] || '#6b7280';
}

// Initialize DSS charts
function initializeDSSCharts() {
    initializeSchemeDistributionChart();
}

// Initialize scheme distribution chart
function initializeSchemeDistributionChart() {
    const ctx = document.getElementById('schemeDistributionChart');
    if (!ctx) return;

    if (schemeDistributionChart) {
        schemeDistributionChart.destroy();
    }

    const schemeCounts = {};
    dssClaimsData.forEach(claim => {
        claim.recommendedSchemes.forEach(scheme => {
            schemeCounts[scheme] = (schemeCounts[scheme] || 0) + 1;
        });
    });

    schemeDistributionChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: Object.keys(schemeCounts).map(k => schemeDefinitions[k].name),
            datasets: [{
                data: Object.values(schemeCounts),
                backgroundColor: ['#10b981', '#3b82f6', '#f59e0b', '#16a34a'],
                borderWidth: 0,
                cutout: '60%'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 15,
                        usePointStyle: true,
                        color: '#64748b',
                        font: {
                            size: 11
                        }
                    }
                },
                tooltip: {
                    backgroundColor: '#1E5631',
                    titleColor: '#ffffff',
                    bodyColor: '#ffffff',
                    borderColor: '#D4AF37',
                    borderWidth: 1
                }
            }
        }
    });
}

// Initialize DSS controls
function initializeDSSControls() {
    document.getElementById('dssStateFilter').addEventListener('change', filterDSSClaims);
    document.getElementById('dssDistrictFilter').addEventListener('change', filterDSSClaims);
    document.getElementById('dssVillageFilter').addEventListener('change', filterDSSClaims);
    document.getElementById('dssSchemeFilter').addEventListener('change', filterDSSClaims);
}

// Filter DSS claims
function filterDSSClaims() {
    const stateFilter = document.getElementById('dssStateFilter').value;
    const districtFilter = document.getElementById('dssDistrictFilter').value;
    const villageFilter = document.getElementById('dssVillageFilter').value;
    const schemeFilter = document.getElementById('dssSchemeFilter').value;

    let filteredClaims = dssClaimsData;

    if (stateFilter) {
        filteredClaims = filteredClaims.filter(c => c.state === stateFilter);
    }

    if (districtFilter) {
        filteredClaims = filteredClaims.filter(c => c.district === districtFilter);
    }

    if (villageFilter) {
        filteredClaims = filteredClaims.filter(c => c.village === villageFilter);
    }

    if (schemeFilter) {
        filteredClaims = filteredClaims.filter(c => c.recommendedSchemes.includes(schemeFilter));
    }

    populateDSSRecommendations(filteredClaims);
}

// Switch DSS view
function switchDSSView(view) {
    currentDSSView = view;

    document.getElementById('districtDSSBtn').classList.toggle('active', view === 'district');
    document.getElementById('stateDSSBtn').classList.toggle('active', view === 'state');

    // Refresh data based on view
    updateDSSSummary();
    populateDSSRecommendations();
}

// View eligibility details
function viewEligibilityDetails(claimId) {
    const claim = dssClaimsData.find(c => c.claimId === claimId);
    if (!claim) return;

    const modal = document.getElementById('dssEligibilityModal');
    const modalBody = document.getElementById('dssEligibilityBody');

    const logicRules = [];

    if (claim.aiVerified && claim.landArea < 3) {
        logicRules.push('AI Verified = True AND Land Area < 3 ha → PM-KISAN eligible');
    }

    if (claim.waterIndex < 0.5) {
        logicRules.push('Water Index < 0.5 → Jal Jeevan Mission recommended');
    }

    if (claim.soilDegraded) {
        logicRules.push('Soil Degraded = True → MGNREGA (Land Reclamation) eligible');
    }

    if (claim.forestCover > 70) {
        logicRules.push('Forest Cover > 70% → Green India Mission recommended');
    }

    if (claim.linkedAssets > 2) {
        logicRules.push('Multiple Assets Linked → Multi-ministry support eligible');
    }

    modalBody.innerHTML = `
        <div class="eligibility-logic">
            <h5 style="color: var(--primary-color); margin-bottom: 1rem;">AI Logic Rules Applied:</h5>
            ${logicRules.map(rule => `
                <div class="logic-rule">
                    <div class="logic-icon">
                        <i data-lucide="check"></i>
                    </div>
                    <div class="logic-text">${rule}</div>
                </div>
            `).join('')}
        </div>
        
        <div class="logic-result">
            <strong>Recommended Schemes:</strong> ${claim.recommendedSchemes.map(s => schemeDefinitions[s].name).join(', ')}
        </div>
        
        <div style="margin-top: 1.5rem;">
            <h5 style="color: var(--primary-color); margin-bottom: 0.5rem;">Claim Details:</h5>
            <p style="font-size: 0.875rem; color: #64748b; line-height: 1.6;">
                <strong>Claim ID:</strong> ${claim.claimId}<br>
                <strong>Village:</strong> ${claim.village}<br>
                <strong>AI Score:</strong> ${claim.aiScore}%<br>
                <strong>Land Area:</strong> ${claim.landArea} hectares<br>
                <strong>Water Index:</strong> ${claim.waterIndex}<br>
                <strong>Forest Cover:</strong> ${claim.forestCover}%<br>
                <strong>Linked Assets:</strong> ${claim.linkedAssets}
            </p>
        </div>
        
        <div class="modal-actions" style="margin-top: 1.5rem; padding-top: 1rem; border-top: 1px solid #e2e8f0;">
            <button class="modal-btn secondary" onclick="closeDSSEligibilityModal()">Close</button>
        </div>
    `;

    modal.style.display = 'block';

    // Re-initialize Lucide icons
    setTimeout(() => lucide.createIcons(), 100);
}

// Close DSS eligibility modal
function closeDSSEligibilityModal() {
    document.getElementById('dssEligibilityModal').style.display = 'none';
}

// Send to implementation team
function sendToImplementation(claimId) {
    const claim = dssClaimsData.find(c => c.claimId === claimId);
    if (!claim) return;

    const confirmed = confirm(`Send ${claim.claimId} to Implementation Team?\n\nRecommended Schemes:\n${claim.recommendedSchemes.map(s => '• ' + schemeDefinitions[s].name).join('\n')}`);

    if (confirmed) {
        claim.status = 'scheme-linked';

        populateDSSRecommendations();

        alert(`✅ Claim ${claimId} has been sent to Implementation Team!\n\nSchemes: ${claim.recommendedSchemes.map(s => schemeDefinitions[s].name).join(', ')}`);
    }
}

// ===== DASHBOARD QUICK ACTIONS =====

// 1. Generate Dashboard Report (PDF)
async function generateDashboardReport() {
    try {
        showLoader(true);
        showToast('📄 Generating dashboard report...', 'info');
        
        // Fetch claims data
        const response = await api.get('/claims');
        const data = response.data;
        const stats = data.statistics || {};
        const claims = data.data?.claims || [];
        
        // Create PDF using jsPDF
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF();
        
        // Header
        pdf.setFontSize(22);
        pdf.setTextColor(30, 86, 49); // Green
        pdf.text('FRA Atlas - Dashboard Report', 20, 20);
        
        // Date
        pdf.setFontSize(10);
        pdf.setTextColor(100, 100, 100);
        pdf.text(`Generated: ${new Date().toLocaleString()}`, 20, 30);
        pdf.text('Ministry of Tribal Affairs, Government of India', 20, 35);
        
        // Line separator
        pdf.setDrawColor(30, 86, 49);
        pdf.line(20, 40, 190, 40);
        
        // Claims Summary
        pdf.setFontSize(16);
        pdf.setTextColor(0, 0, 0);
        pdf.text('Claims Summary', 20, 50);
        
        pdf.setFontSize(12);
        pdf.text(`Total Claims Filed: ${stats.total || 0}`, 30, 60);
        pdf.text(`✓ Approved: ${stats.approved || 0} (${((stats.approved/stats.total)*100).toFixed(1)}%)`, 30, 70);
        pdf.text(`⏳ Pending: ${stats.pending || 0} (${((stats.pending/stats.total)*100).toFixed(1)}%)`, 30, 80);
        pdf.text(`✗ Rejected: ${stats.rejected || 0} (${((stats.rejected/stats.total)*100).toFixed(1)}%)`, 30, 90);
        pdf.text(`🔍 Under Review: ${stats.under_review || 0}`, 30, 100);
        
        // Recent Claims
        pdf.setFontSize(16);
        pdf.text('Recent Claims', 20, 115);
        
        pdf.setFontSize(10);
        let yPos = 125;
        claims.slice(0, 5).forEach((claim, index) => {
            pdf.text(`${index + 1}. ${claim.claim_number} - ${claim.applicant_name}`, 30, yPos);
            pdf.text(`   ${claim.village}, ${claim.district} - Status: ${claim.status}`, 30, yPos + 5);
            yPos += 15;
        });
        
        // Footer
        pdf.setFontSize(8);
        pdf.setTextColor(150, 150, 150);
        pdf.text('FRA Atlas v2.0 | Confidential Document', 20, 280);
        
        // Save PDF
        const filename = `FRA_Dashboard_Report_${new Date().toISOString().split('T')[0]}.pdf`;
        pdf.save(filename);
        
        showLoader(false);
        showToast('✅ Report generated and downloaded successfully!', 'success');
        updateLastAction('Report Generated');
        
    } catch (error) {
        showLoader(false);
        showToast('❌ Failed to generate report', 'error');
        console.error('Report generation error:', error);
    }
}

// 2. Export Dashboard Data (CSV)
async function exportDashboardData() {
    try {
        showLoader(true);
        showToast('📥 Exporting dashboard data...', 'info');
        
        // Fetch claims data
        const response = await api.get('/claims');
        const claims = response.data.data?.claims || [];
        
        // Create CSV content
        const headers = ['Claim Number', 'Applicant Name', 'Village', 'District', 'State', 'Claim Type', 'Land Area (Ha)', 'Status', 'Created Date'];
        const csvRows = [headers.join(',')];
        
        claims.forEach(claim => {
            const row = [
                claim.claim_number || '',
                `"${claim.applicant_name || ''}"`,
                `"${claim.village || ''}"`,
                `"${claim.district || ''}"`,
                `"${claim.state || ''}"`,
                claim.claim_type || '',
                claim.land_area || '',
                claim.status || '',
                new Date(claim.created_at).toLocaleDateString()
            ];
            csvRows.push(row.join(','));
        });
        
        const csvContent = csvRows.join('\n');
        
        // Create and download CSV file
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `FRA_Claims_Data_${Date.now()}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        
        showLoader(false);
        showToast(`✅ Exported ${claims.length} claims successfully!`, 'success');
        updateLastAction('Data Exported');
        
    } catch (error) {
        showLoader(false);
        showToast('❌ Export failed', 'error');
        console.error('Export error:', error);
    }
}

// 3. View Dashboard Analytics (Modal with Charts)
async function viewDashboardAnalytics() {
    try {
        showLoader(true);
        showToast('📊 Loading analytics...', 'info');
        
        // Use local claimsDatabase if available, otherwise fetch from API
        let claims = [];
        let stats = {};
        
        if (typeof claimsDatabase !== 'undefined' && claimsDatabase.length > 0) {
            // Use local data
            claims = claimsDatabase;
            stats = {
                total: claims.length,
                approved: claims.filter(c => c.status === 'approved').length,
                pending: claims.filter(c => c.status === 'pending' || c.status === 'under-review').length,
                rejected: claims.filter(c => c.status === 'rejected').length,
                under_review: claims.filter(c => c.status === 'under-review').length
            };
            console.log('✅ Using local claimsDatabase:', claims.length, 'claims');
            console.log('📊 Stats:', stats);
            console.log('📋 Sample claim:', claims[0]);
        } else {
            // Fallback to API
            try {
                const response = await api.get('/claims');
                stats = response.data.statistics || {};
                claims = response.data.data?.claims || [];
                console.log('✅ Fetched from API:', claims.length, 'claims');
            } catch (apiError) {
                console.warn('⚠️ API fetch failed, using empty data');
                stats = { total: 0, approved: 0, pending: 0, rejected: 0, under_review: 0 };
                claims = [];
            }
        }
        
        // Create modal
        const modal = document.createElement('div');
        modal.className = 'analytics-modal';
        modal.id = 'analyticsModal';
        modal.innerHTML = `
            <div class="analytics-modal-overlay" onclick="closeAnalyticsModal()"></div>
            <div class="analytics-modal-content">
                <div class="analytics-modal-header">
                    <h2>📊 FRA Analytics Overview</h2>
                    <button class="analytics-close-btn" onclick="closeAnalyticsModal()">
                        <i data-lucide="x"></i>
                    </button>
                </div>
                <div class="analytics-modal-body">
                    <div class="analytics-stats-grid">
                        <div class="analytics-stat-card">
                            <div class="stat-icon" style="background: #dbeafe;">
                                <i data-lucide="file-text" style="color: #3b82f6;"></i>
                            </div>
                            <div class="stat-info">
                                <h4>Total Claims</h4>
                                <p class="stat-value">${stats.total || 0}</p>
                            </div>
                        </div>
                        <div class="analytics-stat-card">
                            <div class="stat-icon" style="background: #d1fae5;">
                                <i data-lucide="check-circle" style="color: #10b981;"></i>
                            </div>
                            <div class="stat-info">
                                <h4>Approved</h4>
                                <p class="stat-value">${stats.approved || 0}</p>
                            </div>
                        </div>
                        <div class="analytics-stat-card">
                            <div class="stat-icon" style="background: #fef3c7;">
                                <i data-lucide="clock" style="color: #f59e0b;"></i>
                            </div>
                            <div class="stat-info">
                                <h4>Pending</h4>
                                <p class="stat-value">${stats.pending || 0}</p>
                            </div>
                        </div>
                        <div class="analytics-stat-card">
                            <div class="stat-icon" style="background: #fee2e2;">
                                <i data-lucide="x-circle" style="color: #ef4444;"></i>
                            </div>
                            <div class="stat-info">
                                <h4>Rejected</h4>
                                <p class="stat-value">${stats.rejected || 0}</p>
                            </div>
                        </div>
                    </div>
                    
                    <div class="analytics-charts-grid">
                        <div class="analytics-chart-card">
                            <h3>Claims Status Distribution</h3>
                            <canvas id="analyticsStatusChart"></canvas>
                        </div>
                        <div class="analytics-chart-card">
                            <h3>District-wise Claims</h3>
                            <canvas id="analyticsDistrictChart"></canvas>
                        </div>
                    </div>
                    
                    <div class="analytics-footer">
                        <button class="btn-secondary" onclick="closeAnalyticsModal()">Close</button>
                        <button class="btn-primary" onclick="generateDashboardReport()">Generate PDF Report</button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Initialize Lucide icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
        
        // Create Status Distribution Chart
        const statusCtx = document.getElementById('analyticsStatusChart');
        new Chart(statusCtx, {
            type: 'doughnut',
            data: {
                labels: ['Approved', 'Pending', 'Rejected', 'Under Review'],
                datasets: [{
                    data: [
                        stats.approved || 0,
                        stats.pending || 0,
                        stats.rejected || 0,
                        stats.under_review || 0
                    ],
                    backgroundColor: ['#10b981', '#f59e0b', '#ef4444', '#3b82f6'],
                    borderWidth: 2,
                    borderColor: '#fff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 15,
                            font: { size: 12 }
                        }
                    }
                }
            }
        });
        
        // Create District Chart
        const districtData = {};
        claims.forEach(claim => {
            districtData[claim.district] = (districtData[claim.district] || 0) + 1;
        });
        
        const districtCtx = document.getElementById('analyticsDistrictChart');
        new Chart(districtCtx, {
            type: 'bar',
            data: {
                labels: Object.keys(districtData),
                datasets: [{
                    label: 'Claims by District',
                    data: Object.values(districtData),
                    backgroundColor: '#1e5631',
                    borderRadius: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    y: { beginAtZero: true }
                }
            }
        });
        
        showLoader(false);
        showToast('✅ Analytics loaded successfully!', 'success');
        updateLastAction('Analytics Viewed');
        
    } catch (error) {
        showLoader(false);
        showToast('❌ Failed to load analytics', 'error');
        console.error('Analytics error:', error);
    }
}

// Close Analytics Modal
function closeAnalyticsModal() {
    const modal = document.getElementById('analyticsModal');
    if (modal) {
        modal.remove();
    }
}

// Update Last Action Timestamp
function updateLastAction(action) {
    const lastActionEl = document.getElementById('lastAction');
    if (lastActionEl) {
        const time = new Date().toLocaleTimeString();
        lastActionEl.textContent = `Last action: ${action} at ${time}`;
    }
}

// Generate DSS report
function generateDSSReport() {
    alert(`📄 Generating Comprehensive DSS Report...\n\n` +
        `Report will include:\n` +
        `• AI Recommendation Summary\n` +
        `• Scheme Distribution Analysis\n` +
        `• Beneficiary Impact Projections\n` +
        `• Village-wise Breakdown\n` +
        `• Implementation Timeline\n\n` +
        `Generated by: FRA DSS Engine v2.0\n` +
        `Date: ${new Date().toLocaleDateString()}\n` +
        `Time: ${new Date().toLocaleTimeString()}\n\n` +
        `Report will be downloaded as PDF.`);
}

// Show reports page and initialize components
function showReportsPage() {
    // Hide all pages first
    const allPages = document.querySelectorAll('.page');
    allPages.forEach(page => page.classList.remove('active'));

    // Show reports page
    const reportsPage = document.getElementById('reports-page');
    if (reportsPage) {
        reportsPage.classList.add('active');

        // Initialize reports components
        setTimeout(() => {
            initializeReportsPage();
        }, 100);
    }

    document.title = 'Reports & Performance Analytics - FRA Atlas & DSS';
}

// Initialize reports page components
function initializeReportsPage() {
    populateDistrictPerformanceTable();
    populateSchemeImpactTable();
    initializeReportsCharts();
}

// Populate district performance table
function populateDistrictPerformanceTable() {
    const tableBody = document.getElementById('districtPerformanceBody');
    if (!tableBody) return;

    tableBody.innerHTML = reportsData.districtPerformance.map(district => `
        <tr>
            <td><strong>${district.district}</strong></td>
            <td>${district.filed}</td>
            <td class="performance-high">${district.approved}</td>
            <td class="performance-medium">${district.pending}</td>
            <td class="performance-high">${district.avgDays}</td>
        </tr>
    `).join('');
}

// Populate scheme impact table
function populateSchemeImpactTable() {
    const tableBody = document.getElementById('schemeImpactBody');
    if (!tableBody) return;

    tableBody.innerHTML = reportsData.schemeImpact.map(scheme => `
        <tr>
            <td><strong>${scheme.scheme}</strong></td>
            <td class="performance-high">${scheme.beneficiaries.toLocaleString()}</td>
            <td>${scheme.budget}</td>
            <td class="performance-${scheme.coverage > 80 ? 'high' : scheme.coverage > 60 ? 'medium' : 'low'}">${scheme.coverage}%</td>
        </tr>
    `).join('');
}

// Initialize reports charts
function initializeReportsCharts() {
    initializeClaimsStatusChart();
    initializeSchemeDistChart();
    initializeMonthlyGrowthChart();
}

// Initialize claims status chart
function initializeClaimsStatusChart() {
    const ctx = document.getElementById('claimsStatusChart');
    if (!ctx) return;

    if (claimsStatusChart) {
        claimsStatusChart.destroy();
    }

    claimsStatusChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Ranchi', 'Dhanbad', 'Hazaribagh', 'Koderma'],
            datasets: [
                {
                    label: 'Approved',
                    data: [890, 720, 620, 580],
                    backgroundColor: '#10b981'
                },
                {
                    label: 'Pending',
                    data: [280, 180, 150, 90],
                    backgroundColor: '#f59e0b'
                },
                {
                    label: 'Rejected',
                    data: [80, 80, 80, 50],
                    backgroundColor: '#ef4444'
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top'
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// Initialize scheme distribution chart
function initializeSchemeDistChart() {
    const ctx = document.getElementById('schemeDistChart');
    if (!ctx) return;

    if (schemeDistChart) {
        schemeDistChart.destroy();
    }

    schemeDistChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['PM-KISAN', 'Jal Jeevan', 'MGNREGA', 'Green India'],
            datasets: [{
                data: [3200, 2100, 1800, 1400],
                backgroundColor: ['#10b981', '#3b82f6', '#f59e0b', '#16a34a']
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

// Initialize monthly growth chart
function initializeMonthlyGrowthChart() {
    const ctx = document.getElementById('monthlyGrowthChart');
    if (!ctx) return;

    if (monthlyGrowthChart) {
        monthlyGrowthChart.destroy();
    }

    monthlyGrowthChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
            datasets: [{
                label: 'Verified Claims',
                data: [420, 480, 520, 580, 640, 720, 800, 850, 920, 1000],
                borderColor: '#1E5631',
                backgroundColor: 'rgba(30, 86, 49, 0.1)',
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// Report functions
function previewReport() {
    alert('📋 Report Preview\n\nFRA Atlas & DSS – Automated Progress Report\nGenerated: ' + new Date().toLocaleString() + '\n\nThis preview shows the report structure with all selected modules and data.');
}

// Download PDF Report Directly - Uses Enhanced PDF with 5 pages
async function downloadPDFDirect() {
    const startDate = document.getElementById('reportStartDate')?.value || '2025-01-01';
    const endDate = document.getElementById('reportEndDate')?.value || '2025-01-31';
    
    try {
        showLoader(true);
        showToast('📄 Generating comprehensive PDF report...', 'info');
        
        console.log(`📄 Generating Enhanced PDF report: ${startDate} to ${endDate}`);
        
        // Use the enhanced PDF generation function
        if (typeof generateEnhancedPDF === 'function') {
            console.log('✅ Using Enhanced PDF Generator');
            await generateEnhancedPDF(startDate, endDate);
            showToast('✅ Enhanced PDF report downloaded successfully!', 'success');
            console.log('✅ Enhanced PDF download complete!');
        } else {
            console.warn('⚠️ Enhanced PDF function not found, using fallback');
            await generatePDFWithCharts(startDate, endDate);
            showToast('PDF generated (standard mode)', 'success');
        }
        
    } catch (error) {
        console.error('❌ PDF generation error:', error);
        showToast(`Failed to generate PDF: ${error.message}`, 'error');
    } finally {
        showLoader(false);
    }
}

// Prepare chart data for PDF generation
function prepareChartDataForPDF() {
    // District-wise claims data
    const districtData = {};
    claimsDatabase.forEach(claim => {
        if (!districtData[claim.district]) {
            districtData[claim.district] = { approved: 0, pending: 0, rejected: 0 };
        }
        if (claim.status === 'approved') districtData[claim.district].approved++;
        else if (claim.status === 'pending') districtData[claim.district].pending++;
        else if (claim.status === 'rejected') districtData[claim.district].rejected++;
    });
    
    // Scheme distribution data
    const schemeData = {};
    dssClaimsData.forEach(claim => {
        claim.recommendedSchemes.forEach(scheme => {
            schemeData[scheme] = (schemeData[scheme] || 0) + 1;
        });
    });
    
    return {
        districtClaims: districtData,
        schemeDistribution: schemeData
    };
}

// Generate Enhanced PDF with charts using jsPDF
async function generatePDFWithCharts(startDate, endDate) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    let yPos = 20;
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    const margin = 20;
    
    // ========================================
    // ENHANCED HEADER WITH BACKGROUND
    // ========================================
    
    // Header background
    doc.setFillColor(22, 101, 52); // Dark green
    doc.rect(0, 0, pageWidth, 45, 'F');
    
    // Government of India emblem placeholder
    doc.setFillColor(255, 255, 255);
    doc.circle(30, 22, 8, 'F');
    doc.setTextColor(22, 101, 52);
    doc.setFontSize(10);
    doc.text('GOI', 30, 24, { align: 'center' });
    
    // Main title
    doc.setFontSize(20);
    doc.setTextColor(255, 255, 255);
    doc.setFont(undefined, 'bold');
    doc.text('MINISTRY OF TRIBAL AFFAIRS', pageWidth / 2, 18, { align: 'center' });
    
    doc.setFontSize(16);
    doc.text('Forest Rights Act - Atlas & DSS', pageWidth / 2, 28, { align: 'center' });
    
    doc.setFontSize(11);
    doc.setFont(undefined, 'normal');
    doc.text('Comprehensive Claims Analysis Report', pageWidth / 2, 37, { align: 'center' });
    
    yPos = 55;
    
    // Report metadata box
    doc.setFillColor(245, 245, 245);
    doc.rect(margin, yPos, pageWidth - 2 * margin, 25, 'F');
    doc.setDrawColor(200, 200, 200);
    doc.rect(margin, yPos, pageWidth - 2 * margin, 25, 'S');
    
    doc.setFontSize(10);
    doc.setTextColor(60, 60, 60);
    doc.text(`Report Period: ${startDate} to ${endDate}`, margin + 5, yPos + 8);
    doc.text(`Generated: ${new Date().toLocaleString('en-IN')}`, margin + 5, yPos + 15);
    doc.text(`Report ID: FRA-RPT-${Date.now()}`, margin + 5, yPos + 22);
    
    doc.text(`State: Jharkhand`, pageWidth - margin - 5, yPos + 8, { align: 'right' });
    doc.text(`System: FRA Atlas v2.0`, pageWidth - margin - 5, yPos + 15, { align: 'right' });
    doc.text(`Status: Official`, pageWidth - margin - 5, yPos + 22, { align: 'right' });
    
    yPos += 35;
    
    // ========================================
    // EXECUTIVE SUMMARY SECTION
    // ========================================
    
    doc.setFontSize(14);
    doc.setTextColor(22, 101, 52);
    doc.setFont(undefined, 'bold');
    doc.text('📊 EXECUTIVE SUMMARY', margin, yPos);
    
    // Underline
    doc.setDrawColor(22, 101, 52);
    doc.setLineWidth(0.5);
    doc.line(margin, yPos + 2, margin + 60, yPos + 2);
    
    doc.setFont(undefined, 'normal');
    yPos += 10;
    
    // Calculate comprehensive statistics
    const totalClaims = claimsDatabase.length;
    const approved = claimsDatabase.filter(c => c.status === 'approved').length;
    const pending = claimsDatabase.filter(c => c.status === 'pending' || c.status === 'under-review').length;
    const rejected = claimsDatabase.filter(c => c.status === 'rejected').length;
    const approvalRate = totalClaims > 0 ? Math.round((approved / totalClaims) * 100) : 0;
    const rejectionRate = totalClaims > 0 ? Math.round((rejected / totalClaims) * 100) : 0;
    const pendingRate = totalClaims > 0 ? Math.round((pending / totalClaims) * 100) : 0;
    
    // Calculate land area
    const totalLandArea = claimsDatabase.reduce((sum, c) => sum + (c.land_area || 0), 0).toFixed(2);
    const approvedLandArea = claimsDatabase.filter(c => c.status === 'approved').reduce((sum, c) => sum + (c.land_area || 0), 0).toFixed(2);
    
    // Calculate by claim type
    const ifrClaims = claimsDatabase.filter(c => c.claim_type === 'IFR').length;
    const cfrClaims = claimsDatabase.filter(c => c.claim_type === 'CFR').length;
    const crClaims = claimsDatabase.filter(c => c.claim_type === 'CR').length;
    
    // Summary boxes
    doc.setFontSize(10);
    const boxWidth = 42;
    const boxHeight = 20;
    let boxX = 20;
    
    // Total Claims Box
    doc.setFillColor(240, 240, 240);
    doc.rect(boxX, yPos, boxWidth, boxHeight, 'F');
    doc.setTextColor(0);
    doc.text('Total Claims', boxX + 21, yPos + 8, { align: 'center' });
    doc.setFontSize(16);
    doc.setFont(undefined, 'bold');
    doc.text(String(totalClaims), boxX + 21, yPos + 16, { align: 'center' });
    doc.setFont(undefined, 'normal');
    doc.setFontSize(10);
    
    // Approved Box
    boxX += boxWidth + 5;
    doc.setFillColor(220, 252, 231);
    doc.rect(boxX, yPos, boxWidth, boxHeight, 'F');
    doc.setTextColor(22, 101, 52);
    doc.text('Approved', boxX + 21, yPos + 8, { align: 'center' });
    doc.setFontSize(16);
    doc.setFont(undefined, 'bold');
    doc.text(String(approved), boxX + 21, yPos + 16, { align: 'center' });
    doc.setFont(undefined, 'normal');
    doc.setFontSize(10);
    
    // Pending Box
    boxX += boxWidth + 5;
    doc.setFillColor(254, 243, 199);
    doc.rect(boxX, yPos, boxWidth, boxHeight, 'F');
    doc.setTextColor(180, 83, 9);
    doc.text('Pending', boxX + 21, yPos + 8, { align: 'center' });
    doc.setFontSize(16);
    doc.setFont(undefined, 'bold');
    doc.text(String(pending), boxX + 21, yPos + 16, { align: 'center' });
    doc.setFont(undefined, 'normal');
    doc.setFontSize(10);
    
    // Rejected Box
    boxX += boxWidth + 5;
    doc.setFillColor(254, 226, 226);
    doc.rect(boxX, yPos, boxWidth, boxHeight, 'F');
    doc.setTextColor(185, 28, 28);
    doc.text('Rejected', boxX + 21, yPos + 8, { align: 'center' });
    doc.setFontSize(16);
    doc.setFont(undefined, 'bold');
    doc.text(String(rejected), boxX + 21, yPos + 16, { align: 'center' });
    doc.setFont(undefined, 'normal');
    doc.setFontSize(10);
    
    yPos += boxHeight + 10;
    
    // Key Metrics
    doc.setTextColor(0);
    doc.text(`Approval Rate: ${approvalRate}%`, 20, yPos);
    doc.text(`Average Processing Time: 3.2 days`, 110, yPos);
    yPos += 12;
    
    // Add Claims Status by District Chart
    doc.setFontSize(14);
    doc.text('Claims Status by District', 20, yPos);
    yPos += 10;
    
    // Create chart data
    const districtData = {};
    claimsDatabase.forEach(claim => {
        if (!districtData[claim.district]) {
            districtData[claim.district] = { approved: 0, pending: 0, rejected: 0 };
        }
        if (claim.status === 'approved') districtData[claim.district].approved++;
        else if (claim.status === 'pending') districtData[claim.district].pending++;
        else if (claim.status === 'rejected') districtData[claim.district].rejected++;
    });
    
    // Draw bar chart
    const chartX = 20;
    const chartY = yPos;
    const chartWidth = 170;
    const chartHeight = 60;
    const barWidth = 15;
    const maxValue = Math.max(...Object.values(districtData).map(d => d.approved + d.pending + d.rejected));
    
    let xOffset = chartX;
    Object.entries(districtData).forEach(([district, data]) => {
        const approvedHeight = (data.approved / maxValue) * chartHeight;
        const pendingHeight = (data.pending / maxValue) * chartHeight;
        const rejectedHeight = (data.rejected / maxValue) * chartHeight;
        
        // Draw bars
        doc.setFillColor(16, 185, 129); // Green
        doc.rect(xOffset, chartY + chartHeight - approvedHeight, barWidth, approvedHeight, 'F');
        
        doc.setFillColor(245, 158, 11); // Orange
        doc.rect(xOffset + barWidth + 2, chartY + chartHeight - pendingHeight, barWidth, pendingHeight, 'F');
        
        doc.setFillColor(239, 68, 68); // Red
        doc.rect(xOffset + (barWidth + 2) * 2, chartY + chartHeight - rejectedHeight, barWidth, rejectedHeight, 'F');
        
        // District label
        doc.setFontSize(8);
        doc.text(district.substring(0, 6), xOffset + 20, chartY + chartHeight + 5);
        
        xOffset += 45;
    });
    
    // Legend
    yPos += chartHeight + 15;
    doc.setFillColor(16, 185, 129);
    doc.rect(20, yPos - 3, 5, 5, 'F');
    doc.text('Approved', 28, yPos);
    
    doc.setFillColor(245, 158, 11);
    doc.rect(60, yPos - 3, 5, 5, 'F');
    doc.text('Pending', 68, yPos);
    
    doc.setFillColor(239, 68, 68);
    doc.rect(100, yPos - 3, 5, 5, 'F');
    doc.text('Rejected', 108, yPos);
    
    yPos += 20;
    
    // Add new page for Charts
    doc.addPage();
    yPos = 20;
    
    // Page 2 Header
    doc.setFontSize(16);
    doc.setTextColor(22, 101, 52);
    doc.text('Performance Analytics', 105, yPos, { align: 'center' });
    yPos += 3;
    doc.setLineWidth(0.5);
    doc.line(20, yPos, 190, yPos);
    yPos += 12;
    
    // Try to capture actual Chart.js charts as images
    let chartsAdded = false;
    try {
        console.log('📊 Attempting to capture charts for PDF...');
        
        // Capture Claims Status by District Chart
        const claimsStatusCanvas = document.getElementById('claimsStatusChart');
        if (claimsStatusCanvas && claimsStatusCanvas.width > 0 && claimsStatusCanvas.height > 0) {
            console.log('✅ Found Claims Status Chart canvas');
            console.log(`   Canvas dimensions: ${claimsStatusCanvas.width}x${claimsStatusCanvas.height}`);
            const claimsStatusImage = claimsStatusCanvas.toDataURL('image/png', 1.0);
            doc.setFontSize(14);
            doc.setTextColor(0);
            doc.setFont(undefined, 'bold');
            doc.text('📊 Claims Status by District', 20, yPos);
            doc.setFont(undefined, 'normal');
            yPos += 8;
            doc.addImage(claimsStatusImage, 'PNG', 15, yPos, 180, 90);
            yPos += 100;
            console.log('✅ Claims Status Chart added to PDF');
            chartsAdded = true;
        } else {
            console.warn('⚠️ Claims Status Chart canvas not found or not rendered');
            console.warn(`   Canvas exists: ${!!claimsStatusCanvas}`);
            if (claimsStatusCanvas) {
                console.warn(`   Canvas dimensions: ${claimsStatusCanvas.width}x${claimsStatusCanvas.height}`);
            }
        }
        
        // Capture Scheme Distribution Chart
        const schemeDistCanvas = document.getElementById('schemeDistChart');
        if (schemeDistCanvas && schemeDistCanvas.width > 0 && schemeDistCanvas.height > 0) {
            console.log('✅ Found Scheme Distribution Chart canvas');
            console.log(`   Canvas dimensions: ${schemeDistCanvas.width}x${schemeDistCanvas.height}`);
            doc.setFontSize(14);
            doc.setFont(undefined, 'bold');
            doc.text('📊 Scheme Distribution', 20, yPos);
            doc.setFont(undefined, 'normal');
            yPos += 8;
            const schemeDistImage = schemeDistCanvas.toDataURL('image/png', 1.0);
            doc.addImage(schemeDistImage, 'PNG', 30, yPos, 150, 90);
            yPos += 100;
            console.log('✅ Scheme Distribution Chart added to PDF');
            chartsAdded = true;
        } else {
            console.warn('⚠️ Scheme Distribution Chart canvas not found or not rendered');
            console.warn(`   Canvas exists: ${!!schemeDistCanvas}`);
            if (schemeDistCanvas) {
                console.warn(`   Canvas dimensions: ${schemeDistCanvas.width}x${schemeDistCanvas.height}`);
            }
        }
        
        if (chartsAdded) {
            console.log('✅ Charts captured successfully');
        } else {
            console.warn('⚠️ No charts were captured, will use fallback rendering');
        }
    } catch (chartError) {
        console.error('❌ Could not capture charts:', chartError);
        // Continue with PDF generation without charts
    }
    
    // Only draw fallback charts if actual charts were not captured
    if (!chartsAdded) {
        // Chart 1: Claims Status by District (Bar Chart)
        doc.setFontSize(12);
        doc.setTextColor(0);
        doc.setFont(undefined, 'bold');
        doc.text('1. Claims Status by District', 20, yPos);
        doc.setFont(undefined, 'normal');
        yPos += 6;
    
    // Draw district bar chart
    const chart1X = 20;
    const chart1Y = yPos;
    const chart1Width = 170;
    const chart1Height = 45;
    const barWidth1 = 12;
    
    let xOffset1 = chart1X;
    Object.entries(districtData).slice(0, 4).forEach(([district, data]) => {
        const approvedHeight = (data.approved / maxValue) * chart1Height;
        const pendingHeight = (data.pending / maxValue) * chart1Height;
        const rejectedHeight = (data.rejected / maxValue) * chart1Height;
        
        // Draw bars
        doc.setFillColor(16, 185, 129);
        doc.rect(xOffset1, chart1Y + chart1Height - approvedHeight, barWidth1, approvedHeight, 'F');
        
        doc.setFillColor(245, 158, 11);
        doc.rect(xOffset1 + barWidth1 + 2, chart1Y + chart1Height - pendingHeight, barWidth1, pendingHeight, 'F');
        
        doc.setFillColor(239, 68, 68);
        doc.rect(xOffset1 + (barWidth1 + 2) * 2, chart1Y + chart1Height - rejectedHeight, barWidth1, rejectedHeight, 'F');
        
        // District label
        doc.setFontSize(7);
        doc.setTextColor(0);
        doc.text(district.substring(0, 7), xOffset1 + 15, chart1Y + chart1Height + 4);
        
        xOffset1 += 42;
    });
    
    // Legend for bar chart
    yPos += chart1Height + 10;
    doc.setFontSize(8);
    doc.setFillColor(16, 185, 129);
    doc.rect(20, yPos - 2, 4, 4, 'F');
    doc.setTextColor(0);
    doc.text('Approved', 26, yPos);
    
    doc.setFillColor(245, 158, 11);
    doc.rect(55, yPos - 2, 4, 4, 'F');
    doc.text('Pending', 61, yPos);
    
    doc.setFillColor(239, 68, 68);
    doc.rect(90, yPos - 2, 4, 4, 'F');
    doc.text('Rejected', 96, yPos);
    
    yPos += 12;
    
    // Chart 2: Scheme Distribution (Pie Chart)
    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.text('2. Scheme Distribution', 20, yPos);
    doc.setFont(undefined, 'normal');
    yPos += 6;
    
    // Calculate scheme distribution
    const schemeData = {};
    dssClaimsData.forEach(claim => {
        claim.recommendedSchemes.forEach(scheme => {
            schemeData[scheme] = (schemeData[scheme] || 0) + 1;
        });
    });
    
    // Draw pie chart (smaller for page 2)
    const centerX = 60;
    const centerY = yPos + 25;
    const radius = 22;
    const colors = [
        [16, 185, 129],   // Green
        [59, 130, 246],   // Blue
        [245, 158, 11],   // Orange
        [22, 163, 74]     // Dark Green
    ];
    
    let startAngle = 0;
    const total = Object.values(schemeData).reduce((a, b) => a + b, 0);
    
    Object.entries(schemeData).forEach(([scheme, count], index) => {
        const sliceAngle = (count / total) * 360;
        const endAngle = startAngle + sliceAngle;
        
        // Draw pie slice
        doc.setFillColor(...colors[index % colors.length]);
        drawPieSlice(doc, centerX, centerY, radius, startAngle, endAngle);
        
        startAngle = endAngle;
    });
    
    // Draw white circle in center for donut effect
    doc.setFillColor(255, 255, 255);
    doc.circle(centerX, centerY, radius * 0.6, 'F');
    
    // Legend for pie chart (compact)
    let legendY = yPos + 5;
    let legendX = 95;
    doc.setFontSize(8);
    Object.entries(schemeData).forEach(([scheme, count], index) => {
        doc.setFillColor(...colors[index % colors.length]);
        doc.rect(legendX, legendY - 2, 4, 4, 'F');
        doc.setTextColor(0);
        const schemeName = schemeDefinitions[scheme]?.name || scheme;
        doc.text(`${schemeName}: ${Math.round((count/total)*100)}%`, legendX + 6, legendY);
        legendY += 6;
    });
    
    yPos += 55;
    
    // Chart 3: Monthly Growth/Verification Trend (Line Chart)
    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.text('3. Monthly Verification Trend', 20, yPos);
    doc.setFont(undefined, 'normal');
    yPos += 6;
    
    // Monthly data (last 6 months)
    const monthlyData = [
        { month: 'Aug', verified: 420, total: 500 },
        { month: 'Sep', verified: 480, total: 550 },
        { month: 'Oct', verified: 520, total: 600 },
        { month: 'Nov', verified: 580, total: 650 },
        { month: 'Dec', verified: 640, total: 700 },
        { month: 'Jan', verified: 700, total: 750 }
    ];
    
    // Draw line chart
    const lineChartX = 20;
    const lineChartY = yPos;
    const lineChartWidth = 170;
    const lineChartHeight = 40;
    const maxMonthlyValue = 800;
    
    // Draw axes
    doc.setDrawColor(200);
    doc.setLineWidth(0.3);
    doc.line(lineChartX, lineChartY + lineChartHeight, lineChartX + lineChartWidth, lineChartY + lineChartHeight); // X-axis
    doc.line(lineChartX, lineChartY, lineChartX, lineChartY + lineChartHeight); // Y-axis
    
    // Draw grid lines
    for (let i = 0; i <= 4; i++) {
        const y = lineChartY + (lineChartHeight / 4) * i;
        doc.setDrawColor(230);
        doc.line(lineChartX, y, lineChartX + lineChartWidth, y);
    }
    
    // Plot verified line (green)
    doc.setDrawColor(16, 185, 129);
    doc.setLineWidth(1.5);
    const pointSpacing = lineChartWidth / (monthlyData.length - 1);
    
    for (let i = 0; i < monthlyData.length - 1; i++) {
        const x1 = lineChartX + (pointSpacing * i);
        const y1 = lineChartY + lineChartHeight - (monthlyData[i].verified / maxMonthlyValue) * lineChartHeight;
        const x2 = lineChartX + (pointSpacing * (i + 1));
        const y2 = lineChartY + lineChartHeight - (monthlyData[i + 1].verified / maxMonthlyValue) * lineChartHeight;
        
        doc.line(x1, y1, x2, y2);
        
        // Draw point
        doc.setFillColor(16, 185, 129);
        doc.circle(x1, y1, 1.5, 'F');
    }
    
    // Last point
    const lastX = lineChartX + (pointSpacing * (monthlyData.length - 1));
    const lastY = lineChartY + lineChartHeight - (monthlyData[monthlyData.length - 1].verified / maxMonthlyValue) * lineChartHeight;
    doc.circle(lastX, lastY, 1.5, 'F');
    
    // Month labels
    doc.setFontSize(7);
    doc.setTextColor(0);
    monthlyData.forEach((data, i) => {
        const x = lineChartX + (pointSpacing * i);
        doc.text(data.month, x - 3, lineChartY + lineChartHeight + 5);
    });
    
    // Y-axis labels
    doc.setFontSize(7);
    for (let i = 0; i <= 4; i++) {
        const value = Math.round((maxMonthlyValue / 4) * (4 - i));
        const y = lineChartY + (lineChartHeight / 4) * i;
        doc.text(String(value), lineChartX - 8, y + 1);
    }
    
    // Chart legend
    yPos += lineChartHeight + 10;
    doc.setFontSize(8);
    doc.setFillColor(16, 185, 129);
    doc.rect(20, yPos - 2, 4, 4, 'F');
    doc.setTextColor(0);
    doc.text('AI Verified Claims', 26, yPos);
    
    yPos += 10;
    } // End of fallback charts rendering
    
    // Footer
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 105, 285, { align: 'center' });
    doc.text('Ministry of Tribal Affairs - FRA Atlas & DSS', 105, 290, { align: 'center' });
    
    // Save PDF
    doc.save(`FRA_Report_${startDate}_${endDate}.pdf`);
}

// Helper function to draw pie slice
function drawPieSlice(doc, centerX, centerY, radius, startAngle, endAngle) {
    const startRad = (startAngle - 90) * Math.PI / 180;
    const endRad = (endAngle - 90) * Math.PI / 180;
    
    doc.moveTo(centerX, centerY);
    doc.lineTo(centerX + radius * Math.cos(startRad), centerY + radius * Math.sin(startRad));
    
    // Draw arc
    const steps = Math.ceil(Math.abs(endAngle - startAngle));
    for (let i = 0; i <= steps; i++) {
        const angle = startRad + (endRad - startRad) * (i / steps);
        doc.lineTo(centerX + radius * Math.cos(angle), centerY + radius * Math.sin(angle));
    }
    
    doc.lineTo(centerX, centerY);
    doc.fill();
}

// Download Excel Report Directly
async function downloadExcelDirect() {
    const startDate = document.getElementById('reportStartDate')?.value || '2025-01-01';
    const endDate = document.getElementById('reportEndDate')?.value || '2025-01-31';
    
    try {
        showLoader(true);
        showToast('Generating Excel report...', 'info');
        
        console.log(`📊 Downloading Excel report: ${startDate} to ${endDate}`);
        
        const response = await fetch(
            `${api.baseURL}/reports/export?format=excel&startDate=${startDate}&endDate=${endDate}`,
            { method: 'POST' }
        );
        
        console.log('Response status:', response.status);
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        
        const blob = await response.blob();
        console.log('Excel Blob size:', blob.size, 'bytes');
        
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `FRA_Report_${startDate}_${endDate}.xlsx`;
        document.body.appendChild(a);
        a.click();
        
        setTimeout(() => {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        }, 100);
        
        showToast('Excel downloaded! Check Downloads folder.', 'success');
        console.log('✅ Excel download complete!');
        
    } catch (error) {
        console.error('❌ Excel download error:', error);
        showToast(`Failed to download Excel: ${error.message}`, 'error');
    } finally {
        showLoader(false);
    }
}

// Legacy function - kept for compatibility
async function downloadReport() {
    // Use enhanced PDF if available, otherwise fallback
    if (typeof generateEnhancedPDF === 'function') {
        const startDate = document.getElementById('reportStartDate')?.value || '2025-01-01';
        const endDate = document.getElementById('reportEndDate')?.value || '2025-01-31';
        
        try {
            await generateEnhancedPDF(startDate, endDate);
            showToast('✅ Enhanced PDF report downloaded successfully!', 'success');
        } catch (error) {
            console.error('Enhanced PDF generation failed:', error);
            showToast('⚠️ Falling back to standard PDF...', 'warning');
            await downloadPDFDirect();
        }
    } else {
        await downloadPDFDirect();
    }
}

// Generate Comprehensive Report
async function generateComprehensiveReport() {
    const startDate = document.getElementById('reportStartDate')?.value || '2025-01-01';
    const endDate = document.getElementById('reportEndDate')?.value || '2025-01-31';
    
    try {
        showLoader(true);
        showToast('Generating comprehensive analytics...', 'info');
        
        const response = await fetch(
            `${api.baseURL}/reports/comprehensive?startDate=${startDate}&endDate=${endDate}`
        );
        
        const result = await response.json();
        
        if (result.success) {
            // Show comprehensive data in modal/alert
            const summary = result.data.summary;
            const message = `
📊 COMPREHENSIVE REPORT GENERATED

📈 Summary:
• Total Claims: ${summary.totalClaims}
• Approval Rate: ${summary.approvalRate}%
• Rejection Rate: ${summary.rejectionRate}%
• Avg Processing: ${summary.avgProcessingDays} days

🏆 Top Performing Districts:
${result.data.topPerformingDistricts.map((d, i) => 
    `${i + 1}. ${d.district} - ${d.approved} approved`
).join('\n')}

📊 Scheme Utilization:
${result.data.schemeUtilization.map(s => 
    `• ${s.name}: ${s.utilization}% (${s.beneficiaries} beneficiaries)`
).join('\n')}

Report Period: ${startDate} to ${endDate}
Generated: ${new Date().toLocaleString()}
            `;
            
            alert(message);
            showToast('Comprehensive report generated successfully!', 'success');
        } else {
            throw new Error('Failed to generate report');
        }
    } catch (error) {
        console.error('Error generating comprehensive report:', error);
        showToast('Failed to generate comprehensive report', 'error');
    } finally {
        showLoader(false);
    }
}

// Share Report via Email
async function shareReport() {
    const email = prompt('Enter email address to share report:', 'officer@mp.gov.in');
    if (!email) return;
    
    const format = prompt('Select format:\n1. PDF\n2. Excel\n\nEnter 1 or 2:', '1');
    if (!format) return;
    
    const formatType = format === '1' ? 'pdf' : 'excel';
    const startDate = document.getElementById('reportStartDate')?.value || '2025-01-01';
    const endDate = document.getElementById('reportEndDate')?.value || '2025-01-31';
    
    try {
        showLoader(true);
        showToast(`Sharing report to ${email}...`, 'info');
        
        const response = await fetch(`${api.baseURL}/reports/share`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                email, 
                format: formatType, 
                startDate, 
                endDate 
            })
        });
        
        const result = await response.json();
        
        if (result.success) {
            showToast(`Report prepared for ${email}!`, 'success');
            alert(`✅ Report Prepared!\n\nRecipient: ${email}\nFormat: ${formatType.toUpperCase()}\nPeriod: ${startDate} to ${endDate}\n\n📧 Email Status:\n${result.sent_at ? '✅ Email sent successfully!' : '⚠️ Email queued (configure SMTP in .env to send)'}\n\nCheck server console for details.`);
        } else {
            throw new Error('Failed to share report');
        }
    } catch (error) {
        console.error('Error sharing report:', error);
        showToast('Failed to share report. Please try again.', 'error');
    } finally {
        showLoader(false);
    }
}

// Schedule Weekly Report
async function scheduleReport() {
    const enabled = confirm('Enable weekly automated reports?\n\nReports will be sent every Sunday at 9:00 AM IST to designated officials.');
    
    if (!enabled) return;
    
    const email = prompt('Enter email address for weekly reports:', 'officer@mp.gov.in');
    if (!email) return;
    
    try {
        showLoader(true);
        showToast('Configuring weekly report schedule...', 'info');
        
        const response = await fetch(`${api.baseURL}/reports/schedule`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                enabled: true, 
                email 
            })
        });
        
        const result = await response.json();
        
        if (result.success) {
            showToast('Weekly reports scheduled successfully!', 'success');
            alert(`✅ Weekly Reports Scheduled!\n\n${result.message}\n\nRecipient: ${email}\nFrequency: ${result.schedule.frequency}\nDay: ${result.schedule.day}\nTime: ${result.schedule.time}\n\n⚠️ NOTE: Emails will be sent if SMTP is configured in server/.env\nCheck server console for email logs.`);
        } else {
            throw new Error('Failed to schedule report');
        }
    } catch (error) {
        console.error('Error scheduling report:', error);
        showToast('Failed to schedule weekly report', 'error');
    } finally {
        showLoader(false);
    }
}

// Add Leaflet Fullscreen control
L.Control.Fullscreen = L.Control.extend({
    onAdd: function (map) {
        const container = L.DomUtil.create('div', 'leaflet-control-fullscreen leaflet-bar leaflet-control');
        const button = L.DomUtil.create('a', 'leaflet-control-fullscreen-button leaflet-bar-part', container);
        button.href = '#';
        button.title = 'Fullscreen';
        button.innerHTML = '⛶';

        L.DomEvent.on(button, 'click', function (e) {
            L.DomEvent.preventDefault(e);
            if (map.getContainer().requestFullscreen) {
                map.getContainer().requestFullscreen();
            }
        });

        return container;
    }
});

// Sidebar toggle functions
function toggleSidebar() {
    sidebar.classList.toggle('open');
}

function closeSidebar() {
    sidebar.classList.remove('open');
}

// Handle window resize
function handleResize() {
    if (window.innerWidth > 768) {
        sidebar.classList.remove('open');
    }
}

// Smooth transitions for page content
function addPageTransition() {
    pageContent.style.transition = 'opacity 0.3s ease-in-out';
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    init();
    addPageTransition();

    // Re-initialize Lucide icons after dynamic content loads
    setTimeout(() => {
        lucide.createIcons();

        // Initialize dashboard if it's the current page
        if (currentPage === 'dashboard') {
            initializeDashboard();
        }
    }, 100);
    
    // Add keyboard shortcuts for quick actions
    document.addEventListener('keydown', (e) => {
        // Check if Ctrl (Windows/Linux) or Cmd (Mac) is pressed
        if (e.ctrlKey || e.metaKey) {
            switch(e.key.toLowerCase()) {
                case 'r':
                    e.preventDefault();
                    if (typeof generateDashboardReport === 'function') {
                        generateDashboardReport();
                    }
                    break;
                case 'e':
                    e.preventDefault();
                    if (typeof exportDashboardData === 'function') {
                        exportDashboardData();
                    }
                    break;
                case 'a':
                    e.preventDefault();
                    if (typeof viewDashboardAnalytics === 'function') {
                        viewDashboardAnalytics();
                    }
                    break;
            }
        }
    });
});

// Handle browser back/forward buttons
window.addEventListener('popstate', (e) => {
    const page = e.state?.page || 'dashboard';
    loadPage(page);

    // Update active nav link
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-page') === page) {
            link.classList.add('active');
        }
    });
});

// Update browser history when navigating
function updateHistory(page) {
    const url = `#${page}`;
    history.pushState({ page }, '', url);
}

// ===== BACKEND INTEGRATION =====

// Check backend connection
async function checkBackendConnection() {
    try {
        const response = await api.healthCheck();
        console.log('✅ Backend connected:', response);
        showAPIStatus(true);
        return true;
    } catch (error) {
        console.error('❌ Backend connection failed:', error);
        showAPIStatus(false);
        // Only show toast if backend is actually not running
        // Don't show if it's just a temporary network issue
        return false;
    }
}

// Show API connection status
function showAPIStatus(isOnline) {
    let statusElement = document.getElementById('apiStatus');

    if (!statusElement) {
        statusElement = document.createElement('div');
        statusElement.id = 'apiStatus';
        statusElement.className = 'api-status';
        document.body.appendChild(statusElement);
    }

    // Only show status indicator if backend is offline
    if (isOnline) {
        statusElement.style.display = 'none';
        console.log('✅ Backend connected successfully');
    } else {
        statusElement.style.display = 'flex';
        statusElement.className = 'api-status offline';
        statusElement.innerHTML = `
            <div class="api-status-dot"></div>
            <span>Using Demo Data</span>
        `;
        console.log('ℹ️ Backend offline - using demo data');
    }
}

// Load initial data from backend
async function loadInitialData() {
    try {
        showLoader(true);

        // Load claims data for dashboard
        await loadClaimsFromAPI();

        // Load feedback data
        await loadFeedbackFromAPI();

        // Load issues data
        await loadIssuesFromAPI();

        showLoader(false);
        console.log('✅ Data loaded successfully from backend');
    } catch (error) {
        showLoader(false);
        console.log('ℹ️ Using demo data for display');
        // Silently use demo data - no need to show warning toast
    }
}

// ===== CLAIMS API INTEGRATION =====

// Load claims from backend
async function loadClaimsFromAPI() {
    try {
        const response = await api.getClaims();

        if (response.success) {
            // Update global claims data
            claimsData = response.data.claims || [];

            // Update dashboard statistics
            updateDashboardStats(response.data.statistics);

            // Refresh claims table if visible
            if (currentPage === 'claims') {
                populateClaimsTable();
            }

            return response.data;
        }
    } catch (error) {
        handleAPIError(error);
        throw error;
    }
}

// Submit new claim to backend
async function submitClaimToAPI(formData, file) {
    try {
        showLoader(true);

        const response = await api.createClaim(formData, file);

        if (response.success) {
            showToast('Claim submitted successfully!', 'success');

            // Refresh claims data
            await loadClaimsFromAPI();

            // Close modal
            closeNewClaimForm();

            return response.data;
        }
    } catch (error) {
        handleAPIError(error);
        throw error;
    } finally {
        showLoader(false);
    }
}

// Update claim status via API
async function updateClaimStatusAPI(claimId, status, remarks) {
    try {
        showLoader(true);

        const response = await api.updateClaimStatus(claimId, {
            status: status,
            remarks: remarks
        });

        if (response.success) {
            showToast(`Claim ${status} successfully!`, 'success');

            // Refresh claims data
            await loadClaimsFromAPI();

            return response.data;
        }
    } catch (error) {
        handleAPIError(error);
        throw error;
    } finally {
        showLoader(false);
    }
}

// ===== DSS API INTEGRATION =====

// Get scheme recommendations from DSS
async function getDSSRecommendations(claimData) {
    try {
        showLoader(true);

        const response = await api.getSchemeRecommendations(claimData);

        if (response.success) {
            displayDSSRecommendations(response.data);
            showToast(`Found ${response.data.total_schemes_found} eligible schemes`, 'success');
            return response.data;
        }
    } catch (error) {
        handleAPIError(error);
        throw error;
    } finally {
        showLoader(false);
    }
}

// Display DSS recommendations in UI
function displayDSSRecommendations(recommendations) {
    const container = document.getElementById('dssRecommendations');
    if (!container) return;

    container.innerHTML = `
        <div class="dss-results">
            <div class="dss-header">
                <h3>🎯 Scheme Recommendations</h3>
                <div class="priority-badge priority-${recommendations.priority}">
                    ${recommendations.priority.toUpperCase()} Priority
                </div>
            </div>
            
            <div class="applicant-profile">
                <h4>Applicant Profile</h4>
                <div class="profile-grid">
                    <div class="profile-item">
                        <span class="label">Land Area:</span>
                        <span class="value">${recommendations.applicant_profile.land_area} hectares</span>
                    </div>
                    <div class="profile-item">
                        <span class="label">Location:</span>
                        <span class="value">${recommendations.applicant_profile.village}, ${recommendations.applicant_profile.district}</span>
                    </div>
                    <div class="profile-item">
                        <span class="label">Claim Type:</span>
                        <span class="value">${recommendations.applicant_profile.claim_type}</span>
                    </div>
                </div>
            </div>
            
            <div class="schemes-list">
                ${recommendations.schemes.map(scheme => `
                    <div class="scheme-card">
                        <div class="scheme-header">
                            <h4>${scheme.scheme_name}</h4>
                            <div class="eligibility-score">${scheme.eligibility_percentage}% Match</div>
                        </div>
                        <p class="scheme-description">${scheme.description}</p>
                        <div class="scheme-details">
                            <div class="detail-item">
                                <strong>Benefits:</strong> ${scheme.benefits}
                            </div>
                            <div class="detail-item">
                                <strong>Ministry:</strong> ${scheme.ministry}
                            </div>
                            <div class="detail-item">
                                <strong>Estimated Benefit:</strong> ${scheme.estimated_benefit}
                            </div>
                        </div>
                        <div class="scheme-actions">
                            <button class="btn primary" onclick="applyForScheme('${scheme.scheme_code}')">
                                Apply Now
                            </button>
                            <button class="btn secondary" onclick="viewSchemeDetails('${scheme.scheme_id}')">
                                View Details
                            </button>
                        </div>
                    </div>
                `).join('')}
            </div>
            
            <div class="next-steps">
                <h4>📋 Next Steps</h4>
                <ul>
                    ${recommendations.next_steps.map(step => `<li>${step}</li>`).join('')}
                </ul>
            </div>
        </div>
    `;
}

// ===== FEEDBACK API INTEGRATION =====

// Load feedback from backend
async function loadFeedbackFromAPI() {
    try {
        const response = await api.getFeedback();

        if (response.success) {
            feedbackData = response.data.feedback || [];

            // Update feedback display if visible
            if (currentPage === 'feedback') {
                populateFeedbackTable();
            }

            return response.data;
        }
    } catch (error) {
        handleAPIError(error);
        throw error;
    }
}

// Submit feedback to backend
async function submitFeedbackToAPI(feedbackData) {
    try {
        showLoader(true);

        const response = await api.submitFeedback(feedbackData);

        if (response.success) {
            showToast('Feedback submitted successfully!', 'success');

            // Refresh feedback data
            await loadFeedbackFromAPI();

            return response.data;
        }
    } catch (error) {
        handleAPIError(error);
        throw error;
    } finally {
        showLoader(false);
    }
}

// ===== ISSUES API INTEGRATION =====

// Load issues from backend
async function loadIssuesFromAPI() {
    try {
        const response = await api.getIssues();

        if (response.success) {
            issuesData = response.data.issues || [];

            // Update issues display if visible
            if (currentPage === 'issues') {
                populateIssuesTable();
            }

            return response.data;
        }
    } catch (error) {
        handleAPIError(error);
        throw error;
    }
}

// Submit issue to backend
async function submitIssueToAPI(issueData) {
    try {
        showLoader(true);

        const response = await api.reportIssue(issueData);

        if (response.success) {
            showToast('Issue reported successfully!', 'success');

            // Refresh issues data
            await loadIssuesFromAPI();

            return response.data;
        }
    } catch (error) {
        handleAPIError(error);
        throw error;
    } finally {
        showLoader(false);
    }
}

// ===== REPORTS API INTEGRATION =====

// Generate district report
async function generateDistrictReportAPI(districtId) {
    try {
        showLoader(true);

        const response = await api.generateDistrictReport(districtId);

        if (response.success) {
            showToast('District report generated successfully!', 'success');

            // Download the report
            if (response.data.download_url) {
                window.open(response.data.download_url, '_blank');
            }

            return response.data;
        }
    } catch (error) {
        handleAPIError(error);
        throw error;
    } finally {
        showLoader(false);
    }
}

// Generate custom report
async function generateCustomReportAPI(reportData) {
    try {
        showLoader(true);

        const response = await api.generateCustomReport(reportData);

        if (response.success) {
            showToast('Custom report generated successfully!', 'success');

            // Download the report
            if (response.data.download_url) {
                window.open(response.data.download_url, '_blank');
            }

            return response.data;
        }
    } catch (error) {
        handleAPIError(error);
        throw error;
    } finally {
        showLoader(false);
    }
}

// ===== ENHANCED FORM HANDLERS =====

// Enhanced new claim form submission
async function handleNewClaimSubmission(event) {
    event.preventDefault();

    // Validate Aadhaar first
    if (!validateAadhaarBeforeSubmit()) {
        return;
    }

    const form = event.target;
    const formData = new FormData(form);

    // Convert FormData to object
    const claimData = {};
    for (let [key, value] of formData.entries()) {
        if (key !== 'document') {
            claimData[key] = value;
        }
    }

    // Add Aadhaar verification data
    claimData.aadhaarVerified = aadhaarVerified;
    claimData.aadhaarData = verifiedAadhaarData;

    // Get file
    const file = formData.get('document');

    try {
        await submitClaimToAPI(claimData, file);
    } catch (error) {
        console.error('Claim submission failed:', error);
    }
}

// Enhanced feedback form submission
async function handleFeedbackSubmissionEnhanced(event) {
    event.preventDefault();

    const form = event.target;
    const formData = new FormData(form);
    const feedbackId = generateFeedbackId();

    // Create feedback object for local database
    const newFeedback = {
        id: feedbackId,
        claimId: formData.get('claimId') || 'N/A',
        userName: formData.get('name') || 'Anonymous',
        category: formData.get('category'),
        district: formData.get('district') || 'N/A',
        description: formData.get('description') || formData.get('message'),
        date: new Date().toISOString().split('T')[0],
        status: 'pending',
        attachment: formData.get('attachment')?.name || null,
        timeline: [
            {
                action: 'Submitted',
                by: formData.get('name') || 'Anonymous',
                date: new Date().toISOString().split('T')[0],
                notes: 'Feedback submitted'
            }
        ],
        response: ''
    };

    // Add to local database immediately
    feedbackDatabase.unshift(newFeedback);
    
    // Update UI
    updateFeedbackSummary();
    populateFeedbackTable();
    
    // Show success modal
    showFeedbackSuccessModal(feedbackId);

    // Also try to submit to API
    const feedbackData = {
        category: formData.get('category'),
        subject: formData.get('subject'),
        message: formData.get('message'),
        rating: parseInt(formData.get('rating')) || null,
        priority: formData.get('priority') || 'medium'
    };

    try {
        await submitFeedbackToAPI(feedbackData);
        form.reset();
    } catch (error) {
        console.error('Feedback API submission failed:', error);
        // Already added to local database, so still show success
    }
}

// Enhanced issue form submission
async function handleIssueSubmission(event) {
    event.preventDefault();

    const form = event.target;
    const formData = new FormData(form);

    const issueData = {
        category: formData.get('category'),
        title: formData.get('title'),
        description: formData.get('description'),
        priority: formData.get('priority') || 'medium'
    };

    try {
        await submitIssueToAPI(issueData);
        form.reset();
    } catch (error) {
        console.error('Issue submission failed:', error);
    }
}

// ===== DSS INTEGRATION FUNCTIONS =====

// Run DSS analysis on claim
async function runDSSAnalysis(claimId) {
    const claim = claimsData.find(c => c.id === claimId);
    if (!claim) {
        showToast('Claim not found', 'error');
        return;
    }

    const dssData = {
        claim_id: claim.id,
        land_area: claim.land_area,
        village: claim.village,
        district: claim.district,
        state: claim.state,
        claim_type: claim.claim_type,
        water_access: Math.random() > 0.5, // Mock data
        soil_condition: ['good', 'degraded', 'poor'][Math.floor(Math.random() * 3)],
        forest_cover: Math.floor(Math.random() * 100),
        tribal_area: true,
        employment_needed: Math.random() > 0.5
    };

    try {
        await getDSSRecommendations(dssData);
    } catch (error) {
        console.error('DSS analysis failed:', error);
    }
}

// Apply for scheme
function applyForScheme(schemeCode) {
    showToast(`Redirecting to ${schemeCode} application portal...`, 'info');
    // In real implementation, redirect to scheme portal
}

// View scheme details
function viewSchemeDetails(schemeId) {
    showToast(`Loading scheme details for ID: ${schemeId}`, 'info');
    // In real implementation, show detailed scheme information
}

// ===== UPDATE DASHBOARD WITH REAL DATA =====

// Update dashboard statistics with real data
function updateDashboardStats(stats) {
    if (!stats) return;

    // Update KPI cards
    const totalClaimsElement = document.querySelector('[data-stat="total-claims"]');
    if (totalClaimsElement) {
        totalClaimsElement.textContent = stats.total || 0;
    }

    const approvedClaimsElement = document.querySelector('[data-stat="approved-claims"]');
    if (approvedClaimsElement) {
        approvedClaimsElement.textContent = stats.approved || 0;
    }

    const pendingClaimsElement = document.querySelector('[data-stat="pending-claims"]');
    if (pendingClaimsElement) {
        pendingClaimsElement.textContent = stats.pending || 0;
    }

    const rejectedClaimsElement = document.querySelector('[data-stat="rejected-claims"]');
    if (rejectedClaimsElement) {
        rejectedClaimsElement.textContent = stats.rejected || 0;
    }
}

// Initialize enhanced application
document.addEventListener('DOMContentLoaded', async function () {
    // Initialize Lucide icons
    lucide.createIcons();

    // Check backend connection
    await checkBackendConnection();

    // Initialize the app
    init();

    // Load initial data from backend
    await loadInitialData();

    console.log('🚀 FRA Atlas Frontend-Backend Integration Complete!');
});

// ===== REAL-TIME NOTIFICATIONS & WEBSOCKET =====

// Socket.IO client setup
let socket = null;
let notifications = [];
let isNotificationsOpen = false;

// Initialize Socket.IO connection
function initializeSocket() {
    try {
        // Connect to Socket.IO server
        socket = io('http://localhost:5001', {
            transports: ['websocket', 'polling'],
            timeout: 5000,
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000
        });

        // Connection event handlers
        socket.on('connect', () => {
            console.log('🔌 Connected to real-time server');
            updateConnectionStatus('connected');

            // Authenticate user if available
            const user = appState.getState().user;
            if (user) {
                socket.emit('authenticate', { user });
            }
        });

        socket.on('disconnect', () => {
            console.log('🔌 Disconnected from real-time server');
            updateConnectionStatus('disconnected');
        });

        socket.on('connect_error', (error) => {
            console.error('🔌 Connection error:', error);
            updateConnectionStatus('disconnected');
        });

        socket.on('reconnect', (attemptNumber) => {
            console.log(`🔌 Reconnected after ${attemptNumber} attempts`);
            updateConnectionStatus('connected');
        });

        socket.on('reconnecting', (attemptNumber) => {
            console.log(`🔌 Reconnecting... attempt ${attemptNumber}`);
            updateConnectionStatus('connecting');
        });

        // Notification event handlers
        socket.on('newNotification', handleNewNotification);
        socket.on('initialNotifications', handleInitialNotifications);
        socket.on('allNotificationsMarkedRead', handleAllNotificationsMarkedRead);

        // Specific event handlers
        socket.on('claimUpdate', (data) => {
            showToastNotification('Claim Update', data.message, 'info', 'file-text');
            if (currentPage === 'claims') {
                loadClaimsFromAPI(); // Refresh claims data
            }
        });

        socket.on('newFeedback', (data) => {
            showToastNotification('New Feedback', data.message, 'info', 'message-circle');
            if (currentPage === 'feedback') {
                loadFeedbackFromAPI(); // Refresh feedback data
            }
        });

        socket.on('reportGenerated', (data) => {
            showToastNotification('Report Ready', data.message, 'success', 'download');
            if (currentPage === 'reports') {
                // Refresh reports data if needed
            }
        });

        socket.on('issueResolved', (data) => {
            showToastNotification('Issue Resolved', data.message, 'success', 'check-circle');
            if (currentPage === 'issues') {
                loadIssuesFromAPI(); // Refresh issues data
            }
        });

        socket.on('aiRecommendation', (data) => {
            showToastNotification('AI Recommendations', data.message, 'info', 'brain');
        });

        console.log('✅ Socket.IO client initialized');

    } catch (error) {
        console.error('❌ Failed to initialize Socket.IO:', error);
        updateConnectionStatus('disconnected');
    }
}

// Handle new notification
function handleNewNotification(notification) {
    console.log('📢 New notification received:', notification);

    // Add to notifications array
    notifications.unshift(notification);

    // Keep only last 50 notifications
    if (notifications.length > 50) {
        notifications = notifications.slice(0, 50);
    }

    // Update notification count
    updateNotificationCount();

    // Update notification list if dropdown is open
    if (isNotificationsOpen) {
        renderNotificationList();
    }

    // Show toast notification
    showToastNotification(
        notification.title,
        notification.message,
        notification.color || 'info',
        notification.icon || 'bell'
    );

    // Add bell animation
    const bell = document.querySelector('.notification-bell');
    if (bell) {
        bell.classList.add('has-notifications');
        setTimeout(() => bell.classList.remove('has-notifications'), 3000);
    }
}

// Handle initial notifications
function handleInitialNotifications(initialNotifications) {
    console.log('📋 Received initial notifications:', initialNotifications.length);
    notifications = initialNotifications || [];
    updateNotificationCount();

    if (isNotificationsOpen) {
        renderNotificationList();
    }
}

// Handle all notifications marked as read
function handleAllNotificationsMarkedRead() {
    notifications.forEach(notification => {
        notification.read = true;
    });
    updateNotificationCount();
    renderNotificationList();
}

// Update connection status indicator
function updateConnectionStatus(status) {
    let statusElement = document.getElementById('connectionStatus');

    if (!statusElement) {
        statusElement = document.createElement('div');
        statusElement.id = 'connectionStatus';
        statusElement.className = 'connection-status';
        document.body.appendChild(statusElement);
    }

    statusElement.className = `connection-status ${status}`;

    const statusText = {
        connected: 'Connected',
        disconnected: 'Disconnected',
        connecting: 'Connecting...'
    };

    statusElement.innerHTML = `
        <div class="connection-dot"></div>
        <span>${statusText[status] || 'Unknown'}</span>
    `;
}

// Toggle notifications dropdown
function toggleNotifications() {
    const dropdown = document.getElementById('notificationDropdown');
    isNotificationsOpen = !isNotificationsOpen;

    if (isNotificationsOpen) {
        dropdown.classList.add('show');
        renderNotificationList();

        // Close dropdown when clicking outside
        setTimeout(() => {
            document.addEventListener('click', closeNotificationsOnOutsideClick);
        }, 100);
    } else {
        dropdown.classList.remove('show');
        document.removeEventListener('click', closeNotificationsOnOutsideClick);
    }
}

// Close notifications when clicking outside
function closeNotificationsOnOutsideClick(event) {
    const notificationCenter = document.querySelector('.notification-center');
    if (!notificationCenter.contains(event.target)) {
        toggleNotifications();
    }
}

// Update notification count badge
function updateNotificationCount() {
    const badge = document.getElementById('notificationCount');
    const unreadCount = notifications.filter(n => !n.read).length;

    if (badge) {
        badge.textContent = unreadCount;
        badge.className = unreadCount === 0 ? 'notification-badge zero' : 'notification-badge';
    }
}

// Render notification list
function renderNotificationList() {
    const listElement = document.getElementById('notificationList');

    if (notifications.length === 0) {
        listElement.innerHTML = `
            <div class="no-notifications">
                <i data-lucide="bell-off"></i>
                <p>No new notifications</p>
            </div>
        `;
    } else {
        listElement.innerHTML = notifications.map(notification => `
            <div class="notification-item ${notification.read ? '' : 'unread'}" 
                 onclick="markNotificationRead('${notification.id}')">
                <div class="notification-icon ${notification.color || 'info'}">
                    <i data-lucide="${notification.icon || 'bell'}"></i>
                </div>
                <div class="notification-content">
                    <div class="notification-title">${notification.title}</div>
                    <div class="notification-message">${notification.message}</div>
                    <div class="notification-time">${formatNotificationTime(notification.timestamp)}</div>
                </div>
                ${notification.priority ? `<div class="notification-priority ${notification.priority}"></div>` : ''}
            </div>
        `).join('');
    }

    // Re-initialize Lucide icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

// Mark notification as read
function markNotificationRead(notificationId) {
    const notification = notifications.find(n => n.id === notificationId);
    if (notification && !notification.read) {
        notification.read = true;
        updateNotificationCount();
        renderNotificationList();

        // Emit to server
        if (socket) {
            socket.emit('markNotificationRead', notificationId);
        }
    }
}

// Mark all notifications as read
function markAllNotificationsRead() {
    notifications.forEach(notification => {
        notification.read = true;
    });

    updateNotificationCount();
    renderNotificationList();

    // Emit to server
    if (socket) {
        socket.emit('markAllNotificationsRead');
    }
}

// Format notification timestamp
function formatNotificationTime(timestamp) {
    if (!timestamp) return '';

    const now = new Date();
    const notificationTime = new Date(timestamp);
    const diffMs = now - notificationTime;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    return notificationTime.toLocaleDateString();
}

// Show toast notification
function showToastNotification(title, message, type = 'info', icon = 'bell') {
    // Create toast container if it doesn't exist
    let container = document.getElementById('toastContainer');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toastContainer';
        container.className = 'toast-container';
        document.body.appendChild(container);
    }

    // Create toast element
    const toast = document.createElement('div');
    toast.className = `toast-notification ${type}`;
    toast.innerHTML = `
        <div class="toast-icon">
            <i data-lucide="${icon}"></i>
        </div>
        <div class="toast-content">
            <div class="toast-title">${title}</div>
            <div class="toast-message">${message}</div>
        </div>
        <button class="toast-close" onclick="this.parentElement.remove()">
            <i data-lucide="x"></i>
        </button>
    `;

    // Add to container
    container.appendChild(toast);

    // Initialize Lucide icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // Show toast with animation
    setTimeout(() => toast.classList.add('show'), 100);

    // Auto-remove after 5 seconds
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            if (toast.parentElement) {
                toast.parentElement.removeChild(toast);
            }
        }, 300);
    }, 5000);
}

// Authenticate user with socket
function authenticateSocket(user) {
    if (socket && user) {
        socket.emit('authenticate', { user });
        console.log('👤 User authenticated with socket:', user.name);
    }
}

// Enhanced initialization with Socket.IO
document.addEventListener('DOMContentLoaded', async function () {
    // Initialize Lucide icons
    lucide.createIcons();

    // Check backend connection
    await checkBackendConnection();

    // Initialize Socket.IO
    initializeSocket();

    // Initialize the app
    init();

    // Load initial data from backend
    await loadInitialData();

    // Authenticate socket if user is available
    const user = appState.getState().user;
    if (user) {
        authenticateSocket(user);
    }

    console.log('🚀 FRA Atlas with Real-time Notifications Ready!');
});


// ===== GEO HIERARCHY DROPDOWN MANAGER =====

class GeoDropdownManager {
    constructor() {
        this.states = [];
        this.districts = [];
        this.villages = [];
        this.selectedState = null;
        this.selectedDistrict = null;
        this.selectedVillage = null;
        this.isLoading = false;
        
        // DOM elements
        this.stateSelect = document.getElementById('stateFilter');
        this.districtSelect = document.getElementById('districtFilter');
        this.villageSelect = document.getElementById('villageFilter');
        this.stateLoader = document.getElementById('stateLoader');
        this.districtLoader = document.getElementById('districtLoader');
        this.villageLoader = document.getElementById('villageLoader');
        this.clearBtn = document.getElementById('clearFiltersBtn');
        
        this.init();
    }
    
    async init() {
        console.log('🗺️ Initializing GeoDropdownManager...');
        
        // Set up event listeners
        this.stateSelect.addEventListener('change', (e) => this.handleStateChange(e.target.value));
        this.districtSelect.addEventListener('change', (e) => this.handleDistrictChange(e.target.value));
        this.villageSelect.addEventListener('change', (e) => this.handleVillageChange(e.target.value));
        this.clearBtn.addEventListener('click', () => this.clearFilters());
        
        // Load states on init
        await this.loadStates();
        
        // Restore from cache if available
        this.restoreFromCache();
    }
    
    async loadStates() {
        try {
            this.showLoader('state', true);
            console.log('📍 Loading states...');
            
            const response = await fetch(`${api.baseURL}/geo/states`);
            const result = await response.json();
            
            if (!result.success) {
                throw new Error('Failed to load states');
            }
            
            this.states = result.data;
            this.populateStateDropdown();
            
            console.log(`✅ Loaded ${this.states.length} states`);
            
        } catch (error) {
            console.error('❌ Error loading states:', error);
            showToast('Failed to load states', 'error');
        } finally {
            this.showLoader('state', false);
        }
    }
    
    async loadDistricts(stateCode) {
        try {
            this.showLoader('district', true);
            this.districtSelect.disabled = true;
            console.log(`📍 Loading districts for ${stateCode}...`);
            
            const response = await fetch(`${api.baseURL}/geo/districts/${stateCode}`);
            const result = await response.json();
            
            if (!result.success) {
                throw new Error(result.error?.message || 'Failed to load districts');
            }
            
            this.districts = result.data;
            this.populateDistrictDropdown();
            
            console.log(`✅ Loaded ${this.districts.length} districts`);
            
        } catch (error) {
            console.error('❌ Error loading districts:', error);
            showToast('Failed to load districts', 'error');
            this.districts = [];
            this.populateDistrictDropdown();
        } finally {
            this.showLoader('district', false);
            this.districtSelect.disabled = false;
        }
    }
    
    async loadVillages(districtCode) {
        try {
            this.showLoader('village', true);
            this.villageSelect.disabled = true;
            console.log(`📍 Loading villages for ${districtCode}...`);
            
            const response = await fetch(`${api.baseURL}/geo/villages/${districtCode}`);
            const result = await response.json();
            
            if (!result.success) {
                throw new Error(result.error?.message || 'Failed to load villages');
            }
            
            this.villages = result.data;
            this.populateVillageDropdown();
            
            console.log(`✅ Loaded ${this.villages.length} villages`);
            
        } catch (error) {
            console.error('❌ Error loading villages:', error);
            showToast('Failed to load villages', 'error');
            this.villages = [];
            this.populateVillageDropdown();
        } finally {
            this.showLoader('village', false);
            this.villageSelect.disabled = false;
        }
    }
    
    populateStateDropdown() {
        this.stateSelect.innerHTML = '<option value="">Select State...</option>';
        
        this.states.forEach(state => {
            const option = document.createElement('option');
            option.value = state.state_code;
            option.textContent = `${state.state_name} (${state.total_districts} districts)`;
            this.stateSelect.appendChild(option);
        });
        
        this.stateSelect.disabled = false;
        this.animateDropdown(this.stateSelect);
    }
    
    populateDistrictDropdown() {
        this.districtSelect.innerHTML = '<option value="">Select District...</option>';
        
        if (this.districts.length === 0) {
            this.districtSelect.innerHTML = '<option value="">No districts available</option>';
            this.districtSelect.disabled = true;
            return;
        }
        
        this.districts.forEach(district => {
            const option = document.createElement('option');
            option.value = district.district_code;
            option.textContent = `${district.district_name} (${district.total_villages} villages)`;
            this.districtSelect.appendChild(option);
        });
        
        this.districtSelect.disabled = false;
        this.animateDropdown(this.districtSelect);
    }
    
    populateVillageDropdown() {
        this.villageSelect.innerHTML = '<option value="">Select Village...</option>';
        
        if (this.villages.length === 0) {
            this.villageSelect.innerHTML = '<option value="">No villages available</option>';
            this.villageSelect.disabled = true;
            return;
        }
        
        this.villages.forEach(village => {
            const option = document.createElement('option');
            option.value = village.village_code;
            option.textContent = `${village.village_name} (Pop: ${village.population.toLocaleString()})`;
            this.villageSelect.appendChild(option);
        });
        
        this.villageSelect.disabled = false;
        this.animateDropdown(this.villageSelect);
    }
    
    async handleStateChange(stateCode) {
        if (!stateCode) {
            this.selectedState = null;
            this.resetDistricts();
            this.resetVillages();
            this.clearBtn.style.display = 'none';
            return;
        }
        
        this.selectedState = this.states.find(s => s.state_code === stateCode);
        console.log('🗺️ State selected:', this.selectedState?.state_name);
        
        // Reset dependent dropdowns
        this.resetDistricts();
        this.resetVillages();
        
        // Load districts
        await this.loadDistricts(stateCode);
        
        // Save to cache
        this.saveToCache();
        
        // Show clear button
        this.clearBtn.style.display = 'inline-flex';
        
        // Success animation
        this.stateSelect.classList.add('success');
        setTimeout(() => this.stateSelect.classList.remove('success'), 500);
    }
    
    async handleDistrictChange(districtCode) {
        if (!districtCode) {
            this.selectedDistrict = null;
            this.resetVillages();
            return;
        }
        
        this.selectedDistrict = this.districts.find(d => d.district_code === districtCode);
        console.log('🗺️ District selected:', this.selectedDistrict?.district_name);
        
        // Reset villages
        this.resetVillages();
        
        // Load villages
        await this.loadVillages(districtCode);
        
        // Save to cache
        this.saveToCache();
        
        // Success animation
        this.districtSelect.classList.add('success');
        setTimeout(() => this.districtSelect.classList.remove('success'), 500);
    }
    
    async handleVillageChange(villageCode) {
        if (!villageCode) {
            this.selectedVillage = null;
            return;
        }
        
        this.selectedVillage = this.villages.find(v => v.village_code === villageCode);
        console.log('🗺️ Village selected:', this.selectedVillage?.village_name);
        
        // Save to cache
        this.saveToCache();
        
        // Success animation
        this.villageSelect.classList.add('success');
        setTimeout(() => this.villageSelect.classList.remove('success'), 500);
        
        // Trigger map update
        if (this.selectedVillage && window.mapIntegration) {
            await window.mapIntegration.zoomToVillage(this.selectedVillage);
            await window.mapIntegration.updateClaimsForVillage(this.selectedVillage.village_code);
        }
        
        showToast(`📍 Viewing ${this.selectedVillage.village_name}`, 'success');
    }
    
    resetDistricts() {
        this.districts = [];
        this.selectedDistrict = null;
        this.districtSelect.innerHTML = '<option value="">Select District...</option>';
        this.districtSelect.disabled = true;
    }
    
    resetVillages() {
        this.villages = [];
        this.selectedVillage = null;
        this.villageSelect.innerHTML = '<option value="">Select Village...</option>';
        this.villageSelect.disabled = true;
    }
    
    clearFilters() {
        this.stateSelect.value = '';
        this.selectedState = null;
        this.resetDistricts();
        this.resetVillages();
        this.clearBtn.style.display = 'none';
        
        // Clear cache
        localStorage.removeItem('fra_geo_filters');
        
        // Reset map
        if (window.mapIntegration) {
            window.mapIntegration.resetMap();
        }
        
        showToast('Filters cleared', 'info');
    }
    
    showLoader(type, show) {
        const loader = type === 'state' ? this.stateLoader : 
                      type === 'district' ? this.districtLoader : 
                      this.villageLoader;
        
        if (loader) {
            loader.style.display = show ? 'block' : 'none';
        }
    }
    
    animateDropdown(select) {
        select.style.opacity = '0';
        select.style.transform = 'translateY(-5px)';
        
        setTimeout(() => {
            select.style.transition = 'all 0.2s ease';
            select.style.opacity = '1';
            select.style.transform = 'translateY(0)';
        }, 10);
    }
    
    saveToCache() {
        const cache = {
            selectedState: this.selectedState?.state_code || null,
            selectedDistrict: this.selectedDistrict?.district_code || null,
            selectedVillage: this.selectedVillage?.village_code || null,
            timestamp: Date.now()
        };
        
        localStorage.setItem('fra_geo_filters', JSON.stringify(cache));
        console.log('💾 Filters saved to cache');
    }
    
    async restoreFromCache() {
        try {
            const cached = localStorage.getItem('fra_geo_filters');
            if (!cached) {
                console.log('ℹ️ No cached filters found');
                return;
            }
            
            const cache = JSON.parse(cached);
            console.log('📦 Cache data:', cache);
            
            // Check if cache is less than 24 hours old
            const age = Date.now() - cache.timestamp;
            if (age > 24 * 60 * 60 * 1000) {
                console.log('⏰ Cache expired, clearing...');
                localStorage.removeItem('fra_geo_filters');
                return;
            }
            
            console.log('🔄 Restoring filters from cache...');
            
            // Restore state
            if (cache.selectedState) {
                console.log(`🗺️ Restoring state: ${cache.selectedState}`);
                
                // Validate that the state exists in our loaded states
                const stateExists = this.states.find(s => s.state_code === cache.selectedState);
                if (!stateExists) {
                    console.warn(`⚠️ Cached state ${cache.selectedState} not found in loaded states`);
                    localStorage.removeItem('fra_geo_filters');
                    return;
                }
                
                this.stateSelect.value = cache.selectedState;
                await this.handleStateChange(cache.selectedState);
                
                // Restore district
                if (cache.selectedDistrict) {
                    console.log(`🗺️ Restoring district: ${cache.selectedDistrict}`);
                    this.districtSelect.value = cache.selectedDistrict;
                    await this.handleDistrictChange(cache.selectedDistrict);
                    
                    // Restore village
                    if (cache.selectedVillage) {
                        console.log(`🗺️ Restoring village: ${cache.selectedVillage}`);
                        this.villageSelect.value = cache.selectedVillage;
                        await this.handleVillageChange(cache.selectedVillage);
                    }
                }
            }
            
            console.log('✅ Filters restored from cache');
            
        } catch (error) {
            console.error('❌ Error restoring from cache:', error);
            console.error('Error details:', error.message, error.stack);
            localStorage.removeItem('fra_geo_filters');
        }
    }
}

// Initialize GeoDropdownManager when map page is active
let geoDropdownManager = null;

function initGeoDropdowns() {
    if (!geoDropdownManager && document.getElementById('stateFilter')) {
        geoDropdownManager = new GeoDropdownManager();
    }
}

// Note: initGeoDropdowns() is now called from showMapPage()
// to ensure it runs when the map page is actually visible


// ===== GEO SEARCH FUNCTIONALITY =====

class GeoSearchBar {
    constructor() {
        this.searchInput = document.getElementById('geoSearch');
        this.suggestionsContainer = document.getElementById('geoSearchSuggestions');
        this.debounceTimer = null;
        this.currentResults = [];
        this.selectedIndex = -1;
        
        this.init();
    }
    
    init() {
        if (!this.searchInput) return;
        
        console.log('🔍 Initializing GeoSearchBar...');
        
        // Event listeners
        this.searchInput.addEventListener('input', (e) => this.handleSearch(e.target.value));
        this.searchInput.addEventListener('keydown', (e) => this.handleKeyboard(e));
        this.searchInput.addEventListener('focus', () => {
            if (this.currentResults.length > 0) {
                this.suggestionsContainer.style.display = 'block';
            }
        });
        
        // Close suggestions when clicking outside
        document.addEventListener('click', (e) => {
            if (!this.searchInput.contains(e.target) && !this.suggestionsContainer.contains(e.target)) {
                this.hideSuggestions();
            }
        });
    }
    
    handleSearch(query) {
        // Clear previous timer
        clearTimeout(this.debounceTimer);
        
        // Hide suggestions if query is too short
        if (query.trim().length < 2) {
            this.hideSuggestions();
            return;
        }
        
        // Debounce search (300ms)
        this.debounceTimer = setTimeout(async () => {
            await this.performSearch(query);
        }, 300);
    }
    
    async performSearch(query) {
        try {
            console.log(`🔍 Searching for: ${query}`);
            
            const response = await fetch(`${api.baseURL}/geo/search?q=${encodeURIComponent(query)}`);
            const result = await response.json();
            
            if (!result.success) {
                throw new Error('Search failed');
            }
            
            this.currentResults = result.data;
            this.displaySuggestions();
            
        } catch (error) {
            console.error('❌ Search error:', error);
            this.showNoResults();
        }
    }
    
    displaySuggestions() {
        if (this.currentResults.length === 0) {
            this.showNoResults();
            return;
        }
        
        this.suggestionsContainer.innerHTML = '';
        this.selectedIndex = -1;
        
        this.currentResults.forEach((result, index) => {
            const item = document.createElement('div');
            item.className = 'search-suggestion-item';
            item.dataset.index = index;
            
            let pathText = '';
            if (result.type === 'village') {
                // Get district and state names
                const district = result.district_code;
                pathText = `<div class="suggestion-path">${district}</div>`;
            } else if (result.type === 'district') {
                pathText = `<div class="suggestion-path">${result.state_code}</div>`;
            }
            
            item.innerHTML = `
                <span class="suggestion-type ${result.type}">${result.type}</span>
                <span class="suggestion-name">${this.highlightMatch(result[`${result.type}_name`], this.searchInput.value)}</span>
                ${pathText}
            `;
            
            item.addEventListener('click', () => this.selectResult(result));
            item.addEventListener('mouseenter', () => {
                this.selectedIndex = index;
                this.updateSelection();
            });
            
            this.suggestionsContainer.appendChild(item);
        });
        
        this.suggestionsContainer.style.display = 'block';
    }
    
    showNoResults() {
        this.suggestionsContainer.innerHTML = '<div class="search-no-results">No results found</div>';
        this.suggestionsContainer.style.display = 'block';
    }
    
    hideSuggestions() {
        this.suggestionsContainer.style.display = 'none';
        this.selectedIndex = -1;
    }
    
    highlightMatch(text, query) {
        const regex = new RegExp(`(${query})`, 'gi');
        return text.replace(regex, '<strong>$1</strong>');
    }
    
    handleKeyboard(e) {
        if (!this.currentResults.length) return;
        
        switch(e.key) {
            case 'ArrowDown':
                e.preventDefault();
                this.selectedIndex = Math.min(this.selectedIndex + 1, this.currentResults.length - 1);
                this.updateSelection();
                break;
                
            case 'ArrowUp':
                e.preventDefault();
                this.selectedIndex = Math.max(this.selectedIndex - 1, -1);
                this.updateSelection();
                break;
                
            case 'Enter':
                e.preventDefault();
                if (this.selectedIndex >= 0) {
                    this.selectResult(this.currentResults[this.selectedIndex]);
                }
                break;
                
            case 'Escape':
                this.hideSuggestions();
                this.searchInput.blur();
                break;
        }
    }
    
    updateSelection() {
        const items = this.suggestionsContainer.querySelectorAll('.search-suggestion-item');
        items.forEach((item, index) => {
            if (index === this.selectedIndex) {
                item.classList.add('active');
                item.scrollIntoView({ block: 'nearest' });
            } else {
                item.classList.remove('active');
            }
        });
    }
    
    async selectResult(result) {
        console.log('📍 Selected:', result);
        
        this.hideSuggestions();
        this.searchInput.value = '';
        
        // Auto-populate dropdowns based on result type
        if (result.type === 'state') {
            if (geoDropdownManager) {
                geoDropdownManager.stateSelect.value = result.state_code;
                await geoDropdownManager.handleStateChange(result.state_code);
            }
        } else if (result.type === 'district') {
            if (geoDropdownManager) {
                // First select state
                geoDropdownManager.stateSelect.value = result.state_code;
                await geoDropdownManager.handleStateChange(result.state_code);
                
                // Then select district
                setTimeout(async () => {
                    geoDropdownManager.districtSelect.value = result.district_code;
                    await geoDropdownManager.handleDistrictChange(result.district_code);
                }, 500);
            }
        } else if (result.type === 'village') {
            if (geoDropdownManager) {
                // Extract state code from district code (e.g., JH-RN -> JH)
                const stateCode = result.district_code.split('-')[0];
                
                // Select state
                geoDropdownManager.stateSelect.value = stateCode;
                await geoDropdownManager.handleStateChange(stateCode);
                
                // Select district
                setTimeout(async () => {
                    geoDropdownManager.districtSelect.value = result.district_code;
                    await geoDropdownManager.handleDistrictChange(result.district_code);
                    
                    // Select village
                    setTimeout(async () => {
                        geoDropdownManager.villageSelect.value = result.village_code;
                        await geoDropdownManager.handleVillageChange(result.village_code);
                    }, 500);
                }, 500);
            }
            
            // Zoom map to village
            if (window.mapIntegration && result.geometry) {
                setTimeout(() => {
                    window.mapIntegration.zoomToGeometry(result.geometry);
                }, 1500);
            }
        }
        
        showToast(`📍 Navigating to ${result[`${result.type}_name`]}`, 'success');
    }
}

// Initialize GeoSearchBar
let geoSearchBar = null;

function initGeoSearch() {
    if (!geoSearchBar && document.getElementById('geoSearch')) {
        geoSearchBar = new GeoSearchBar();
    }
}

// Note: initGeoSearch() is now called from showMapPage()
// to ensure it runs when the map page is actually visible


// ===== MAP INTEGRATION CLASS =====

class MapIntegration {
    constructor(mapInstance) {
        this.map = mapInstance;
        this.claimLayer = null;
        this.boundaryLayer = null;
        this.currentBounds = null;
        this.bhuvanLayer = null;
        
        console.log('🗺️ MapIntegration initialized');
    }
    
    /**
     * Initialize Bhuvan satellite layer from ISRO
     */
    addBhuvanLayer() {
        try {
            // Remove existing base layers if needed
            this.map.eachLayer((layer) => {
                if (layer instanceof L.TileLayer) {
                    this.map.removeLayer(layer);
                }
            });
            
            // Add ISRO Bhuvan WMS layer
            this.bhuvanLayer = L.tileLayer.wms('https://bhuvan-vec1.nrsc.gov.in/bhuvan/wms', {
                layers: 'india3',
                format: 'image/png',
                transparent: true,
                attribution: '© ISRO Bhuvan'
            });
            
            this.bhuvanLayer.addTo(this.map);
            console.log('✅ Bhuvan satellite layer added');
            
        } catch (error) {
            console.error('❌ Error adding Bhuvan layer:', error);
            // Fallback to satellite layer
            this.addFallbackLayer();
        }
    }
    
    /**
     * Fallback to default satellite layer if Bhuvan fails
     */
    addFallbackLayer() {
        const satelliteLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
            attribution: 'Tiles © Esri'
        });
        satelliteLayer.addTo(this.map);
        console.log('✅ Fallback satellite layer added');
    }
    
    /**
     * Zoom map to village boundary with animation
     * @param {Object} village - Village object with geometry
     */
    async zoomToVillage(village) {
        try {
            if (!village || !village.geometry) {
                console.warn('⚠️ No geometry data for village');
                return;
            }
            
            const geometry = village.geometry;
            
            // Parse geometry and calculate bounds
            const bounds = this.calculateBounds(geometry);
            
            if (bounds) {
                // Animate zoom to bounds
                this.map.flyToBounds(bounds, {
                    padding: [50, 50],
                    duration: 1.0,
                    easeLinearity: 0.25
                });
                
                this.currentBounds = bounds;
                
                // Highlight the boundary
                this.highlightBoundary(geometry);
                
                console.log(`✅ Zoomed to village: ${village.village_name || 'Unknown'}`);
            }
            
        } catch (error) {
            console.error('❌ Error zooming to village:', error);
            showToast('Failed to zoom to village', 'error');
        }
    }
    
    /**
     * Zoom to any GeoJSON geometry
     * @param {Object} geometry - GeoJSON geometry object
     */
    zoomToGeometry(geometry) {
        try {
            const bounds = this.calculateBounds(geometry);
            
            if (bounds) {
                this.map.flyToBounds(bounds, {
                    padding: [50, 50],
                    duration: 1.0
                });
                
                this.highlightBoundary(geometry);
            }
            
        } catch (error) {
            console.error('❌ Error zooming to geometry:', error);
        }
    }
    
    /**
     * Calculate bounds from GeoJSON geometry
     * @param {Object} geometry - GeoJSON geometry object
     * @returns {L.LatLngBounds|null}
     */
    calculateBounds(geometry) {
        try {
            if (!geometry || !geometry.coordinates) {
                return null;
            }
            
            let coords = [];
            
            // Handle different geometry types
            if (geometry.type === 'Polygon') {
                coords = geometry.coordinates[0];
            } else if (geometry.type === 'MultiPolygon') {
                coords = geometry.coordinates[0][0];
            } else if (geometry.type === 'Point') {
                const [lng, lat] = geometry.coordinates;
                return L.latLngBounds([[lat, lng], [lat, lng]]);
            }
            
            // Convert coordinates to LatLng array
            const latLngs = coords.map(coord => [coord[1], coord[0]]);
            
            return L.latLngBounds(latLngs);
            
        } catch (error) {
            console.error('❌ Error calculating bounds:', error);
            return null;
        }
    }
    
    /**
     * Highlight village boundary on map
     * @param {Object} geometry - GeoJSON geometry object
     */
    highlightBoundary(geometry) {
        try {
            // Clear previous boundary
            if (this.boundaryLayer) {
                this.map.removeLayer(this.boundaryLayer);
            }
            
            // Create GeoJSON layer for boundary
            this.boundaryLayer = L.geoJSON({
                type: 'Feature',
                geometry: geometry
            }, {
                style: {
                    color: '#3b82f6',
                    weight: 3,
                    opacity: 0.8,
                    fillColor: '#3b82f6',
                    fillOpacity: 0.1,
                    dashArray: '5, 5'
                }
            });
            
            this.boundaryLayer.addTo(this.map);
            
            console.log('✅ Boundary highlighted');
            
        } catch (error) {
            console.error('❌ Error highlighting boundary:', error);
        }
    }
    
    /**
     * Update claim layer with filtered claims for selected village
     * @param {String} villageCode - Village code to filter claims
     */
    async updateClaimsForVillage(villageCode) {
        try {
            console.log(`🔄 Updating claims for village: ${villageCode}`);
            
            // Fetch claims for this village
            const response = await fetch(`${api.baseURL}/claims?village=${villageCode}`);
            const result = await response.json();
            
            if (result.success && result.data) {
                this.updateClaimLayer(result.data);
                
                // Update statistics
                this.updateStatistics(result.data);
                
                console.log(`✅ Updated ${result.data.length} claims`);
            } else {
                // No claims found
                this.clearClaimLayer();
                this.showNoDataMessage();
            }
            
        } catch (error) {
            console.error('❌ Error updating claims:', error);
            showToast('Failed to load claims data', 'error');
        }
    }
    
    /**
     * Update claim layer with new claim data
     * @param {Array} claims - Array of claim objects
     */
    updateClaimLayer(claims) {
        try {
            // Clear existing claim layer
            this.clearClaimLayer();
            
            if (!claims || claims.length === 0) {
                return;
            }
            
            // Create new claim layer
            const claimFeatures = claims.map(claim => ({
                type: 'Feature',
                properties: claim,
                geometry: claim.geometry || {
                    type: 'Point',
                    coordinates: [claim.longitude || 85.3803, claim.latitude || 23.6345]
                }
            }));
            
            this.claimLayer = L.geoJSON({
                type: 'FeatureCollection',
                features: claimFeatures
            }, {
                pointToLayer: (feature, latlng) => {
                    return L.circleMarker(latlng, {
                        radius: 8,
                        fillColor: this.getClaimStatusColor(feature.properties.status),
                        color: '#ffffff',
                        weight: 2,
                        opacity: 1,
                        fillOpacity: 0.8
                    });
                },
                style: (feature) => ({
                    color: this.getClaimStatusColor(feature.properties.status),
                    weight: 3,
                    opacity: 0.9,
                    fillColor: this.getClaimStatusColor(feature.properties.status),
                    fillOpacity: 0.6
                }),
                onEachFeature: (feature, layer) => {
                    const props = feature.properties;
                    
                    const popupContent = `
                        <div class="claim-popup">
                            <h4>📋 ${props.claimant || props.holderName || 'Unknown'}</h4>
                            <p><strong>Claim ID:</strong> ${props.claim_id || props.claimId}</p>
                            <p><strong>Status:</strong> <span class="status-${(props.status || '').toLowerCase()}">${props.status}</span></p>
                            <p><strong>Type:</strong> ${props.claim_type || props.type}</p>
                            <p><strong>Area:</strong> ${props.area_ha || props.area} ha</p>
                            ${props.ai_score ? `<p><strong>AI Score:</strong> ${props.ai_score}%</p>` : ''}
                        </div>
                    `;
                    
                    layer.bindPopup(popupContent);
                }
            });
            
            this.claimLayer.addTo(this.map);
            
            console.log(`✅ Claim layer updated with ${claims.length} claims`);
            
        } catch (error) {
            console.error('❌ Error updating claim layer:', error);
        }
    }
    
    /**
     * Get color based on claim status
     * @param {String} status - Claim status
     * @returns {String} - Hex color code
     */
    getClaimStatusColor(status) {
        const statusLower = (status || '').toLowerCase();
        const colors = {
            'approved': '#10b981',
            'pending': '#f59e0b',
            'rejected': '#ef4444',
            'under review': '#3b82f6'
        };
        return colors[statusLower] || '#6b7280';
    }
    
    /**
     * Clear claim layer from map
     */
    clearClaimLayer() {
        if (this.claimLayer) {
            this.map.removeLayer(this.claimLayer);
            this.claimLayer = null;
        }
    }
    
    /**
     * Clear all dynamic layers (claims and boundaries)
     */
    clearLayers() {
        this.clearClaimLayer();
        
        if (this.boundaryLayer) {
            this.map.removeLayer(this.boundaryLayer);
            this.boundaryLayer = null;
        }
        
        this.currentBounds = null;
        
        console.log('✅ All dynamic layers cleared');
    }
    
    /**
     * Reset map to default view
     */
    resetMap() {
        this.clearLayers();
        
        // Reset to default view (Jharkhand)
        this.map.setView([23.6345, 85.3803], 7);
        
        console.log('✅ Map reset to default view');
    }
    
    /**
     * Update statistics display with claim data
     * @param {Array} claims - Array of claim objects
     */
    updateStatistics(claims) {
        try {
            if (!claims || claims.length === 0) {
                return;
            }
            
            // Calculate statistics
            const totalClaims = claims.length;
            const approvedClaims = claims.filter(c => (c.status || '').toLowerCase() === 'approved').length;
            const approvalRate = totalClaims > 0 ? ((approvedClaims / totalClaims) * 100).toFixed(1) : 0;
            
            // Calculate average AI score
            const aiScores = claims.filter(c => c.ai_score || c.aiScore).map(c => c.ai_score || c.aiScore);
            const avgAiScore = aiScores.length > 0 
                ? (aiScores.reduce((a, b) => a + b, 0) / aiScores.length).toFixed(1)
                : 0;
            
            // Update DOM elements
            const totalClaimsEl = document.getElementById('totalClaims');
            const approvalRateEl = document.getElementById('approvalRate');
            const avgAiScoreEl = document.getElementById('avgAiScore');
            
            if (totalClaimsEl) totalClaimsEl.textContent = totalClaims;
            if (approvalRateEl) approvalRateEl.textContent = `${approvalRate}%`;
            if (avgAiScoreEl) avgAiScoreEl.textContent = `${avgAiScore}%`;
            
            console.log(`✅ Statistics updated: ${totalClaims} claims, ${approvalRate}% approval`);
            
        } catch (error) {
            console.error('❌ Error updating statistics:', error);
        }
    }
    
    /**
     * Show "no data available" message
     */
    showNoDataMessage() {
        // Update statistics to show zeros
        const totalClaimsEl = document.getElementById('totalClaims');
        const approvalRateEl = document.getElementById('approvalRate');
        const avgAiScoreEl = document.getElementById('avgAiScore');
        
        if (totalClaimsEl) totalClaimsEl.textContent = '0';
        if (approvalRateEl) approvalRateEl.textContent = '0%';
        if (avgAiScoreEl) avgAiScoreEl.textContent = '0%';
        
        showToast('No claims found for this village', 'info');
    }
}

// Initialize MapIntegration when map is ready
function initMapIntegration() {
    if (window.map && !window.mapIntegration) {
        window.mapIntegration = new MapIntegration(window.map);
        console.log('✅ MapIntegration initialized and attached to window');
    }
}


// ===== DRAW CLAIM MANAGER CLASS =====

class DrawClaimManager {
    constructor(mapInstance) {
        this.map = mapInstance;
        this.drawControl = null;
        this.drawnItems = new L.FeatureGroup();
        this.drawnLayer = null;
        this.drawnCoords = null;
        this.calculatedArea = 0;
        this.isDrawing = false;
        this.currentUser = this.getCurrentUser();
        
        // Add drawn items layer to map
        this.map.addLayer(this.drawnItems);
        
        console.log('🎨 DrawClaimManager initialized');
        
        // Check if user has permission to draw
        if (this.hasDrawPermission()) {
            this.initializeDrawControl();
        } else {
            console.log('⚠️ User does not have permission to draw claims');
        }
    }
    
    /**
     * Get current user from localStorage or session
     * @returns {Object} User object with role
     */
    getCurrentUser() {
        // Try to get user from localStorage
        const userStr = localStorage.getItem('user');
        if (userStr) {
            try {
                return JSON.parse(userStr);
            } catch (e) {
                console.error('Error parsing user data:', e);
            }
        }
        
        // Try to get from sessionStorage
        const sessionUserStr = sessionStorage.getItem('user');
        if (sessionUserStr) {
            try {
                return JSON.parse(sessionUserStr);
            } catch (e) {
                console.error('Error parsing session user data:', e);
            }
        }
        
        // Default to null if no user found
        return null;
    }
    
    /**
     * Check if current user has permission to draw claims
     * @returns {Boolean}
     */
    hasDrawPermission() {
        // FOR DEMO/DEVELOPMENT: Always return true
        // In production, check user roles
        return true;
        
        /* PRODUCTION CODE (commented out for demo):
        if (!this.currentUser || !this.currentUser.role) {
            return false;
        }
        
        const allowedRoles = ['district', 'state', 'admin'];
        return allowedRoles.includes(this.currentUser.role.toLowerCase());
        */
    }
    
    /**
     * Initialize Leaflet.draw control with polygon-only mode
     */
    initializeDrawControl() {
        try {
            // Create draw control
            this.drawControl = new L.Control.Draw({
                draw: {
                    polygon: {
                        allowIntersection: false,
                        showArea: true,
                        shapeOptions: {
                            color: '#f59e0b',
                            weight: 3,
                            fillOpacity: 0.3
                        },
                        drawError: {
                            color: '#ef4444',
                            message: '<strong>Error:</strong> Shape edges cannot cross!'
                        }
                    },
                    polyline: false,
                    rectangle: false,
                    circle: false,
                    marker: false,
                    circlemarker: false
                },
                edit: {
                    featureGroup: this.drawnItems,
                    remove: true,
                    edit: true
                }
            });
            
            // Add draw control to map
            this.map.addControl(this.drawControl);
            
            // Set up event handlers
            this.setupEventHandlers();
            
            console.log('✅ Draw control initialized');
            
        } catch (error) {
            console.error('❌ Error initializing draw control:', error);
            showToast('Failed to initialize drawing tool', 'error');
        }
    }
    
    /**
     * Set up event handlers for drawing events
     */
    setupEventHandlers() {
        // Handle draw created event
        this.map.on(L.Draw.Event.CREATED, (e) => {
            this.handleDrawCreated(e);
        });
        
        // Handle draw start event
        this.map.on(L.Draw.Event.DRAWSTART, () => {
            this.isDrawing = true;
            console.log('🎨 Drawing started');
        });
        
        // Handle draw stop event
        this.map.on(L.Draw.Event.DRAWSTOP, () => {
            this.isDrawing = false;
            console.log('🎨 Drawing stopped');
        });
        
        // Handle edit event
        this.map.on(L.Draw.Event.EDITED, (e) => {
            const layers = e.layers;
            layers.eachLayer((layer) => {
                this.updateAreaForLayer(layer);
            });
        });
        
        // Handle delete event
        this.map.on(L.Draw.Event.DELETED, (e) => {
            console.log('🗑️ Layer deleted');
            this.clearDrawing();
        });
    }
    
    /**
     * Handle polygon draw completed event
     * @param {Object} event - Leaflet draw event
     */
    async handleDrawCreated(event) {
        try {
            const layer = event.layer;
            const type = event.layerType;
            
            console.log(`✅ ${type} drawn`);
            
            // Store layer and coordinates
            this.drawnLayer = layer;
            this.drawnCoords = layer.getLatLngs();
            
            // Add layer to drawn items
            this.drawnItems.addLayer(layer);
            
            // Calculate area
            this.calculatedArea = this.calculateArea(this.drawnCoords);
            
            console.log(`📏 Calculated area: ${this.calculatedArea.toFixed(2)} hectares`);
            
            // Show claim form modal
            setTimeout(() => {
                this.showClaimForm();
            }, 300);
            
        } catch (error) {
            console.error('❌ Error handling draw created:', error);
            showToast('Error processing drawn polygon', 'error');
        }
    }
    
    /**
     * Calculate area of polygon in hectares using Turf.js
     * @param {Array} coordinates - Array of LatLng coordinates
     * @returns {Number} Area in hectares
     */
    calculateArea(coordinates) {
        try {
            // Convert Leaflet LatLng to GeoJSON coordinates [lng, lat]
            const geoJsonCoords = coordinates[0].map(coord => [coord.lng, coord.lat]);
            
            // Close the polygon if not already closed
            if (geoJsonCoords[0][0] !== geoJsonCoords[geoJsonCoords.length - 1][0] ||
                geoJsonCoords[0][1] !== geoJsonCoords[geoJsonCoords.length - 1][1]) {
                geoJsonCoords.push(geoJsonCoords[0]);
            }
            
            // Create Turf polygon
            const polygon = turf.polygon([geoJsonCoords]);
            
            // Calculate area in square meters
            const areaInSquareMeters = turf.area(polygon);
            
            // Convert to hectares (1 hectare = 10,000 square meters)
            const areaInHectares = areaInSquareMeters / 10000;
            
            return areaInHectares;
            
        } catch (error) {
            console.error('❌ Error calculating area:', error);
            return 0;
        }
    }
    
    /**
     * Update area calculation for edited layer
     * @param {L.Layer} layer - Edited layer
     */
    updateAreaForLayer(layer) {
        if (layer instanceof L.Polygon) {
            const coords = layer.getLatLngs();
            this.calculatedArea = this.calculateArea(coords);
            console.log(`📏 Updated area: ${this.calculatedArea.toFixed(2)} hectares`);
        }
    }
    
    /**
     * Show claim form modal with pre-filled area
     */
    async showClaimForm() {
        try {
            console.log('📋 Opening claim form...');
            console.log('📏 Calculated area:', this.calculatedArea);
            
            // Calculate center point of polygon for lat/lng
            const center = this.getPolygonCenter();
            console.log('📍 Polygon center:', center);
            
            // Show modal first
            const modal = document.getElementById('claimFormModal');
            if (modal) {
                modal.style.display = 'block';
                modal.classList.add('show');
            }
            
            // Wait for modal to be fully rendered
            await new Promise(resolve => setTimeout(resolve, 200));
            
            // FORCE SET VALUES - Direct approach
            console.log('🔧 Force setting values...');
            
            // Area
            const areaInput = document.getElementById('areaInput');
            if (areaInput) {
                const areaValue = this.calculatedArea.toFixed(2);
                areaInput.value = areaValue;
                areaInput.defaultValue = areaValue;
                console.log('✅ Area set to:', areaValue);
                console.log('   Input value:', areaInput.value);
                console.log('   Input element:', areaInput);
            } else {
                console.error('❌ Area input NOT FOUND!');
            }
            
            // Latitude
            const latitudeInput = document.getElementById('latitudeInput');
            if (latitudeInput && center) {
                const latValue = center.lat.toFixed(6);
                latitudeInput.value = latValue;
                latitudeInput.defaultValue = latValue;
                console.log('✅ Latitude set to:', latValue);
                console.log('   Input value:', latitudeInput.value);
            } else {
                console.error('❌ Latitude input NOT FOUND or no center!');
            }
            
            // Longitude
            const longitudeInput = document.getElementById('longitudeInput');
            if (longitudeInput && center) {
                const lngValue = center.lng.toFixed(6);
                longitudeInput.value = lngValue;
                longitudeInput.defaultValue = lngValue;
                console.log('✅ Longitude set to:', lngValue);
                console.log('   Input value:', longitudeInput.value);
            } else {
                console.error('❌ Longitude input NOT FOUND or no center!');
            }
            
            // State - Set default first
            const stateInput = document.getElementById('stateInput');
            if (stateInput) {
                stateInput.value = 'Madhya Pradesh';
                stateInput.defaultValue = 'Madhya Pradesh';
                console.log('✅ State set to: Madhya Pradesh');
                console.log('   Input value:', stateInput.value);
            } else {
                console.error('❌ State input NOT FOUND!');
            }
            
            // District - Set default first
            const districtInput = document.getElementById('districtInput');
            if (districtInput) {
                districtInput.value = 'Balaghat';
                districtInput.defaultValue = 'Balaghat';
                console.log('✅ District set to: Balaghat');
                console.log('   Input value:', districtInput.value);
            } else {
                console.error('❌ District input NOT FOUND!');
            }
            
            // Village - Set default first
            const villageInput = document.getElementById('villageInput');
            if (villageInput) {
                villageInput.value = 'Khairlanji';
                villageInput.defaultValue = 'Khairlanji';
                console.log('✅ Village set to: Khairlanji');
                console.log('   Input value:', villageInput.value);
            } else {
                console.error('❌ Village input NOT FOUND!');
            }
            
            // Show area info
            const areaInfo = document.getElementById('areaInfo');
            if (areaInfo) {
                areaInfo.textContent = `Calculated from drawn polygon`;
            }
            
            // Try reverse geocoding (but don't wait for it)
            this.autoFillLocationData(center).catch(err => {
                console.warn('Geocoding failed, using defaults:', err);
            });
            
            // Check for area warnings
            this.checkAreaWarnings();
            
            // Village dropdown removed - not needed anymore
            
            // Initialize character counter
            this.initializeCharCounter();
            
            // Focus on first input
            setTimeout(() => {
                document.getElementById('claimantName')?.focus();
            }, 100);
            
            // Final verification
            console.log('📊 FINAL VERIFICATION:');
            console.log('  Area input value:', document.getElementById('areaInput')?.value);
            console.log('  Latitude input value:', document.getElementById('latitudeInput')?.value);
            console.log('  Longitude input value:', document.getElementById('longitudeInput')?.value);
            console.log('  State input value:', document.getElementById('stateInput')?.value);
            console.log('  District input value:', document.getElementById('districtInput')?.value);
            console.log('  Village input value:', document.getElementById('villageInput')?.value);
            
            console.log('✅ Claim form opened with values');
            
        } catch (error) {
            console.error('❌ Error showing claim form:', error);
            console.error('Error stack:', error.stack);
            showToast('Failed to open claim form', 'error');
        }
    }
    
    /**
     * Get center point of drawn polygon
     * @returns {Object} Center coordinates {lat, lng}
     */
    getPolygonCenter() {
        try {
            if (!this.drawnLayer) return null;
            
            const bounds = this.drawnLayer.getBounds();
            const center = bounds.getCenter();
            
            return center;
        } catch (error) {
            console.error('❌ Error getting polygon center:', error);
            return null;
        }
    }
    
    /**
     * Auto-fill location data using reverse geocoding
     * @param {Object} center - Center coordinates {lat, lng}
     */
    async autoFillLocationData(center) {
        try {
            if (!center) {
                console.warn('⚠️ No center, keeping default values');
                return;
            }
            
            console.log('🌍 Trying reverse geocoding for:', center);
            
            // Try Nominatim reverse geocoding (OpenStreetMap)
            const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${center.lat}&lon=${center.lng}&zoom=10&addressdetails=1`;
            
            const response = await fetch(url, {
                headers: {
                    'User-Agent': 'FRA-Atlas-App'
                }
            });
            
            if (response.ok) {
                const data = await response.json();
                const address = data.address || {};
                
                // Update state if we got better data
                const stateInput = document.getElementById('stateInput');
                if (stateInput && address.state) {
                    const state = address.state;
                    stateInput.value = state;
                    stateInput.defaultValue = state;
                    console.log('🔄 State updated from geocoding:', state);
                }
                
                // Update district if we got better data
                const districtInput = document.getElementById('districtInput');
                if (districtInput && (address.county || address.district)) {
                    const district = address.county || address.district;
                    districtInput.value = district;
                    districtInput.defaultValue = district;
                    console.log('🔄 District updated from geocoding:', district);
                }
                
                // Update village if we got data
                const villageInput = document.getElementById('villageInput');
                if (villageInput && (address.village || address.town || address.suburb)) {
                    const village = address.village || address.town || address.suburb;
                    villageInput.value = village;
                    villageInput.defaultValue = village;
                    console.log('🔄 Village updated from geocoding:', village);
                }
            } else {
                console.log('ℹ️ Geocoding not available, using defaults');
            }
            
        } catch (error) {
            console.log('ℹ️ Geocoding error, using defaults:', error.message);
        }
    }
    
    /**
     * Set default location data when reverse geocoding fails
     */
    setDefaultLocationData() {
        console.log('🔄 Setting default location data...');
        
        const stateInput = document.getElementById('stateInput');
        if (stateInput) {
            if (!stateInput.value) {
                stateInput.value = 'Madhya Pradesh'; // Default state
                stateInput.setAttribute('value', 'Madhya Pradesh');
                console.log('✅ Default state set: Madhya Pradesh', 'Current value:', stateInput.value);
            }
        } else {
            console.error('❌ State input not found!');
        }
        
        const districtInput = document.getElementById('districtInput');
        if (districtInput) {
            if (!districtInput.value) {
                districtInput.value = 'Balaghat'; // Default district
                districtInput.setAttribute('value', 'Balaghat');
                console.log('✅ Default district set: Balaghat', 'Current value:', districtInput.value);
            }
        } else {
            console.error('❌ District input not found!');
        }
    }
    
    /**
     * Check for area warnings and display them
     */
    checkAreaWarnings() {
        const areaWarning = document.getElementById('areaWarning');
        if (!areaWarning) return;
        
        const area = this.calculatedArea;
        
        if (area < 0.1) {
            areaWarning.textContent = '⚠️ Area is too small for FRA claim (minimum 0.1 hectares). Claim will be flagged for manual review.';
            areaWarning.classList.add('show');
        } else if (area > 10) {
            areaWarning.textContent = '⚠️ Area exceeds typical FRA claim size (maximum 10 hectares). Claim will be flagged for manual review.';
            areaWarning.classList.add('show');
        } else {
            areaWarning.classList.remove('show');
        }
    }
    
    /**
     * Load villages for form dropdown
     */
    async loadVillagesForForm() {
        try {
            const villageSelect = document.getElementById('villageSelect');
            if (!villageSelect) return;
            
            // Show loading state
            villageSelect.innerHTML = '<option value="">Loading villages...</option>';
            villageSelect.disabled = true;
            
            // Try to fetch villages from API
            try {
                const response = await fetch(`${api.baseURL}/geo/villages`);
                const result = await response.json();
                
                if (result.success && result.data && result.data.length > 0) {
                    // Clear loading option
                    villageSelect.innerHTML = '<option value="">Select Village</option>';
                    
                    // Add villages to dropdown
                    result.data.forEach(village => {
                        const option = document.createElement('option');
                        option.value = village.village_code || village.village_name;
                        option.textContent = `${village.village_name}, ${village.district_name || ''}`;
                        option.dataset.district = village.district_name || '';
                        option.dataset.state = village.state_name || '';
                        villageSelect.appendChild(option);
                    });
                    
                    villageSelect.disabled = false;
                    console.log(`✅ Loaded ${result.data.length} villages from API`);
                    return;
                }
            } catch (apiError) {
                console.warn('⚠️ API not available, using fallback villages');
            }
            
            // Fallback: Use hardcoded villages if API fails
            const fallbackVillages = [
                { name: 'Berasia', district: 'Bhopal', state: 'Madhya Pradesh' },
                { name: 'Kolar', district: 'Bhopal', state: 'Madhya Pradesh' },
                { name: 'Ashta', district: 'Sehore', state: 'Madhya Pradesh' },
                { name: 'Bichhiya', district: 'Mandla', state: 'Madhya Pradesh' },
                { name: 'Samnapur', district: 'Dindori', state: 'Madhya Pradesh' },
                { name: 'Athner', district: 'Betul', state: 'Madhya Pradesh' },
                { name: 'Jharia', district: 'Dhanbad', state: 'Jharkhand' },
                { name: 'Koderma', district: 'Koderma', state: 'Jharkhand' },
                { name: 'Hazaribagh', district: 'Hazaribagh', state: 'Jharkhand' }
            ];
            
            villageSelect.innerHTML = '<option value="">Select Village</option>';
            fallbackVillages.forEach(village => {
                const option = document.createElement('option');
                option.value = village.name;
                option.textContent = `${village.name}, ${village.district}`;
                option.dataset.district = village.district;
                option.dataset.state = village.state;
                villageSelect.appendChild(option);
            });
            
            villageSelect.disabled = false;
            console.log(`✅ Loaded ${fallbackVillages.length} fallback villages`);
            
        } catch (error) {
            console.error('❌ Error loading villages:', error);
            const villageSelect = document.getElementById('villageSelect');
            if (villageSelect) {
                villageSelect.innerHTML = '<option value="">Error loading villages</option>';
            }
            showToast('Failed to load villages. Please try again.', 'error');
        }
    }
    
    /**
     * Initialize character counter for notes field
     */
    initializeCharCounter() {
        const notesField = document.getElementById('claimNotes');
        const charCount = document.getElementById('notesCharCount');
        
        if (notesField && charCount) {
            notesField.addEventListener('input', () => {
                const length = notesField.value.length;
                charCount.textContent = `${length} / 500`;
                
                if (length > 450) {
                    charCount.style.color = '#ef4444';
                } else if (length > 400) {
                    charCount.style.color = '#f59e0b';
                } else {
                    charCount.style.color = '#6b7280';
                }
            });
        }
    }
    
    /**
     * Enable drawing mode
     */
    enableDrawing() {
        // FOR DEMO/DEVELOPMENT: Skip permission checks
        // In production, uncomment the checks below
        
        /* PRODUCTION CODE (commented out for demo):
        if (!this.hasDrawPermission()) {
            showToast('You do not have permission to create claims', 'error');
            return;
        }
        
        if (!this.currentUser) {
            showToast('Please log in to create claims', 'error');
            return;
        }
        */
        
        // Clear any existing drawings
        this.clearDrawing();
        
        // Show instruction
        showToast('Click on map to draw polygon boundary. Double-click to finish.', 'info');
        
        // Activate polygon drawing tool programmatically
        new L.Draw.Polygon(this.map, this.drawControl.options.draw.polygon).enable();
        
        console.log('🎨 Drawing mode enabled (demo mode - no auth required)');
    }
    
    /**
     * Clear current drawing
     */
    clearDrawing() {
        if (this.drawnLayer) {
            this.drawnItems.removeLayer(this.drawnLayer);
            this.drawnLayer = null;
        }
        
        this.drawnCoords = null;
        this.calculatedArea = 0;
        this.isDrawing = false;
        
        // Reset draw button state
        if (typeof resetDrawButton === 'function') {
            resetDrawButton();
        }
        
        console.log('🧹 Drawing cleared');
    }
    
    /**
     * Get GeoJSON geometry from drawn polygon
     * @returns {Object} GeoJSON geometry object
     */
    getGeometry() {
        if (!this.drawnLayer) {
            return null;
        }
        
        const geoJson = this.drawnLayer.toGeoJSON();
        return geoJson.geometry;
    }
}

// Initialize DrawClaimManager when map is ready
function initDrawClaimManager() {
    if (window.map && !window.drawClaimManager) {
        window.drawClaimManager = new DrawClaimManager(window.map);
        console.log('✅ DrawClaimManager initialized and attached to window');
    }
}


// ===== CLAIM FORM FUNCTIONS =====

/**
 * Handle document upload
 * @param {Event} event - File input change event
 */
function handleDocumentUpload(event) {
    const file = event.target.files[0];
    const documentInfo = document.getElementById('documentInfo');
    const documentSuccess = document.getElementById('documentSuccess');
    
    if (!file) return;
    
    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
        documentInfo.textContent = '❌ File too large! Maximum size is 5MB';
        documentInfo.style.color = '#ef4444';
        event.target.value = ''; // Clear the input
        return;
    }
    
    // Validate file type
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png', 
                          'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(file.type)) {
        documentInfo.textContent = '❌ Invalid file type! Use PDF, JPG, PNG, or DOC';
        documentInfo.style.color = '#ef4444';
        event.target.value = ''; // Clear the input
        return;
    }
    
    // Show success message
    documentSuccess.textContent = `✅ ${file.name} (${(file.size / 1024).toFixed(2)} KB)`;
    documentSuccess.style.display = 'block';
    documentInfo.style.color = '#3b82f6';
    documentInfo.textContent = 'Supported: PDF, JPG, PNG, DOC (Max 5MB)';
    
    console.log('📄 Document uploaded:', file.name, file.size, 'bytes');
}

/**
 * Close claim form modal
 */
function closeClaimForm() {
    const modal = document.getElementById('claimFormModal');
    if (modal) {
        modal.style.display = 'none';
        modal.classList.remove('show');
    }
    
    // Clear form
    const form = document.getElementById('claimForm');
    if (form) {
        form.reset();
    }
    
    // Clear error messages
    document.querySelectorAll('.error-message').forEach(el => el.classList.remove('show'));
    document.querySelectorAll('.warning-message').forEach(el => el.classList.remove('show'));
    
    // Clear document upload messages
    const documentSuccess = document.getElementById('documentSuccess');
    if (documentSuccess) {
        documentSuccess.style.display = 'none';
        documentSuccess.textContent = '';
    }
    
    // Clear drawing if user cancels
    if (window.drawClaimManager) {
        window.drawClaimManager.clearDrawing();
    }
    
    // Reset draw button
    resetDrawButton();
    
    console.log('📋 Claim form closed');
}

/**
 * Validate claim form
 * @param {FormData} formData - Form data to validate
 * @returns {Object} Validation result with errors array
 */
function validateClaimForm(formData) {
    const errors = [];
    
    // Validate claimant name
    const claimantName = formData.get('claimant_name');
    if (!claimantName || claimantName.trim().length < 3) {
        errors.push({
            field: 'claimantName',
            message: 'Claimant name must be at least 3 characters'
        });
    }
    
    // Validate claim type
    const claimType = formData.get('claim_type');
    if (!claimType) {
        errors.push({
            field: 'claimType',
            message: 'Please select a claim type'
        });
    }
    
    // Village validation removed - not required anymore
    
    // Validate area
    const area = parseFloat(formData.get('area_ha'));
    if (isNaN(area) || area <= 0) {
        errors.push({
            field: 'area',
            message: 'Invalid area value'
        });
    }
    
    return {
        isValid: errors.length === 0,
        errors: errors
    };
}

/**
 * Display validation errors
 * @param {Array} errors - Array of error objects
 */
function displayValidationErrors(errors) {
    // Clear previous errors
    document.querySelectorAll('.error-message').forEach(el => {
        el.classList.remove('show');
        el.textContent = '';
    });
    
    // Display new errors
    errors.forEach(error => {
        const errorEl = document.getElementById(`${error.field}Error`);
        if (errorEl) {
            errorEl.textContent = error.message;
            errorEl.classList.add('show');
        }
    });
    
    // Focus on first error field
    if (errors.length > 0) {
        const firstErrorField = document.getElementById(errors[0].field);
        if (firstErrorField) {
            firstErrorField.focus();
        }
    }
}

/**
 * Handle claim form submission
 * @param {Event} event - Form submit event
 */
async function handleClaimFormSubmit(event) {
    event.preventDefault();
    
    try {
        console.log('📤 Submitting claim form...');
        
        // Get form data
        const form = event.target;
        const formData = new FormData(form);
        
        // Validate form
        const validation = validateClaimForm(formData);
        if (!validation.isValid) {
            displayValidationErrors(validation.errors);
            showToast('Please fix the errors in the form', 'error');
            return;
        }
        
        // Clear validation errors
        document.querySelectorAll('.error-message').forEach(el => el.classList.remove('show'));
        
        // Disable submit button
        const submitBtn = document.getElementById('submitClaimBtn');
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i data-lucide="loader"></i> Submitting...';
        }
        
        // Get geometry from drawn polygon
        const geometry = window.drawClaimManager?.getGeometry();
        if (!geometry) {
            throw new Error('No polygon geometry found');
        }
        
        // Get uploaded document if any
        const documentFile = formData.get('document');
        let documentName = null;
        if (documentFile && documentFile.size > 0) {
            documentName = documentFile.name;
            console.log('📄 Document attached:', documentName);
        }
        
        // Prepare claim data
        const claimData = {
            claimant_name: formData.get('claimant_name'),
            claim_type: formData.get('claim_type'),
            state: formData.get('state'),
            district: formData.get('district'),
            village: formData.get('village'),
            area_ha: parseFloat(formData.get('area_ha')),
            latitude: parseFloat(formData.get('latitude')),
            longitude: parseFloat(formData.get('longitude')),
            linked_scheme: formData.get('linked_scheme') || null,
            notes: formData.get('notes') || null,
            document: documentName,
            geometry: geometry,
            aadhaarNumber: formData.get('aadhaar_number'),
            mobileNumber: formData.get('mobile_number'),
            aadhaarVerified: drawClaimAadhaarVerified,
            aadhaarData: drawClaimVerifiedData
        };
        
        console.log('📋 Claim data:', claimData);
        console.log('🔍 Aadhaar Number:', claimData.aadhaarNumber);
        console.log('🔍 Mobile Number:', claimData.mobileNumber);
        console.log('🔍 Aadhaar Verified:', claimData.aadhaarVerified);
        
        // Submit claim to API
        const response = await submitClaimToAPI(claimData);
        
        if (response.success) {
            // Show success message
            showToast(`Claim created successfully! ID: ${response.data.claim_id}`, 'success');
            
            // Add claim to map
            if (window.mapIntegration) {
                addNewClaimToMap(response.data);
            }
            
            // Close form
            closeClaimForm();
            
            console.log(`✅ Claim submitted: ${response.data.claim_id}`);
        } else {
            throw new Error(response.error || 'Failed to create claim');
        }
        
        // Re-enable submit button
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i data-lucide="check"></i> Submit Claim';
        }
        
    } catch (error) {
        console.error('❌ Error submitting claim:', error);
        showToast('Failed to submit claim. Please try again.', 'error');
        
        // Re-enable submit button
        const submitBtn = document.getElementById('submitClaimBtn');
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i data-lucide="check"></i> Submit Claim';
        }
    }
}

// Close modal when clicking outside
window.addEventListener('click', (event) => {
    const modal = document.getElementById('claimFormModal');
    if (event.target === modal) {
        closeClaimForm();
    }
});

// Close modal with ESC key
document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
        const modal = document.getElementById('claimFormModal');
        if (modal && modal.style.display === 'block') {
            closeClaimForm();
        }
    }
});


/**
 * Submit claim to API
 * @param {Object} claimData - Claim data with geometry
 * @returns {Promise<Object>} API response
 */
async function submitClaimToAPI(claimData) {
    try {
        // FOR DEMO/DEVELOPMENT: Create mock response instead of API call
        // In production, uncomment the API call below
        
        console.log('📤 Submitting claim (demo mode):', claimData);
        
        // Generate AI score for the claim
        const aiScore = generateAIScore();
        
        // Mock successful response
        const mockResponse = {
            success: true,
            message: 'Claim created successfully',
            data: {
                claim_id: `FRA-${Date.now()}`,
                claimant_name: claimData.claimant_name,
                aadhaarNumber: claimData.aadhaarNumber,
                mobileNumber: claimData.mobileNumber,
                aadhaarVerified: claimData.aadhaarVerified,
                village: claimData.village,
                district: claimData.district,
                state: claimData.state,
                claim_type: claimData.claim_type,
                area_ha: claimData.area_ha,
                geometry: claimData.geometry,
                status: 'pending',
                created_date: new Date().toISOString(),
                ai_score: aiScore
            }
        };
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        console.log('✅ Mock claim created:', mockResponse.data);
        return mockResponse;
        
        /* PRODUCTION CODE (commented out for demo):
        // Get auth token
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        
        if (!token) {
            throw new Error('No authentication token found. Please log in.');
        }
        
        // Make API call
        const response = await fetch(`${api.baseURL}/claims/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(claimData)
        });
        
        const result = await response.json();
        
        if (!response.ok) {
            throw new Error(result.error || result.message || 'Failed to create claim');
        }
        
        return result;
        */
        
    } catch (error) {
        console.error('❌ API call failed:', error);
        throw error;
    }
}

/**
 * Add newly created claim to map
 * @param {Object} claimData - Claim data from API response
 */
function addNewClaimToMap(claimData) {
    try {
        if (!claimData || !claimData.geometry) {
            console.warn('⚠️ No geometry data to add to map');
            return;
        }
        
        console.log('🔍 addNewClaimToMap received data:', claimData);
        console.log('🔍 Aadhaar from claimData:', claimData.aadhaarNumber);
        console.log('🔍 Mobile from claimData:', claimData.mobileNumber);
        
        // ADD TO CLAIMS DATABASE (so it appears in Claims page)
        const claimForDatabase = {
            id: claimData.claim_id,
            applicantName: claimData.claimant_name,
            aadhaarNumber: claimData.aadhaarNumber || null,
            mobileNumber: claimData.mobileNumber || null,
            aadhaarVerified: claimData.aadhaarVerified || false,
            village: claimData.village,
            district: claimData.district,
            state: claimData.state,
            claimType: claimData.claim_type,
            landArea: claimData.area_ha,
            aiScore: claimData.ai_score || generateAIScore(),
            status: claimData.status || 'pending',
            latitude: claimData.latitude || (claimData.geometry.coordinates ? claimData.geometry.coordinates[0][0][1] : 0),
            longitude: claimData.longitude || (claimData.geometry.coordinates ? claimData.geometry.coordinates[0][0][0] : 0),
            document: 'drawn_claim.pdf',
            remarks: claimData.notes || 'Created via map drawing',
            submittedDate: new Date().toISOString().split('T')[0],
            timeline: ['submitted']
        };
        
        console.log('🔍 claimForDatabase created:', claimForDatabase);
        console.log('🔍 claimForDatabase Aadhaar:', claimForDatabase.aadhaarNumber);
        
        // Add to beginning of claimsDatabase array
        claimsDatabase.unshift(claimForDatabase);
        
        // ADD TO REVIEW DATABASE (so it appears in Review section)
        const aiScoreForReview = claimData.ai_score || claimForDatabase.aiScore;
        const claimForReview = {
            id: claimData.claim_id,
            applicantName: claimData.claimant_name,
            aadhaarNumber: claimData.aadhaarNumber || null,
            mobileNumber: claimData.mobileNumber || null,
            aadhaarVerified: claimData.aadhaarVerified || false,
            village: claimData.village,
            district: claimData.district,
            state: claimData.state,
            claimType: claimData.claim_type,
            landArea: claimData.area_ha,
            latitude: claimData.latitude || (claimData.geometry.coordinates ? claimData.geometry.coordinates[0][0][1] : 0),
            longitude: claimData.longitude || (claimData.geometry.coordinates ? claimData.geometry.coordinates[0][0][0] : 0),
            aiScore: aiScoreForReview,
            status: 'pending',
            priority: aiScoreForReview >= 85 ? 'high' : aiScoreForReview >= 70 ? 'medium' : 'low',
            document: 'drawn_claim.pdf',
            submittedDate: new Date().toISOString().split('T')[0],
            reviewNotes: '',
            timeline: ['submitted'],
            linkedScheme: claimData.linked_scheme || 'None',
            notes: claimData.notes || '',
            aiExtracted: {
                name: claimData.claimant_name,
                village: claimData.village,
                coordinates: `${claimData.latitude || 0}, ${claimData.longitude || 0}`,
                landArea: `${claimData.area_ha} hectares`,
                claimType: claimData.claim_type === 'IFR' ? 'Individual Forest Rights' : 
                           claimData.claim_type === 'CFR' ? 'Community Forest Rights' : 
                           'Community Rights',
                confidence: aiScoreForReview
            },
            reviewHistory: []
        };
        
        // Add to beginning of reviewDatabase array
        reviewDatabase.unshift(claimForReview);
        
        // Update Claims page if it's currently visible
        if (currentPage === 'claims') {
            updateClaimsSummary();
            populateClaimsTable();
        }
        
        // Update Review page if it's currently visible
        if (currentPage === 'review') {
            populateReviewTable();
            updateReviewAnalytics();
        }
        
        console.log('✅ Claim added to database:', claimForDatabase.id);
        
        // Create GeoJSON feature
        const feature = {
            type: 'Feature',
            properties: {
                claim_id: claimData.claim_id,
                claimant: claimData.claimant_name,
                status: claimData.status,
                claim_type: claimData.claim_type,
                area_ha: claimData.area_ha,
                village: claimData.village,
                district: claimData.district,
                state: claimData.state,
                ai_score: null, // Will be updated when AI verification completes
                created_date: claimData.created_date
            },
            geometry: claimData.geometry
        };
        
        // Add to map using MapIntegration
        if (window.mapIntegration) {
            // Create layer with pending status color (yellow)
            const layer = L.geoJSON(feature, {
                style: {
                    color: '#f59e0b',
                    weight: 3,
                    opacity: 0.9,
                    fillColor: '#f59e0b',
                    fillOpacity: 0.6
                },
                onEachFeature: (feature, layer) => {
                    const props = feature.properties;
                    
                    const popupContent = `
                        <div class="claim-popup">
                            <h4>📋 ${props.claimant}</h4>
                            <p><strong>Claim ID:</strong> ${props.claim_id}</p>
                            <p><strong>Status:</strong> <span class="status-pending">${props.status}</span></p>
                            <p><strong>Type:</strong> ${props.claim_type}</p>
                            <p><strong>Area:</strong> ${props.area_ha} ha</p>
                            <p><strong>Village:</strong> ${props.village}, ${props.district}</p>
                            <p><strong>AI Verification:</strong> <span class="ai-pending">In Progress...</span></p>
                        </div>
                    `;
                    
                    layer.bindPopup(popupContent);
                }
            });
            
            // Add to map
            layer.addTo(window.map);
            
            // Zoom to new claim
            window.map.fitBounds(layer.getBounds(), { padding: [50, 50] });
            
            // Open popup
            setTimeout(() => {
                layer.openPopup();
            }, 500);
            
            console.log('✅ Claim added to map');
        }
        
    } catch (error) {
        console.error('❌ Error adding claim to map:', error);
    }
}


// ===== DRAW NEW CLAIM BUTTON FUNCTIONS =====

/**
 * Initialize Draw New Claim button visibility based on user role
 */
function initDrawClaimButton() {
    const drawClaimSection = document.getElementById('drawClaimSection');
    const btnDrawClaim = document.getElementById('btnDrawClaim');
    
    if (!drawClaimSection || !btnDrawClaim) {
        return;
    }
    
    // FOR DEMO/DEVELOPMENT: Always show the button
    // In production, you would check user roles
    drawClaimSection.style.display = 'block';
    console.log(`✅ Draw New Claim button visible (demo mode)`);
    
    /* PRODUCTION CODE (commented out for demo):
    // Get current user
    const user = getCurrentUser();
    
    if (!user) {
        // No user logged in, hide button
        drawClaimSection.style.display = 'none';
        return;
    }
    
    // Check if user has permission to draw claims
    const allowedRoles = ['district', 'state', 'admin'];
    const userRole = user.role ? user.role.toLowerCase() : '';
    
    if (allowedRoles.includes(userRole)) {
        // Show button for authorized users
        drawClaimSection.style.display = 'block';
        console.log(`✅ Draw New Claim button visible for role: ${user.role}`);
    } else {
        // Hide button for unauthorized users
        drawClaimSection.style.display = 'none';
        console.log(`⚠️ Draw New Claim button hidden for role: ${user.role}`);
    }
    */
}

/**
 * Get current user from storage
 * @returns {Object|null} User object or null
 */
function getCurrentUser() {
    // Try localStorage first
    const userStr = localStorage.getItem('user');
    if (userStr) {
        try {
            return JSON.parse(userStr);
        } catch (e) {
            console.error('Error parsing user from localStorage:', e);
        }
    }
    
    // Try sessionStorage
    const sessionUserStr = sessionStorage.getItem('user');
    if (sessionUserStr) {
        try {
            return JSON.parse(sessionUserStr);
        } catch (e) {
            console.error('Error parsing user from sessionStorage:', e);
        }
    }
    
    return null;
}

/**
 * Enable drawing mode when button is clicked
 */
function enableDrawingMode() {
    const btnDrawClaim = document.getElementById('btnDrawClaim');
    
    // FOR DEMO/DEVELOPMENT: Skip authentication checks
    // In production, uncomment the user validation below
    
    /* PRODUCTION CODE (commented out for demo):
    // Check if user is logged in
    const user = getCurrentUser();
    if (!user) {
        showToast('Please log in to create claims', 'error');
        return;
    }
    
    // Check if user has permission
    const allowedRoles = ['district', 'state', 'admin'];
    const userRole = user.role ? user.role.toLowerCase() : '';
    
    if (!allowedRoles.includes(userRole)) {
        showToast('You do not have permission to create claims', 'error');
        return;
    }
    */
    
    // Check if DrawClaimManager is initialized
    if (!window.drawClaimManager) {
        showToast('Drawing tool not initialized. Please refresh the page.', 'error');
        console.error('❌ DrawClaimManager not found on window object');
        return;
    }
    
    // Enable drawing mode
    window.drawClaimManager.enableDrawing();
    
    // Update button state
    if (btnDrawClaim) {
        btnDrawClaim.classList.add('active');
        btnDrawClaim.innerHTML = '<i data-lucide="pen-tool"></i><span>Drawing... (Double-click to finish)</span>';
        
        // Refresh lucide icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }
    
    console.log('🎨 Drawing mode enabled (demo mode - no auth required)');
}

/**
 * Reset draw button state
 */
function resetDrawButton() {
    const btnDrawClaim = document.getElementById('btnDrawClaim');
    
    if (btnDrawClaim) {
        btnDrawClaim.classList.remove('active');
        btnDrawClaim.innerHTML = '<i data-lucide="pen-tool"></i><span>Draw New Claim</span>';
        
        // Refresh lucide icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }
}

// Initialize button when map page loads
document.addEventListener('DOMContentLoaded', () => {
    // Wait for map to be ready
    setTimeout(() => {
        if (document.getElementById('map-page')?.style.display !== 'none') {
            initDrawClaimButton();
        }
    }, 500);
    
    // Add document upload event listener
    const documentUpload = document.getElementById('documentUpload');
    if (documentUpload) {
        documentUpload.addEventListener('change', handleDocumentUpload);
        console.log('✅ Document upload listener attached');
    }
});

// Also initialize when switching to map page
const originalShowPage = window.showPage;
if (originalShowPage) {
    window.showPage = function(pageId) {
        originalShowPage(pageId);
        
        if (pageId === 'map-page') {
            setTimeout(() => {
                initDrawClaimButton();
            }, 100);
        }
    };
}


// ===== ROLE-BASED NAVIGATION SYSTEM =====

// Role permissions configuration
const rolePermissions = {
    user: {
        name: 'User (Citizen)',
        sections: ['dashboard', 'map', 'claims', 'review', 'feedback', 'reports']
    },
    district: {
        name: 'District Officer',
        sections: ['dashboard', 'map', 'claims', 'review', 'assets', 'issues', 'reports', 'dss', 'feedback']
    },
    state: {
        name: 'State Officer',
        sections: ['dashboard', 'map', 'claims', 'review', 'reports', 'dss', 'assets', 'issues', 'feedback', 'admin']
    }
};

let pendingRoleChange = null;
let currentRole = 'district';

// Called when dropdown changes
function updateRoleBasedNav() {
    const roleSelector = document.getElementById('roleSelector');
    const selectedRole = roleSelector.value;
    
    if (selectedRole !== currentRole) {
        pendingRoleChange = selectedRole;
        showRoleChangeModal(selectedRole);
        roleSelector.value = currentRole; // Reset dropdown
        return;
    }
    
    applyRoleChange(selectedRole);
}

// Show authentication modal
function showRoleChangeModal(targetRole) {
    const modal = document.getElementById('roleChangeModal');
    const targetRoleName = document.getElementById('targetRoleName');
    
    targetRoleName.textContent = rolePermissions[targetRole].name;
    document.getElementById('roleLoginId').value = '';
    document.getElementById('rolePassword').value = '';
    
    modal.style.display = 'block';
    
    // Initialize lucide icons in modal
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

// Close modal
function closeRoleChangeModal() {
    document.getElementById('roleChangeModal').style.display = 'none';
    pendingRoleChange = null;
}

// Authenticate (accepts any credentials for demo)
function authenticateRoleChange(event) {
    event.preventDefault();
    
    const loginId = document.getElementById('roleLoginId').value;
    const password = document.getElementById('rolePassword').value;
    
    if (loginId && password) {
        const submitBtn = event.target.querySelector('button[type="submit"]');
        const originalHTML = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i data-lucide="loader"></i> Authenticating...';
        submitBtn.disabled = true;
        
        // Re-initialize icons for the loader
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
        
        setTimeout(() => {
            currentRole = pendingRoleChange;
            document.getElementById('roleSelector').value = currentRole;
            applyRoleChange(currentRole);
            closeRoleChangeModal();
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalHTML;
            
            // Re-initialize icons
            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
            }
            
            showNotification(`✓ Role changed to ${rolePermissions[currentRole].name}`, 'success');
        }, 800);
    }
}

// Apply role change to navigation
function applyRoleChange(selectedRole) {
    const roleData = rolePermissions[selectedRole];
    
    console.log('🔄 Applying role change:', selectedRole);
    console.log('📋 Role data:', roleData);
    console.log('✅ Allowed sections:', roleData.sections);
    
    // Update role badge
    document.getElementById('roleBadge').textContent = roleData.name;
    
    // Show/hide navigation items based on role
    document.querySelectorAll('.nav-item[data-section]').forEach(item => {
        const section = item.getAttribute('data-section');
        const allowedRoles = item.getAttribute('data-roles');
        
        // Check if section is allowed for this role
        let isAllowed = roleData.sections.includes(section);
        
        // If data-roles attribute exists, also check if current role is in the list
        if (allowedRoles) {
            const rolesArray = allowedRoles.split(',').map(r => r.trim());
            isAllowed = isAllowed && rolesArray.includes(selectedRole);
        }
        
        console.log(`  ${section}: ${isAllowed ? '✓ SHOW' : '✗ HIDE'} (roles: ${allowedRoles || 'all'})`);
        
        if (isAllowed) {
            item.classList.remove('role-hidden');
            item.style.display = '';
        } else {
            item.classList.add('role-hidden');
            item.style.display = 'none';
        }
    });
    
    console.log(`✅ Role changed to: ${roleData.name}`);
}

// Show notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 90px;
        right: 20px;
        background: ${type === 'success' ? '#4CAF50' : '#2196F3'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        z-index: 10000;
        animation: slideInRight 0.3s ease;
        font-weight: 500;
        font-size: 0.875rem;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideInRight 0.3s ease reverse';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Initialize role-based navigation on page load
document.addEventListener('DOMContentLoaded', function() {
    // Set initial role
    const roleSelector = document.getElementById('roleSelector');
    if (roleSelector) {
        currentRole = roleSelector.value;
        applyRoleChange(currentRole);
    }
    
    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        const modal = document.getElementById('roleChangeModal');
        if (event.target === modal) {
            closeRoleChangeModal();
        }
    });
});


// ===== AADHAAR VERIFICATION SYSTEM =====

let aadhaarVerified = false;
let verifiedAadhaarData = null;

// Verify Aadhaar Number
async function verifyAadhaarNumber() {
    const aadhaarInput = document.getElementById('aadhaarNumber');
    const aadhaarNumber = aadhaarInput.value.trim();
    const verifyBtn = document.getElementById('btnVerifyAadhaar');
    const statusDiv = document.getElementById('aadhaarVerificationStatus');
    const claimForm = document.getElementById('newClaimForm');

    // Validation
    if (!aadhaarNumber) {
        showAadhaarError('Please enter Aadhaar number');
        return;
    }

    if (aadhaarNumber.length !== 12 || !/^\d{12}$/.test(aadhaarNumber)) {
        showAadhaarError('Invalid Aadhaar format. Must be 12 digits.');
        return;
    }

    // Show loading state
    verifyBtn.disabled = true;
    verifyBtn.classList.add('loading');
    verifyBtn.innerHTML = '<i data-lucide="loader"></i><span>Verifying...</span>';
    lucide.createIcons();

    statusDiv.style.display = 'none';
    aadhaarVerified = false;
    claimForm.classList.add('aadhaar-not-verified');

    try {
        // Call backend API
        const mobileInput = document.getElementById('mobileNumber');
        const mobileNumber = mobileInput ? mobileInput.value.trim() : '';
        
        const response = await fetch('http://localhost:5001/api/auth/verify-aadhaar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
                aadhaarNumber: aadhaarNumber,
                mobileNumber: mobileNumber 
            })
        });

        const result = await response.json();

        // Handle response
        if (result.success && result.data && result.data.verified) {
            if (result.data.status === 'verified') {
                showAadhaarSuccess(result);
                aadhaarVerified = true;
                verifiedAadhaarData = result.data;
                claimForm.classList.remove('aadhaar-not-verified');
                
                // Auto-fill form fields
                autoFillFormFromAadhaar(result.data);
            } else if (result.data.status === 'disputed') {
                showAadhaarWarning(result);
                aadhaarVerified = true;
                verifiedAadhaarData = result.data;
                claimForm.classList.remove('aadhaar-not-verified');
                
                // Auto-fill form fields
                autoFillFormFromAadhaar(result.data);
            }
        } else {
            showAadhaarError(result.message, result);
            aadhaarVerified = false;
        }
    } catch (error) {
        console.error('Aadhaar verification error:', error);
        showAadhaarError('Verification service temporarily unavailable. Please try again.');
        aadhaarVerified = false;
    } finally {
        // Reset button
        verifyBtn.disabled = false;
        verifyBtn.classList.remove('loading');
        verifyBtn.innerHTML = '<i data-lucide="check-circle"></i><span>Verify Aadhaar</span>';
        lucide.createIcons();
    }
}

// Show success message
function showAadhaarSuccess(result) {
    const statusDiv = document.getElementById('aadhaarVerificationStatus');
    const data = result.data;

    statusDiv.className = 'verification-status success';
    statusDiv.style.display = 'flex';
    statusDiv.innerHTML = `
        <i data-lucide="check-circle"></i>
        <div class="verification-status-content">
            <h5>✅ Aadhaar Verified Successfully!</h5>
            <p>${result.message}</p>
            <div class="verification-details">
                <div class="verification-details-grid">
                    <div class="verification-detail-item">
                        <strong>Name:</strong> <span>${data.name}</span>
                    </div>
                    <div class="verification-detail-item">
                        <strong>Gender:</strong> <span>${data.gender}</span>
                    </div>
                    <div class="verification-detail-item">
                        <strong>Village:</strong> <span>${data.address.village}</span>
                    </div>
                    <div class="verification-detail-item">
                        <strong>District:</strong> <span>${data.address.district}</span>
                    </div>
                </div>
            </div>
        </div>
    `;
    lucide.createIcons();
}

// Show warning message (disputed)
function showAadhaarWarning(result) {
    const statusDiv = document.getElementById('aadhaarVerificationStatus');
    const data = result.data;
    const dispute = result.dispute;

    statusDiv.className = 'verification-status warning';
    statusDiv.style.display = 'flex';
    statusDiv.innerHTML = `
        <i data-lucide="alert-triangle"></i>
        <div class="verification-status-content">
            <h5>⚠️ Property Dispute Detected</h5>
            <p>${result.message}</p>
            <div class="verification-details">
                <p><strong>Dispute Type:</strong> ${dispute.type.replace('_', ' ')}</p>
                <p><strong>Reason:</strong> ${dispute.reason}</p>
                <p style="margin-top: 0.5rem; font-weight: 600;">Your claim will be sent to District Officer for manual review.</p>
            </div>
        </div>
    `;
    lucide.createIcons();
}

// Show error message
function showAadhaarError(message, result = null) {
    const statusDiv = document.getElementById('aadhaarVerificationStatus');

    let detailsHTML = '';
    if (result && result.existingClaimId) {
        detailsHTML = `
            <div class="verification-details">
                <p><strong>Existing Claim ID:</strong> ${result.existingClaimId}</p>
                <p>If this is an error, please contact your District Office.</p>
            </div>
        `;
    }

    statusDiv.className = 'verification-status error';
    statusDiv.style.display = 'flex';
    statusDiv.innerHTML = `
        <i data-lucide="x-circle"></i>
        <div class="verification-status-content">
            <h5>❌ Verification Failed</h5>
            <p>${message}</p>
            ${detailsHTML}
        </div>
    `;
    lucide.createIcons();
}

// Auto-fill form from Aadhaar data
function autoFillFormFromAadhaar(data) {
    // Fill name
    document.getElementById('applicantName').value = data.name;
    
    // Fill village
    if (data.address && data.address.village) {
        document.getElementById('villageName').value = data.address.village;
    }
    
    // Try to select state and district
    if (data.address && data.address.state) {
        const stateSelect = document.getElementById('claimState');
        const stateOption = Array.from(stateSelect.options).find(
            opt => opt.text.toLowerCase().includes(data.address.state.toLowerCase())
        );
        if (stateOption) {
            stateSelect.value = stateOption.value;
            // Trigger change event to load districts
            stateSelect.dispatchEvent(new Event('change'));
            
            // Wait a bit for districts to load, then select
            setTimeout(() => {
                if (data.address.district) {
                    const districtSelect = document.getElementById('claimDistrict');
                    const districtOption = Array.from(districtSelect.options).find(
                        opt => opt.text.toLowerCase().includes(data.address.district.toLowerCase())
                    );
                    if (districtOption) {
                        districtSelect.value = districtOption.value;
                    }
                }
            }, 500);
        }
    }
    
    console.log('✅ Form auto-filled from Aadhaar data');
}

// Validate Aadhaar before form submission
function validateAadhaarBeforeSubmit() {
    if (!aadhaarVerified) {
        alert('⚠️ Please verify your Aadhaar number before submitting the claim.');
        return false;
    }
    return true;
}

// Initialize Aadhaar verification on form open
function initializeAadhaarVerification() {
    const claimForm = document.getElementById('newClaimForm');
    if (claimForm) {
        claimForm.classList.add('aadhaar-not-verified');
    }
    
    // Reset verification status
    aadhaarVerified = false;
    verifiedAadhaarData = null;
    
    const statusDiv = document.getElementById('aadhaarVerificationStatus');
    if (statusDiv) {
        statusDiv.style.display = 'none';
    }
    
    // Clear Aadhaar input
    const aadhaarInput = document.getElementById('aadhaarNumber');
    if (aadhaarInput) {
        aadhaarInput.value = '';
    }
    
    // Make name field readonly
    const nameInput = document.getElementById('applicantName');
    if (nameInput) {
        nameInput.value = '';
        nameInput.setAttribute('readonly', 'readonly');
    }
}

// Add Enter key support for Aadhaar input
document.addEventListener('DOMContentLoaded', function() {
    const aadhaarInput = document.getElementById('aadhaarNumber');
    if (aadhaarInput) {
        aadhaarInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                verifyAadhaarNumber();
            }
        });
        
        // Only allow numbers
        aadhaarInput.addEventListener('input', function(e) {
            this.value = this.value.replace(/[^0-9]/g, '');
        });
    }
});


// ===== DRAW CLAIM AADHAAR VERIFICATION =====

let drawClaimAadhaarVerified = false;
let drawClaimVerifiedData = null;

// Verify Aadhaar for Draw Claim Form
async function verifyDrawClaimAadhaar() {
    const aadhaarInput = document.getElementById('drawClaimAadhaar');
    const mobileInput = document.getElementById('mobileNumber');
    const aadhaarNumber = aadhaarInput.value.trim();
    const mobileNumber = mobileInput.value.trim();
    const verifyBtn = document.getElementById('btnVerifyDrawAadhaar');
    const statusDiv = document.getElementById('drawAadhaarVerificationStatus');
    const claimForm = document.getElementById('claimForm');

    // Validation
    if (!aadhaarNumber) {
        showDrawAadhaarError('Please enter Aadhaar number');
        return;
    }

    if (aadhaarNumber.length !== 12 || !/^\d{12}$/.test(aadhaarNumber)) {
        showDrawAadhaarError('Invalid Aadhaar format. Must be 12 digits.');
        return;
    }

    if (!mobileNumber) {
        showDrawAadhaarError('Please enter mobile number');
        return;
    }

    if (mobileNumber.length !== 10 || !/^\d{10}$/.test(mobileNumber)) {
        showDrawAadhaarError('Invalid mobile format. Must be 10 digits.');
        return;
    }

    // Show loading state
    verifyBtn.disabled = true;
    verifyBtn.classList.add('loading');
    verifyBtn.innerHTML = '<i data-lucide="loader"></i><span>Verifying...</span>';
    lucide.createIcons();

    statusDiv.style.display = 'none';
    drawClaimAadhaarVerified = false;

    try {
        // Call backend API
        const response = await fetch('http://localhost:5001/api/auth/verify-aadhaar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
                aadhaarNumber: aadhaarNumber,
                mobileNumber: mobileNumber 
            })
        });

        const result = await response.json();

        // Handle response
        if (result.success && result.data && result.data.verified) {
            if (result.data.status === 'verified') {
                showDrawAadhaarSuccess(result);
                drawClaimAadhaarVerified = true;
                drawClaimVerifiedData = result.data;
                
                // Auto-fill claimant name
                document.getElementById('claimantName').value = result.data.name;
                
                // Enable form
                enableDrawClaimForm();
            } else if (result.data.status === 'disputed') {
                showDrawAadhaarWarning(result);
                drawClaimAadhaarVerified = true;
                drawClaimVerifiedData = result.data;
                
                // Auto-fill claimant name
                document.getElementById('claimantName').value = result.data.name;
                
                // Enable form
                enableDrawClaimForm();
            }
        } else {
            showDrawAadhaarError(result.message, result);
            drawClaimAadhaarVerified = false;
        }
    } catch (error) {
        console.error('Aadhaar verification error:', error);
        showDrawAadhaarError('Verification service temporarily unavailable. Please try again.');
        drawClaimAadhaarVerified = false;
    } finally {
        // Reset button
        verifyBtn.disabled = false;
        verifyBtn.classList.remove('loading');
        verifyBtn.innerHTML = '<i data-lucide="check-circle"></i><span>Verify Aadhaar</span>';
        lucide.createIcons();
    }
}

// Show success for draw claim
function showDrawAadhaarSuccess(result) {
    const statusDiv = document.getElementById('drawAadhaarVerificationStatus');
    const data = result.data;

    statusDiv.className = 'verification-status success';
    statusDiv.style.display = 'flex';
    statusDiv.innerHTML = `
        <i data-lucide="check-circle"></i>
        <div class="verification-status-content">
            <h5>✅ Aadhaar Verified Successfully!</h5>
            <p>${result.message}</p>
            <div class="verification-details">
                <div class="verification-details-grid">
                    <div class="verification-detail-item">
                        <strong>Name:</strong> <span>${data.name}</span>
                    </div>
                    <div class="verification-detail-item">
                        <strong>Village:</strong> <span>${data.address.village}</span>
                    </div>
                </div>
            </div>
        </div>
    `;
    lucide.createIcons();
}

// Show warning for draw claim
function showDrawAadhaarWarning(result) {
    const statusDiv = document.getElementById('drawAadhaarVerificationStatus');
    const dispute = result.dispute;

    statusDiv.className = 'verification-status warning';
    statusDiv.style.display = 'flex';
    statusDiv.innerHTML = `
        <i data-lucide="alert-triangle"></i>
        <div class="verification-status-content">
            <h5>⚠️ Property Dispute Detected</h5>
            <p>${result.message}</p>
            <div class="verification-details">
                <p><strong>Reason:</strong> ${dispute.reason}</p>
                <p style="margin-top: 0.5rem; font-weight: 600;">Your claim will be sent for manual review.</p>
            </div>
        </div>
    `;
    lucide.createIcons();
}

// Show error for draw claim
function showDrawAadhaarError(message, result = null) {
    const statusDiv = document.getElementById('drawAadhaarVerificationStatus');

    let detailsHTML = '';
    if (result && result.existingClaimId) {
        detailsHTML = `
            <div class="verification-details">
                <p><strong>Existing Claim ID:</strong> ${result.existingClaimId}</p>
            </div>
        `;
    }

    statusDiv.className = 'verification-status error';
    statusDiv.style.display = 'flex';
    statusDiv.innerHTML = `
        <i data-lucide="x-circle"></i>
        <div class="verification-status-content">
            <h5>❌ Verification Failed</h5>
            <p>${message}</p>
            ${detailsHTML}
        </div>
    `;
    lucide.createIcons();
}

// Enable draw claim form after verification
function enableDrawClaimForm() {
    const claimForm = document.getElementById('claimForm');
    if (claimForm) {
        claimForm.classList.remove('aadhaar-not-verified');
    }
}

// Disable draw claim form initially
function disableDrawClaimForm() {
    const claimForm = document.getElementById('claimForm');
    if (claimForm) {
        claimForm.classList.add('aadhaar-not-verified');
    }
    
    // Reset verification
    drawClaimAadhaarVerified = false;
    drawClaimVerifiedData = null;
    
    // Clear fields
    const aadhaarInput = document.getElementById('drawClaimAadhaar');
    const mobileInput = document.getElementById('mobileNumber');
    const nameInput = document.getElementById('claimantName');
    
    if (aadhaarInput) aadhaarInput.value = '';
    if (mobileInput) mobileInput.value = '';
    if (nameInput) nameInput.value = '';
    
    // Hide status
    const statusDiv = document.getElementById('drawAadhaarVerificationStatus');
    if (statusDiv) statusDiv.style.display = 'none';
}

// Add mobile number validation
document.addEventListener('DOMContentLoaded', function() {
    const mobileInput = document.getElementById('mobileNumber');
    if (mobileInput) {
        mobileInput.addEventListener('input', function(e) {
            this.value = this.value.replace(/[^0-9]/g, '');
        });
    }
    
    const drawAadhaarInput = document.getElementById('drawClaimAadhaar');
    if (drawAadhaarInput) {
        drawAadhaarInput.addEventListener('input', function(e) {
            this.value = this.value.replace(/[^0-9]/g, '');
        });
        
        drawAadhaarInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                verifyDrawClaimAadhaar();
            }
        });
    }
});
