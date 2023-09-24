const Planet = require("./planet");
const Asteroid = require("./asteroid");
const Miner = require("./miner");
const {MinerTargetType} = require("../assets/const");

let planets = [], asteroids = [], miners = [];

async function initPlanet() {
    for (let i = 1; i <= 3; ++i) {
        let name = `Planet ${i}`;
        let planet = await (new Planet(name)).create();
        planets.push(planet);
    }
}

async function initAsteroid() {
    for (let i = 1; i <= 20; ++i) {
        let name = `Asteroid ${i}`;
        let asteroid = await (new Asteroid(name)).create();
        asteroids.push(asteroid);
    }
}

async function initMiners() {
    for (let i = 1; i <= 9; ++i) {
        let planet = planets[Math.floor(Math.random() * planets.length)];
        let name = `Miner ${i}`;
        let carryCapacity = Math.floor(Math.random() * 200) + 1;
        let travelSpeed = Math.floor(Math.random() * 200) + 1;
        let miningSpeed = Math.floor(Math.random() * 200) + 1;

        let miner = new Miner(name, planet._id, carryCapacity, travelSpeed, miningSpeed);
        planet.miners++;
        await planet.update();

        //miner should start from its belonged planet
        miner.position.x = planet.position.x;
        miner.position.y = planet.position.y;
        miner.targetType = MinerTargetType.planet;
        miner.target = planet._id;
        await miner.create();

        miners.push(miner);
    }
}

async function initData() {
    planets = [];
    asteroids = [];
    miners = [];
    await initPlanet();
    await initAsteroid();
    await initMiners();

    return {
        planets, asteroids, miners
    }
}

async function clearAll() {
    let minerCount = await Miner.deleteAll();
    let asteroidCount = await Asteroid.deleteAll();
    let planetCount = await Planet.deleteAll();

    return [minerCount, asteroidCount, planetCount];
}

module.exports = {
    clearAll, initData
};