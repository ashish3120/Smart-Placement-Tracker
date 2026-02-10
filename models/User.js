const JsonDB = require('../utils/JsonDB');
const bcrypt = require('bcryptjs');

const userDB = new JsonDB('users');

class User {
    static async create(userData) {
        // Mock Mongoose pre-save hook for password
        if (userData.password) {
            const salt = await bcrypt.genSalt(10);
            userData.password = await bcrypt.hash(userData.password, salt);
        }

        // Mock Mongoose default
        if (!userData.role) userData.role = 'user';
        if (!userData.notification_preferences) {
            userData.notification_preferences = {
                deadline_alerts: true,
                interview_reminders: true
            };
        }

        return await userDB.create(userData);
    }

    static async findOne(query) {
        // JsonDB findOne returns plain object
        const user = await userDB.findOne(query);
        if (!user) return null;

        // Attach matchPassword method to plain object
        user.matchPassword = async function (enteredPassword) {
            // In JSON, password might be stored directly or we need to ensure we select it?
            // JsonDB finds everything, so password should be there.
            return await bcrypt.compare(enteredPassword, this.password);
        };

        return user;
    }

    static async findById(id) {
        const user = await userDB.findById(id);
        if (!user) return null;
        return user;
    }

    // Auth middleware uses this
    static async findById(id) {
        return await userDB.findById(id);
    }

    static async deleteMany() {
        return await userDB.deleteMany();
    }
}

module.exports = User;
