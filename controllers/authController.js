const config = require('../config/env');
const authService = require('../services/authService');
const jwt = require('jsonwebtoken');

// Generate JWT
const generateToken = (id) => {
    const secret = config.jwtSecret || 'temporary_hackathon_secret_123';
    const expire = '30d';

    return jwt.sign({ id }, secret, {
        expiresIn: expire
    });
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res, next) => {
    try {
        const user = await authService.register(req.body);

        const token = generateToken(user._id);

        res.status(201).json({
            success: true,
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const user = await authService.login(email, password);

        const token = generateToken(user._id);

        res.status(200).json({
            success: true,
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res, next) => {
    try {
        const user = await req.user;

        res.status(200).json({
            success: true,
            data: user
        });
    } catch (err) {
        next(err);
    }
};


module.exports = {
    register,
    login,
    getMe
};
