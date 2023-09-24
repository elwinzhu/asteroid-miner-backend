const Planet = require("../db/planet");

async function getAllPlanets(req, res, next) {
    let result = await Planet.getAll();
    if (result && result.err) {
        res.status(500).send(result.err);
        return;
    }
    res.status(200).send(result);
}

async function createPlanet(req, res, next) {
    let planet = Planet.from(req.body);
    let result = await planet.create();
    if (result && result.err) {
        res.status(500).send(result.err);
        return;
    }
    res.status(200).send(result);
}

async function getOnePlanet(req, res, next) {
    let id = req.params.id;
    let result = await Planet.getOne(id);
    if (result && result.err) {
        res.status(500).send(result.err);
        return;
    }
    res.status(200).send(result);
}

async function updateOnePlanet(req, res, next) {
    let body = req.body;
    if (!body._id) {
        body._id = req.params.id;
    }
    let planet = Planet.from(body);
    let result = await planet.update();
    if (result && result.err) {
        res.status(500).send(result.err);
        return;
    }
    res.status(200).send({modifiedCount: result});
}

async function deleteOnePlanet(req, res, next) {
    let id = req.params.id;
    let result = await Planet.deleteOne(id);
    if (result && result.err) {
        res.status(500).send(result.err);
        return;
    }
    res.status(200).send({deletedCount: result});
}

module.exports = {
    getAllPlanets, createPlanet, getOnePlanet,
    updateOnePlanet, deleteOnePlanet
};