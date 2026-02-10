const cron = require('node-cron');
const Opportunity = require('../models/Opportunity');
const Application = require('../models/Application');
const User = require('../models/User');

const runJobs = () => {
    // Run every hour
    cron.schedule('0 * * * *', async () => {
        console.log('Running notification checks...');

        try {
            // 1. Check for upcoming deadlines (within 48 hours)
            const now = new Date();
            const warningTime = new Date(now.getTime() + 48 * 60 * 60 * 1000);

            const allOpportunities = await Opportunity.find();
            const expiringOpportunities = allOpportunities.filter(op => {
                const d = new Date(op.deadline);
                return d >= now && d <= warningTime;
            });

            if (expiringOpportunities.length > 0) {
                console.log(`[ALERT] ${expiringOpportunities.length} opportunities expiring soon!`);
                expiringOpportunities.forEach(opp => {
                    console.log(` - ${opp.company_name} (${opp.role}) expires at ${opp.deadline}`);
                });
            }

            // 2. Check for interviews today
            const startOfDay = new Date();
            startOfDay.setHours(0, 0, 0, 0);

            const endOfDay = new Date();
            endOfDay.setHours(23, 59, 59, 999);

            const allApps = await Application.find();
            const todaysInterviews = allApps.filter(app => {
                if (app.status !== 'Interview') return false;
                const d = new Date(app.interview_date);
                return d >= startOfDay && d <= endOfDay;
            });

            if (todaysInterviews.length > 0) {
                console.log(`[REMINDER] ${todaysInterviews.length} interviews scheduled for today!`);

                // Manual populate loop
                for (const app of todaysInterviews) {
                    const user = await User.findById(app.user_id);
                    const opportunity = await Opportunity.findById(app.opportunity_id);

                    console.log(` - User: ${user ? user.name : 'Unknown'}, Company: ${opportunity ? opportunity.company_name : 'Unknown'}, Time: ${app.interview_date}`);
                }
            }

        } catch (error) {
            console.error('Error running notification jobs:', error);
        }
    });
};

module.exports = runJobs;
