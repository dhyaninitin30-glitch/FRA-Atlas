// Claims Controller
// Handles all claim-related operations

const { mockClaims } = require('../config/database');

// In-memory storage (replace with database in production)
let claims = [...mockClaims];

// Get all claims
const getAllClaims = (req, res) => {
    try {
        const statistics = {
            total: claims.length,
            approved: claims.filter(c => c.status === 'approved').length,
            pending: claims.filter(c => c.status === 'pending').length,
            rejected: claims.filter(c => c.status === 'rejected').length,
            under_review: claims.filter(c => c.status === 'under-review').length
        };

        res.json({
            success: true,
            data: {
                claims: claims,
                total: claims.length
            },
            statistics
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching claims',
            error: error.message
        });
    }
};

// Get claim by ID
const getClaimById = (req, res) => {
    try {
        const claim = claims.find(
            c => c.id === req.params.id || c.claim_number === req.params.id
        );
        
        if (claim) {
            res.json({
                success: true,
                data: claim
            });
        } else {
            res.status(404).json({
                success: false,
                message: 'Claim not found'
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching claim',
            error: error.message
        });
    }
};

// Create new claim
const createClaim = (req, res) => {
    try {
        const newClaim = {
            id: `FRA2025-JH-${String(claims.length + 1).padStart(3, '0')}`,
            claim_number: `FRA2025-JH-${String(claims.length + 1).padStart(3, '0')}`,
            ...req.body,
            ai_score: Math.floor(Math.random() * 30) + 70, // Random score 70-100
            status: 'pending',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        };
        
        claims.push(newClaim);
        
        console.log(`✅ New claim created: ${newClaim.id}`);
        
        res.json({
            success: true,
            message: 'Claim created successfully',
            data: newClaim
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error creating claim',
            error: error.message
        });
    }
};

// Update claim
const updateClaim = (req, res) => {
    try {
        const claimIndex = claims.findIndex(
            c => c.id === req.params.id || c.claim_number === req.params.id
        );
        
        if (claimIndex !== -1) {
            claims[claimIndex] = {
                ...claims[claimIndex],
                ...req.body,
                updated_at: new Date().toISOString()
            };
            
            console.log(`✅ Claim updated: ${claims[claimIndex].id}`);
            
            res.json({
                success: true,
                message: 'Claim updated successfully',
                data: claims[claimIndex]
            });
        } else {
            res.status(404).json({
                success: false,
                message: 'Claim not found'
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating claim',
            error: error.message
        });
    }
};

// Delete claim
const deleteClaim = (req, res) => {
    try {
        const claimIndex = claims.findIndex(
            c => c.id === req.params.id || c.claim_number === req.params.id
        );
        
        if (claimIndex !== -1) {
            const deletedClaim = claims.splice(claimIndex, 1)[0];
            
            console.log(`✅ Claim deleted: ${deletedClaim.id}`);
            
            res.json({
                success: true,
                message: 'Claim deleted successfully',
                data: deletedClaim
            });
        } else {
            res.status(404).json({
                success: false,
                message: 'Claim not found'
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting claim',
            error: error.message
        });
    }
};

module.exports = {
    getAllClaims,
    getClaimById,
    createClaim,
    updateClaim,
    deleteClaim,
    claims // Export for other modules to access
};
