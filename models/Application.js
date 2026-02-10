const JsonDB = require('../utils/JsonDB');

const applicationDB = new JsonDB('applications');

class Application {
    static async create(data) {
        return await applicationDB.create(data);
    }

    static async find(query) {
        return await applicationDB.find(query);
    }

    static async findOne(query) {
        return await applicationDB.findOne(query);
    }

    static async findById(id) {
        return await applicationDB.findById(id);
    }

    static async findByIdAndUpdate(id, data, options) {
        return await applicationDB.findByIdAndUpdate(id, data);
    }

    static async aggregate(pipeline) {
        // Simple manual aggregation for specific use case (Dashboard summary)
        // Pipeline[0] = $match, Pipeline[1] = $group

        const allData = await applicationDB.find();

        let filtered = allData;

        // 1. Match
        const matchStage = pipeline.find(stage => stage.$match);
        if (matchStage) {
            const matchQuery = matchStage.$match;
            filtered = filtered.filter(item => item.user_id === matchQuery.user_id);
        }

        // 2. Group (Only handling simple count group by field)
        const groupStage = pipeline.find(stage => stage.$group);
        if (groupStage) {
            const groupByField = groupStage.$group._id.replace('$', ''); // e.g. 'status'

            const groups = {};
            filtered.forEach(item => {
                const key = item[groupByField];
                if (!groups[key]) groups[key] = 0;
                groups[key]++;
            });

            return Object.keys(groups).map(key => ({ _id: key, count: groups[key] }));
        }

        return filtered;
    }

    static async deleteMany() {
        return await applicationDB.deleteMany();
    }
}

module.exports = Application;
