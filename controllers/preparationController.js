const preparationService = require('../services/preparationService');

// @desc    Get all preparations for current user
// @route   GET /api/preparation
// @access  Private
const getPreparations = async (req, res, next) => {
    try {
        const preparations = await preparationService.getAllUserPreparations(req.user._id);
        res.status(200).json({ success: true, count: preparations.length, data: preparations });
    } catch (err) {
        next(err);
    }
};

// @desc    Get preparation for an opportunity
// @route   GET /api/preparation/:opportunity_id
// @access  Private
const getPreparation = async (req, res, next) => {
    try {
        const preparation = await preparationService.getPreparation(req.user._id, req.params.opportunity_id);
        res.status(200).json({ success: true, data: preparation });
    } catch (err) {
        next(err);
    }
};

// @desc    Update preparation for an opportunity
// @route   PUT /api/preparation/:opportunity_id
// @access  Private
const updatePreparation = async (req, res, next) => {
    try {
        const preparation = await preparationService.updatePreparation(req.user._id, req.params.opportunity_id, req.body);
        res.status(200).json({ success: true, data: preparation });
    } catch (err) {
        next(err);
    }
};

module.exports = {
    getPreparations,
    getPreparation,
    updatePreparation
};
