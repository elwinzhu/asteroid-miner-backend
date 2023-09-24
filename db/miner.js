const {dbo, ObjectId} = require("./index");
const collection = dbo.collection("miner");
const {MinerStatus} = require("../assets/const");

class Miner {
    constructor(name, planetId, carryCapacity, travelSpeed, miningSpeed) {
        this._id = undefined;
        this.name = name;

        this.carryCapacity = carryCapacity;
        this.travelSpeed = travelSpeed;
        this.miningSpeed = miningSpeed;
        this.planet = planetId;

        //should be set when created
        this.position = {
            x: Math.floor(Math.random() * 1000),
            y: Math.floor(Math.random() * 1000)
        };
        this.angle = 0;

        this.status = MinerStatus.idle;
        this.minerals = 0; //current carriage

        this.target = null;
        this.targetType = null;
    }

    static from(obj) {
        let miner = new Miner(obj.name, obj.planet, obj.carryCapacity, obj.travelSpeed, obj.miningSpeed);
        miner.position = obj.position;
        miner.angle = obj.angle;
        miner.minerals = obj.minerals;
        miner.status = obj.status;
        miner.target = obj.target;
        miner.targetType = obj.targetType;
        if (obj._id){
            miner._id = obj._id.toString();
        }

        return miner;
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
                return Miner.from(result[0]);
        }).catch(err => ({err}));
    }

    static async getOneRandom() {
        return await collection.aggregate([
            {$sample: {size: 1}}
        ]).toArray().then(result => {
            if (result)
                return Miner.from(result[0]);
        }).catch(err => ({err}));
    }

    static async getAll() {
        return await collection.find({}).toArray().then(result => {
            if (result)
                return result;
        }).catch(err => ({err}));
    }

    static async getListByPlanet(planetId){
        return await collection.find({planet: planetId}).toArray().then(result => {
            if (result)
                return result;
        }).catch(err => ({err}));
    }

    value(includeId = false) {
        let myValue = {
            name: this.name,
            planet: this.planet,
            position: {
                x: parseInt(this.position.x),
                y: parseInt(this.position.y)
            },
            angle: this.angle,
            carryCapacity: this.carryCapacity,
            travelSpeed: this.travelSpeed,
            miningSpeed: this.miningSpeed,
            status: this.status,
            //current carriage
            minerals: this.minerals,

            target: this.target,
            targetType: this.targetType
        };

        if (includeId && this._id) {
            myValue._id = this._id;
        }
        return myValue;
    }

    async create() {
        if (!this.target || !this.targetType) {
            return {err: "insufficient data"};
        }

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
                return {err: "update miner, id required"};

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

module.exports = Miner;