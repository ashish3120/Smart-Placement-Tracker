const dotenv = require('dotenv');

dotenv.config();

module.exports = {
    port: process.env.PORT || 5000,
    mongoUri: process.env.MONGO_URI,
    jwtSecret: process.env.JWT_SECRET || 'smart_tracker_secret_fallback_123',
    jwtExpire: process.env.JWT_EXPIRE || '30d',
    env: process.env.NODE_ENV || 'development'
};
