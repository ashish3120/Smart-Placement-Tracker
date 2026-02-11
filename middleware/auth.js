const config = require('../config/env');
const jwt = require('jsonwebtoken');
const ApiError = require('../utils/ApiError');
const User = require('../models/User');

const protect = async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        console.warn('[Auth] No token provided in header');
        return next(new ApiError('Not authorized to access this route', 401));
    }

    try {
        const decoded = jwt.verify(token, config.jwtSecret);
        console.log(`[Auth] Token verified for ID: ${decoded.id}`);

        const user = await User.findById(decoded.id);

        if (!user) {
            console.warn(`[Auth] User ${decoded.id} not found in DB`);
            return next(new ApiError('User not found. Please log in again.', 401));
        }

        req.user = user;
        next();
    } catch (err) {
        console.error('[Auth] Verification failed:', err.message);
        return next(new ApiError('Not authorized to access this route', 401));
    }
};

module.exports = { protect };
