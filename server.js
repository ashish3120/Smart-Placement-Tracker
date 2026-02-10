const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
// const connectDB = require('./config/db'); // Removed for JSON storage
const errorHandler = require('./middleware/errorHandler');
const runJobs = require('./jobs/notificationJob');

// Load env vars
require('./config/env');

// Connect to database
// connectDB(); // Removed

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Routes
const auth = require('./routes/auth');
const dashboard = require('./routes/dashboard');
const opportunities = require('./routes/opportunities');
const applications = require('./routes/applications');
const preparation = require('./routes/preparation');

app.get('/', (req, res) => {
    res.json({ success: true, message: 'Smart Placement Tracker API is running' });
});

app.get('/health', (req, res) => {
    res.status(200).send('OK');
});

app.use('/api/auth', auth);
app.use('/api/dashboard', dashboard);
app.use('/api/opportunities', opportunities);
app.use('/api/applications', applications);
app.use('/api/preparation', preparation);

// Error Handler
app.use(errorHandler);

// Start Background Jobs
runJobs();

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
    console.log(`Storage: Local JSON files in /data directory`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`);
    // Close server & exit process
    server.close(() => process.exit(1));
});

module.exports = app; // For testing
