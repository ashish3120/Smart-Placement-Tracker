const Application = require('../models/Application');
const Opportunity = require('../models/Opportunity');
const User = require('../models/User');

// Helper to manually filter dates since JsonDB find is basic
const isDateBetween = (dateStr, start, end) => {
    const d = new Date(dateStr);
    return d >= start && d <= end;
};

const getSummary = async (userId) => {
    // 1. Get Application Counts
    // JsonDB aggregation simulation
    const pipeline = [
        { $match: { user_id: userId } },
        { $group: { _id: '$status' } }
    ];

    // Manual aggregation because our JsonDB aggregate is very specific
    const applications = await Application.find({ user_id: userId });

    const stats = {
        applied: 0,
        interviews: 0,
        selected: 0,
        rejected: 0
    };

    applications.forEach(app => {
        const s = app.status.toLowerCase();
        if (s === 'interview') {
            stats.interviews++;
        } else if (stats.hasOwnProperty(s)) {
            stats[s]++;
        }
    });

    // 2. Get Upcoming Deadlines (next 7 days)
    const today = new Date();
    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 7);

    // Manual filtering for dates
    const allOpportunities = await Opportunity.find();
    const upcomingDeadlines = allOpportunities
        .filter(op => isDateBetween(op.deadline, today, nextWeek))
        .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
        .map(op => ({
            company_name: op.company_name,
            role: op.role,
            deadline: op.deadline
        }));

    return {
        ...stats,
        upcoming_deadlines: upcomingDeadlines
    };
};

const getToday = async (userId) => {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    // 1. Interviews Today
    const allApplications = await Application.find({ user_id: userId });
    const interviewsToday = [];

    for (const app of allApplications) {
        if (app.status === 'Interview' && isDateBetween(app.interview_date, startOfDay, endOfDay)) {
            // Manual Populate
            const opportunity = await Opportunity.findById(app.opportunity_id);
            interviewsToday.push({
                ...app,
                opportunity_id: {
                    _id: opportunity ? opportunity._id : null,
                    company_name: opportunity ? opportunity.company_name : 'Unknown',
                    role: opportunity ? opportunity.role : 'Unknown'
                }
            });
        }
    }

    // 2. Urgent Deadlines (within 24h)
    const now = new Date();
    const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    const allOpportunities = await Opportunity.find();
    const urgentDeadlines = allOpportunities
        .filter(op => isDateBetween(op.deadline, now, tomorrow))
        .map(op => ({
            company_name: op.company_name,
            role: op.role,
            deadline: op.deadline
        }));

    return {
        interviews_today: interviewsToday,
        urgent_deadlines: urgentDeadlines
    };
};

module.exports = {
    getSummary,
    getToday
};
