const dotenv = require('dotenv');
// const connectDB = require('./config/db'); // Removed
const User = require('./models/User');
const Opportunity = require('./models/Opportunity');
const Application = require('./models/Application');
const Preparation = require('./models/Preparation');
const fs = require('fs');
const path = require('path');

// Load env vars
dotenv.config();

const importData = async () => {
    try {
        // Clear DB (Delete JSON files)
        const dataDir = path.join(__dirname, 'data');
        if (fs.existsSync(dataDir)) {
            const files = fs.readdirSync(dataDir);
            for (const file of files) {
                fs.unlinkSync(path.join(dataDir, file));
            }
        }
        console.log('Data Destroyed (JSON files cleared)...');

        // 1. Create Users
        const user1 = await User.create({
            name: 'Ashish Student',
            email: 'ashish@example.com',
            password: 'password123',
            role: 'user',
            notification_preferences: {
                deadline_alerts: true,
                interview_reminders: true
            }
        });

        const user2 = await User.create({
            name: 'John Doe',
            email: 'john@example.com',
            password: 'password123',
            role: 'user'
        });

        console.log('Users Created...');

        // 2. Create Opportunities
        const opportunities = [];
        const oppData = [
            {
                company_name: 'Google',
                role: 'Software Engineer Intern',
                ctc: '12 LPA',
                eligibility: 'CGPA > 8.0, CSE/IT',
                deadline: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now (Urgent)
                created_by: user1._id
            },
            {
                company_name: 'Microsoft',
                role: 'SDE-1',
                ctc: '45 LPA',
                eligibility: 'CGPA > 7.5, All Branches',
                deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
                created_by: user1._id
            },
            {
                company_name: 'Amazon',
                role: 'Cloud Support Associate',
                ctc: '18 LPA',
                eligibility: 'Any Graduate',
                deadline: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // Expired
                created_by: user1._id
            },
            {
                company_name: 'Flipkart',
                role: 'SDE Intern',
                ctc: '32 LPA',
                eligibility: 'CGPA > 8.0',
                deadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
                created_by: user1._id
            },
            {
                company_name: 'Atlassian',
                role: 'Product Manager',
                ctc: '50 LPA',
                eligibility: 'MBA/B.Tech',
                deadline: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // 1 day
                created_by: user2._id
            }
        ];

        for (const op of oppData) {
            opportunities.push(await Opportunity.create(op));
        }

        console.log('Opportunities Created...');

        // 3. Create Applications
        const appsData = [
            {
                user_id: user1._id,
                opportunity_id: opportunities[0]._id, // Google
                status: 'Applied'
            },
            {
                user_id: user1._id,
                opportunity_id: opportunities[1]._id, // Microsoft
                status: 'Interview',
                interview_date: new Date(Date.now() + 4 * 60 * 60 * 1000) // Today, 4 hours from now
            },
            {
                user_id: user1._id,
                opportunity_id: opportunities[2]._id, // Amazon (Deadline passed)
                status: 'Rejected'
            },
            {
                user_id: user1._id,
                opportunity_id: opportunities[3]._id, // Flipkart
                status: 'Selected'
            }
        ];

        for (const app of appsData) {
            await Application.create(app);
        }

        console.log('Applications Created...');

        // 4. Create Preparation
        await Preparation.create({
            user_id: user1._id,
            opportunity_id: opportunities[1]._id,
            checklist_items: [
                { title: 'Research Company', completed: true },
                { title: 'Review Job Description', completed: true },
                { title: 'Prepare Resume', completed: false },
                { title: 'Practice Common Interview Questions', completed: false }
            ],
            notes: 'Microsoft focuses on DSA strings and arrays.'
        });

        console.log('Preparation Data Created...');

        console.log('Data Imported Successfully!');
        process.exit();

    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

importData();
