const {dbo, ObjectId} = require("./index");
const collection = dbo.collection("planet");

class Planet {
    constructor(name) {
        this._id = undefined;
        this.name = name;
        this.minerals = 0; //current storage
        this.position = {
            x: Math.floor(Math.random() * 1000),
            y: Math.floor(Math.random() * 1000)
        };

        this.miners = 0;
    }

    static from(obj) {
        let planet = new Planet(obj.name);
        planet.position = obj.position;
        planet.minerals = obj.minerals;
        planet.miners = obj.miners;
        if (obj._id) {
            planet._id = obj._id.toString();
        }


        return planet;
    }

    value(includeId = false) {
        let myValue = {
            name: this.name,
            position: {
                x: parseInt(this.position.x),
                y: parseInt(this.position.y)
            },
            //current storage
            minerals: this.minerals,
            miners: this.miners
        };

        if (includeId && this._id) {
            myValue._id = this._id;
        }
        return myValue;
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
                return Planet.from(result[0]);
        }).catch(err => ({err}));
    }

    static async getOneRandom() {
        return await collection.aggregate([
            {$sample: {size: 1}}
        ]).toArray().then(result => {
            if (result)
                return Planet.from(result[0]);
        }).catch(err => ({err}));
    }

    static async getAll() {
        return await collection.find({}).toArray().then(result => {
            if (result)
                return result;
        }).catch(err => ({err}));
    }

    static async minerCreated(id) {
        return await collection.updateOne({_id: new ObjectId(id)}, {
            $inc: {
                minerals: -1000,
                miners: 1
            }
        }).then(result => {
            if (result && result.acknowledged) {
                return result.modifiedCount;
            }
            return null;
        }).catch(err => ({err}));
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
                return {err: "update planet, id required"};

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

module.exports = Planet;