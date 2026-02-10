const JsonDB = require('../utils/JsonDB');

const opportunityDB = new JsonDB('opportunities');

class Opportunity {
    static async create(data) {
        // Ensure date objects
        if (data.deadline) data.deadline = new Date(data.deadline);
        return await opportunityDB.create(data);
    }

    static async find(query) {
        return await opportunityDB.find(query);
    }

    static async findById(id) {
        return await opportunityDB.findById(id);
    }

    static async findByIdAndUpdate(id, data, options) {
        if (data.deadline) data.deadline = new Date(data.deadline);
        return await opportunityDB.findByIdAndUpdate(id, data);
    }

    static async deleteMany() {
        return await opportunityDB.deleteMany();
    }
}

module.exports = Opportunity;
