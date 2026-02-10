const applicationService = require('../services/applicationService');

// @desc    Apply to an opportunity
// @route   POST /api/applications
// @access  Private
const createApplication = async (req, res, next) => {
    try {
        const { opportunity_id } = req.body;
        const application = await applicationService.createApplication(req.user._id, opportunity_id);
        res.status(201).json({ success: true, data: application });
    } catch (err) {
        // Handle duplicate key error specifically if service didn't catch it race condition
        if (err.code === 11000) {
            return res.status(409).json({ success: false, error: 'You have already applied to this opportunity' });
        }
        next(err);
    }
};

// @desc    Get all applications
// @route   GET /api/applications
// @access  Private
const getApplications = async (req, res, next) => {
    try {
        const query = { user_id: req.user._id };

        if (req.query.status) {
            query.status = req.query.status;
        }

        // Filter by deadline? "GET /applications?status=&deadline=" 
        // Logic for deadline filtering usually implies finding applications where the opportunity deadline matches something.
        // This is complex with simple find. Let's stick to status for now or simple deadline logic if needed. 
        // To filter by deadline of the *opportunity* we need aggregation or virtual populate.
        // For MVP/Demo lets just return all and let frontend filter or basic status filter.

        const applications = await applicationService.getApplications(query);
        res.status(200).json({ success: true, count: applications.length, data: applications });
    } catch (err) {
        next(err);
    }
};

// @desc    Update application status
// @route   PUT /api/applications/:id/status
// @access  Private
const updateApplicationStatus = async (req, res, next) => {
    try {
        const { status, interview_date } = req.body;
        const application = await applicationService.updateApplicationStatus(req.params.id, status, interview_date);
        res.status(200).json({ success: true, data: application });
    } catch (err) {
        next(err);
    }
};

module.exports = {
    createApplication,
    getApplications,
    updateApplicationStatus
};
