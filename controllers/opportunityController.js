const opportunityService = require('../services/opportunityService');

// @desc    Create new opportunity
// @route   POST /api/opportunities
// @access  Private
const createOpportunity = async (req, res, next) => {
    try {
        const opportunity = await opportunityService.createOpportunity(req.body, req.user);
        res.status(201).json({ success: true, data: opportunity });
    } catch (err) {
        next(err);
    }
};

// @desc    Get all opportunities
// @route   GET /api/opportunities
// @access  Private
const getOpportunities = async (req, res, next) => {
    try {
        const opportunities = await opportunityService.getOpportunities(req.query);
        res.status(200).json({ success: true, count: opportunities.length, data: opportunities });
    } catch (err) {
        next(err);
    }
};

// @desc    Get single opportunity
// @route   GET /api/opportunities/:id
// @access  Private
const getOpportunity = async (req, res, next) => {
    try {
        const opportunity = await opportunityService.getOpportunityById(req.params.id);
        res.status(200).json({ success: true, data: opportunity });
    } catch (err) {
        next(err);
    }
};

// @desc    Update opportunity
// @route   PUT /api/opportunities/:id
// @access  Private
const updateOpportunity = async (req, res, next) => {
    try {
        const opportunity = await opportunityService.updateOpportunity(req.params.id, req.body, req.user);
        res.status(200).json({ success: true, data: opportunity });
    } catch (err) {
        next(err);
    }
};

// @desc    Delete opportunity
// @route   DELETE /api/opportunities/:id
// @access  Private
const deleteOpportunity = async (req, res, next) => {
    try {
        await opportunityService.deleteOpportunity(req.params.id);
        res.status(200).json({ success: true, data: {} });
    } catch (err) {
        next(err);
    }
};

module.exports = {
    createOpportunity,
    getOpportunities,
    getOpportunity,
    updateOpportunity,
    deleteOpportunity
};
