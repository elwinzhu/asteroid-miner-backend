const Asteroid = require("../db/asteroid");

async function getAllAsteroids(req, res, next) {
    let result = await Asteroid.getAll();
    if (result && result.err) {
        res.status(500).send(result.err);
        return;
    }
    res.status(200).send(result);
}

async function createAsteroid(req, res, next) {
    let asteroid = Asteroid.from(req.body);
    let result = await asteroid.create();
    if (result && result.err) {
        res.status(500).send(result.err);
        return;
    }
    res.status(200).send(result);
}

async function getOneAsteroid(req, res, next) {
    let id = req.params.id;
    let result = await Asteroid.getOne(id);
    if (result && result.err) {
        res.status(500).send(result.err);
        return;
    }
    res.status(200).send(result);
}

async function updateOneAsteroid(req, res, next) {
    let body = req.body;
    if (!body._id) {
        body._id = req.params.id;
    }
    let asteroid = Asteroid.from(body);
    let result = await asteroid.update();
    if (result && result.err) {
        res.status(500).send(result.err);
        return;
    }
    res.status(200).send({modifiedCount: result});
}

async function deleteOneAsteroid(req, res, next) {
    let id = req.params.id;
    let result = await Asteroid.deleteOne(id);
    if (result && result.err) {
        res.status(500).send(result.err);
        return;
    }
    res.status(200).send({deletedCount: result});
}

module.exports = {
    getAllAsteroids, createAsteroid, getOneAsteroid,
    updateOneAsteroid, deleteOneAsteroid
};