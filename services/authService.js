const User = require('../models/User');
const ApiError = require('../utils/ApiError');

const register = async (userData) => {
    const { name, email, password } = userData;

    const userExists = await User.findOne({ email });

    if (userExists) {
        throw new ApiError('User already exists', 400);
    }

    // User model handles hashing now in static create method mock
    const user = await User.create({
        name,
        email,
        password
    });

    return user;
};

const login = async (email, password) => {
    // Validate email & password
    if (!email || !password) {
        throw new ApiError('Please provide an email and password', 400);
    }

    // Check for user
    // JsonDB findOne returns the object with password if it exists in the file
    const user = await User.findOne({ email });

    if (!user) {
        throw new ApiError('Invalid credentials', 401);
    }

    // Check if password matches
    // We attached matchPassword to the object returned by User.findOne
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
        throw new ApiError('Invalid credentials', 401);
    }

    return user;
};

const updateUser = async (userId, data) => {
    const user = await User.findByIdAndUpdate(userId, data);
    if (!user) {
        throw new ApiError('User not found', 404);
    }
    return user;
};

module.exports = {
    register,
    login,
    updateUser
};
