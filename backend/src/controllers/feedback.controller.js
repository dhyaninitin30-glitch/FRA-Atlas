// Feedback Controller
// Handles feedback submissions

// Get all feedback
const getAllFeedback = (req, res) => {
    try {
        res.json({
            success: true,
            data: {
                feedback: [],
                total: 0
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching feedback',
            error: error.message
        });
    }
};

// Submit feedback
const submitFeedback = (req, res) => {
    try {
        const feedbackData = req.body;
        
        res.json({
            success: true,
            message: 'Feedback submitted successfully',
            data: {
                id: `FBK-${Date.now()}`,
                ...feedbackData,
                status: 'pending',
                created_at: new Date().toISOString()
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error submitting feedback',
            error: error.message
        });
    }
};

module.exports = {
    getAllFeedback,
    submitFeedback
};
