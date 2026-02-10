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

const getAllUserPreparations = async (userId) => {
    console.log('[PrepService] Fetching all for user:', userId);
    const allOpportunities = await Opportunity.find();
    console.log(`[PrepService] Found ${allOpportunities.length} opportunities in total.`);

    const prepList = [];
    for (const opp of allOpportunities) {
        console.log(`[PrepService] Reconciling ${opp.company_name} (${opp._id})`);
        try {
            const prep = await getPreparation(userId, opp._id);
            prepList.push({
                ...prep,
                opportunity_id: {
                    _id: opp._id,
                    company_name: opp.company_name,
                    role: opp.role
                }
            });
        } catch (err) {
            console.error(`[PrepService] Error for opp ${opp._id}:`, err.message);
        }
    }

    console.log(`[PrepService] Sync complete. Returning ${prepList.length} items.`);
    return prepList;
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
    getAllUserPreparations,
    updatePreparation
};
