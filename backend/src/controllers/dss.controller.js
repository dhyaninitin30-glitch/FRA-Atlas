// DSS (Decision Support System) Controller
// Handles AI recommendations and scheme suggestions

const { schemesDatabase } = require('../config/database');

// Get scheme recommendations
const getRecommendations = (req, res) => {
    try {
        const recommended = schemesDatabase.filter(s => s.eligibility > 80);
        
        res.json({
            success: true,
            data: {
                schemes: schemesDatabase,
                recommended: recommended
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching recommendations',
            error: error.message
        });
    }
};

// Get all schemes
const getAllSchemes = (req, res) => {
    try {
        res.json({
            success: true,
            data: {
                schemes: schemesDatabase
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching schemes',
            error: error.message
        });
    }
};

module.exports = {
    getRecommendations,
    getAllSchemes
};
