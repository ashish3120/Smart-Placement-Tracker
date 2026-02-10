const JsonDB = require('../utils/JsonDB');

const preparationDB = new JsonDB('preparation');

class Preparation {
    static async create(data) {
        return await preparationDB.create(data);
    }

    static async findOne(query) {
        return await preparationDB.findOne(query);
    }

    static async findOneAndUpdate(query, data, options) {
        // JsonDB doesn't have native updateOne/findOneAndUpdate based on query
        // Find ID first
        const item = await preparationDB.findOne(query);
        if (!item) return null;

        return await preparationDB.findByIdAndUpdate(item._id, data);
    }

    static async deleteMany() {
        return await preparationDB.deleteMany();
    }
}

module.exports = Preparation;
