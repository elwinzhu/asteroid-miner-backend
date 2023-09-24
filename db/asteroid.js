const {dbo, ObjectId} = require("./index");
const collection = dbo.collection("asteroid");
const {AsteroidStatus} = require("../assets/const");

class Asteroid {
    constructor(name) {
        this.name = name;
        this.position = {
            x: Math.floor(Math.random() * 1000),
            y: Math.floor(Math.random() * 1000)
        };
        this.status = AsteroidStatus.hasMineral;
        this.currentMinerals = this.initMinerals = Math.floor(Math.random() * 401) + 800;
        this._id = undefined;
    }

    static from(obj) {
        let asteroid = new Asteroid(obj.name);
        asteroid.position = obj.position;
        asteroid.status = obj.status;
        asteroid.initMinerals = obj.initMinerals;
        asteroid.currentMinerals = obj.currentMinerals;
        if (obj._id){
            asteroid._id = obj._id.toString();
        }

        return asteroid;
    }

    static async deleteOne(id) {
        return await collection.deleteOne({_id: new ObjectId(id)}).then(result => {
            if (result && result.acknowledged) {
                return result.deletedCount;
            }
            return null;
        }).catch(err => ({err}));
    }

    static async deleteAll() {
        return await collection.deleteMany({}).then(result => {
            if (result && result.acknowledged)
                return result.deletedCount;
        }).catch(err => ({err}));
    }

    static async getOne(id) {
        return await collection.find({_id: new ObjectId(id)}).toArray().then(result => {
            if (result)
                return Asteroid.from(result[0]);   //one Asteroid instance
        }).catch(err => ({err}));
    }

    static async getRandomWithMinerals() {
        return await collection.aggregate([
            {$match: {currentMinerals: {$gt: 0}}},
            {$sample: {size: 1}}
        ]).toArray().then(result => {
            if (result)
                return Asteroid.from(result[0]);
        }).catch(err => ({err}));
    }

    static async getAll() {
        return await collection.find({}).toArray().then(result => {
            if (result)
                return result;
        }).catch(err => ({err}));
    }

    value(includeId = false) {
        let myValue = {
            name: this.name,
            position: {
                x: parseInt(this.position.x),
                y: parseInt(this.position.y)
            },
            status: this.status,

            // current remaining minerals
            currentMinerals: this.currentMinerals,
            // init minerals
            initMinerals: this.initMinerals
        };

        if (includeId && this._id) {
            myValue._id = this._id;
        }
        return myValue;
    }

    async create() {
        return collection.insertOne(this.value())
            .then(result => {
                if (result && result.acknowledged) {
                    this._id = result.insertedId.toString();
                    return this;
                }
                return null;
            }).catch(err => ({err}));
    }

    async update(id = null) {
        let ido;
        if (!id) {
            if (!this._id)
                return {err: "update asteroid, id required"};

            ido = new ObjectId(this._id);
        }
        else {
            ido = new ObjectId(id);
        }

        return await collection.updateOne({_id: ido}, {$set: this.value()}).then(result => {
            if (result && result.acknowledged) {
                return result.modifiedCount;
            }
            return null;
        }).catch(err => ({err}));
    }
}

module.exports = Asteroid;
