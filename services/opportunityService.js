const Opportunity = require('../models/Opportunity');
const ApiError = require('../utils/ApiError');

const createOpportunity = async (data, user) => {
    const opportunity = await Opportunity.create({
        ...data,
        created_by: user._id
    });
    return opportunity;
};

const getOpportunities = async (query) => {
    // Advanced filtering could be added here
    const opportunities = await Opportunity.find(query).sort({ createdAt: -1 });
    return opportunities;
};

const getOpportunityById = async (id) => {
    const opportunity = await Opportunity.findById(id);
    if (!opportunity) {
        throw new ApiError('Opportunity not found', 404);
    }
    return opportunity;
};

const updateOpportunity = async (id, data, user) => {
    let opportunity = await Opportunity.findById(id);

    if (!opportunity) {
        throw new ApiError('Opportunity not found', 404);
    }

    // specific auth check: only creator can update? User requirement implies simple role but let's assume creator for now or admin. 
    // For now, let's just allow it if authenticated as per requirements "PUT /opportunities/{id}"

    opportunity = await Opportunity.findByIdAndUpdate(id, data, {
        new: true,
        runValidators: true
    });

    return opportunity;
};

const deleteOpportunity = async (id) => {
    const opportunity = await Opportunity.findById(id);

    if (!opportunity) {
        throw new ApiError('Opportunity not found', 404);
    }

    await opportunity.remove();
    return { success: true };
};

module.exports = {
    createOpportunity,
    getOpportunities,
    getOpportunityById,
    updateOpportunity,
    deleteOpportunity
};
