const express = require('express');
const router = express.Router();

const planet = require("../handlers/planet");
const asteroid = require("../handlers/asteroid");
const miner = require("../handlers/miner");

router.get("/", function(req, res, next){
    res.status(200).send({ok: true, name: "asteroid-miner-server"});
});

router.get('/planets', planet.getAllPlanets);
router.post('/planets', planet.createPlanet);
router.get('/planets/:id', planet.getOnePlanet);
router.put('/planets/:id', planet.updateOnePlanet);
router.delete('/planets/:id', planet.deleteOnePlanet);

router.get('/asteroids', asteroid.getAllAsteroids);
router.post('/asteroids', asteroid.createAsteroid);
router.get('/asteroids/:id', asteroid.getOneAsteroid);
router.put('/asteroids/:id', asteroid.updateOneAsteroid);
router.delete('/asteroids/:id', asteroid.deleteOneAsteroid);

router.get('/miners', miner.getAllMiners);
router.post('/miners', miner.createMiner);
router.get('/miners/:id', miner.getOneMiner);
router.put('/miners/:id', miner.updateOneMiner);
router.delete('/miners/:id', miner.deleteOneMiner);


module.exports = router;