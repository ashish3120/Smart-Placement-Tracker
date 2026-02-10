const fs = require('fs');
const path = require('path');

class JsonDB {
    constructor(filename) {
        this.filename = filename;
        this.filePath = path.join(__dirname, '..', 'data', `${filename}.json`);
        this.data = [];
        this.load();
    }

    load() {
        const dataDir = path.join(__dirname, '..', 'data');
        if (!fs.existsSync(dataDir)) {
            fs.mkdirSync(dataDir, { recursive: true });
        }
        if (fs.existsSync(this.filePath)) {
            try {
                const content = fs.readFileSync(this.filePath, 'utf-8');
                this.data = content ? JSON.parse(content) : [];
            } catch (err) {
                console.error(`Error loading ${this.filename}:`, err);
                this.data = [];
            }
        } else {
            this.save();
        }
    }

    save() {
        try {
            const dataDir = path.join(__dirname, '..', 'data');
            if (!fs.existsSync(dataDir)) {
                fs.mkdirSync(dataDir, { recursive: true });
            }
            fs.writeFileSync(this.filePath, JSON.stringify(this.data, null, 2));
        } catch (err) {
            console.error(`Error saving ${this.filename}:`, err);
        }
    }

    async create(item) {
        const newItem = {
            _id: Date.now().toString(),
            createdAt: new Date(),
            ...item
        };
        this.data.push(newItem);
        this.save();
        return newItem;
    }

    async find(query = {}) {
        return this.data.filter(item => {
            for (let key in query) {
                // Handle special operators if needed, currently supporting direct match & $gte/$lte for Dates
                if (typeof query[key] === 'object' && query[key] !== null) {
                    if (query[key].$gte && new Date(item[key]) < new Date(query[key].$gte)) return false;
                    if (query[key].$lte && new Date(item[key]) > new Date(query[key].$lte)) return false;
                } else if (item[key] !== query[key]) {
                    return false;
                }
            }
            return true;
        }).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    async findOne(query) {
        const results = await this.find(query);
        return results.length > 0 ? results[0] : null;
    }

    async findById(id) {
        return this.data.find(item => item._id === id);
    }

    async findByIdAndUpdate(id, update, options = {}) {
        const index = this.data.findIndex(item => item._id === id);
        if (index === -1) return null;

        const updatedItem = { ...this.data[index], ...update, last_updated: new Date() };
        this.data[index] = updatedItem;
        this.save();
        return updatedItem;
    }

    async deleteMany() {
        this.data = [];
        this.save();
    }

    // Helper to simulate populate (not perfect, requires manual mapping in services usually)
    // But for 'find' operations we can map globally if needed. 
    // Usually easier to handle in service.
}

module.exports = JsonDB;
