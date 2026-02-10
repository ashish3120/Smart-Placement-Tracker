const dashboardService = require('../services/dashboardService');

// @desc    Get dashboard summary
// @route   GET /api/dashboard/summary
// @access  Private
const getSummary = async (req, res, next) => {
    try {
        const data = await dashboardService.getSummary(req.user._id);

        res.status(200).json({
            success: true,
            data
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Get today's agenda
// @route   GET /api/dashboard/today
// @access  Private
const getToday = async (req, res, next) => {
    try {
        const data = await dashboardService.getToday(req.user._id);

        res.status(200).json({
            success: true,
            data
        });
    } catch (err) {
        next(err);
    }
};

module.exports = {
    getSummary,
    getToday
};
