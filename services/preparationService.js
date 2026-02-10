const Preparation = require('../models/Preparation');
const Opportunity = require('../models/Opportunity');
const ApiError = require('../utils/ApiError');

const getPreparation = async (userId, opportunityId) => {
    // Check if opportunity exists
    const opportunity = await Opportunity.findById(opportunityId);
    if (!opportunity) {
        throw new ApiError('Opportunity not found', 404);
    }

    // Find existing or create new
    let preparation = await Preparation.findOne({
        user_id: userId,
        opportunity_id: opportunityId
    });

    if (!preparation) {
        preparation = await Preparation.create({
            user_id: userId,
            opportunity_id: opportunityId,
            checklist_items: [
                { title: 'Research Company', completed: false },
                { title: 'Review Job Description', completed: false },
                { title: 'Prepare Resume', completed: false },
                { title: 'Practice Common Interview Questions', completed: false }
            ],
            notes: ''
        });
    }

    return preparation;
};

const updatePreparation = async (userId, opportunityId, data) => {
    // JsonDB needs ID to update usually, or we find then update
    // Preparation model has findOneAndUpdate wrapper now

    let preparation = await Preparation.findOneAndUpdate(
        { user_id: userId, opportunity_id: opportunityId },
        { ...data, last_updated: new Date() }
    );

    if (!preparation) {
        throw new ApiError('Preparation document not found', 404);
    }

    return preparation;
};

module.exports = {
    getPreparation,
    updatePreparation
};
