const Miner = require("../db/miner");
const Planet = require("../db/planet");
const {queryData} = require("../mine-asteroids");

async function getAllMiners(req, res, next) {
    let {planetId} = req.query;
    let result = planetId ? (await Miner.getListByPlanet(planetId)) : (await Miner.getAll());
    if (result && result.err) {
        res.status(500).send(result.err);
        return;
    }
    res.status(200).send(result);
}

async function createMiner(req, res, next) {
    let miner = Miner.from(req.body);
    let result = await miner.create();

    //substract the resource from this planet
    await Planet.minerCreated(miner.planet);
    await queryData({updatePlanets: true, updateMiners: true});

    if (result && result.err) {
        res.status(500).send(result.err);
        return;
    }
    res.status(200).send(result);
}

async function getOneMiner(req, res, next) {
    let id = req.params.id;
    let result = await Miner.getOne(id);
    if (result && result.err) {
        res.status(500).send(result.err);
        return;
    }
    res.status(200).send(result);
}

async function updateOneMiner(req, res, next) {
    let body = req.body;
    if (!body._id) {
        body._id = req.params.id;
    }
    let miner = Miner.from(body);
    let result = await miner.update();
    if (result && result.err) {
        res.status(500).send(result.err);
        return;
    }
    res.status(200).send({modifiedCount: result});
}

async function deleteOneMiner(req, res, next) {
    let id = req.params.id;
    let result = await Miner.deleteOne(id);
    if (result && result.err) {
        res.status(500).send(result.err);
        return;
    }
    res.status(200).send({deletedCount: result});
}

module.exports = {
    getAllMiners, createMiner, getOneMiner,
    updateOneMiner, deleteOneMiner
};