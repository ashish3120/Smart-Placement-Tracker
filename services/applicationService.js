const Application = require('../models/Application');
const Opportunity = require('../models/Opportunity');
const ApiError = require('../utils/ApiError');

const createApplication = async (userId, opportunityId) => {
    // 1. Check if opportunity exists and if deadline passed
    const opportunity = await Opportunity.findById(opportunityId);
    if (!opportunity) {
        throw new ApiError('Opportunity not found', 404);
    }

    if (new Date() > new Date(opportunity.deadline)) {
        throw new ApiError('Deadline for this opportunity has passed', 400);
    }

    // 2. Check if already applied
    // Manual check because compound index doesn't exist in generic JsonDB
    const existingApps = await Application.find({ user_id: userId });
    const exists = existingApps.find(app => app.opportunity_id === opportunityId);

    if (exists) {
        throw new ApiError('You have already applied to this opportunity', 409);
    }

    // 3. Create Application
    const application = await Application.create({
        user_id: userId,
        opportunity_id: opportunityId,
        status: 'Applied'
    });

    return application;
};

const getApplications = async (query) => {
    const allApps = await Application.find(query);

    // Manual populate
    const populatedApps = await Promise.all(allApps.map(async (app) => {
        const opportunity = await Opportunity.findById(app.opportunity_id);
        return {
            ...app,
            opportunity_id: opportunity ? {
                company_name: opportunity.company_name,
                role: opportunity.role,
                deadline: opportunity.deadline
            } : null
        };
    }));

    return populatedApps.sort((a, b) => new Date(b.last_updated) - new Date(a.last_updated));
};

const updateApplicationStatus = async (id, status, interviewDate) => {
    let application = await Application.findById(id);

    if (!application) {
        throw new ApiError('Application not found', 404);
    }

    // Manual populate for deadline check
    const opportunity = await Opportunity.findById(application.opportunity_id);

    if (status === 'Applied' && opportunity && new Date() > new Date(opportunity.deadline)) {
        throw new ApiError('Cannot revert to Applied status after deadline', 400);
    }

    const fieldsToUpdate = {
        status,
        last_updated: new Date()
    };

    if (status === 'Interview' && interviewDate) {
        fieldsToUpdate.interview_date = new Date(interviewDate);
    }

    // Pass options as null, JsonDB doesn't use them
    application = await Application.findByIdAndUpdate(id, fieldsToUpdate);

    // Re-fetch to return full object (JsonDB update returns updated object, but let's be safe)
    return application;
};

module.exports = {
    createApplication,
    getApplications,
    updateApplicationStatus
};
