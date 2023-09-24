const {clearAll, initData} = require("./db/init-data");
const {MinerTargetType, MinerStatus, AsteroidStatus} = require("./assets/const");
const Planet = require("./db/planet");
const Miner = require("./db/miner");
const Asteroid = require("./db/asteroid");


let timer, tick = 1;
let planets, asteroids, miners;

const infiniteLoop = async function (io) {
    clearTimeout(timer);

    //do sth.
    for (let miner of miners) {
        await processsMiner(miner)
    }
    //console.log('tick: ', tick);
    io.emit("tick", {
        planets,
        asteroids,
        miners,
        currentTick: tick
    });
    //--------------------------

    //next tick
    tick++;
    if (tick >= 361) {
        tick = 1;
        await run(io);
    }

    timer = setTimeout(infiniteLoop, 1000, io);
};

async function newRound() {
    planets = asteroids = miners = null;
    let [minerCount, asteroidCount, planetCount] = await clearAll();
    let data = await initData();
    planets = data.planets;
    asteroids = data.asteroids;
    miners = data.miners;
}

async function run(io) {
    await newRound();
    await infiniteLoop(io).catch(err => {
        console.log(err);
        //process.exit();
    });
}

//--------------------------------------------------------
const randomIndex = (length) => {
    return Math.floor(Math.random() * length);
};

async function processsMiner(miner) {
    let status = miner.status;
    if (status === MinerStatus.idle) {
        startTravelToAsteroid(miner);
    }
    else if (status === MinerStatus.traveling) {
        if (miner.targetType === MinerTargetType.asteroid) {
            travelingToAsteroid(miner);
        }
        else {
            travelingToPlanet(miner);
        }
    }
    else if (status === MinerStatus.mining) {
        let asteroid = mining(miner);
        asteroid && (await asteroid.update());
    }
    else if (status === MinerStatus.transferring) {
        let planet = transferringMinerals(miner);
        planet && (await planet.update());
    }

    await miner.update();
}

function startTravelToAsteroid(miner) {
    //pick a random asteroid, of which the current minerals should be gt 0
    let temp = asteroids.filter(x => x.currentMinerals > 0);
    if (temp.length === 0)
        return false;

    let asteroid = temp[randomIndex(temp.length)];
    miner.targetType = MinerTargetType.asteroid;
    miner.target = asteroid._id;
    miner.status = MinerStatus.traveling;

    let asteroidPos = asteroid.position;
    miner.angle = Math.atan2(asteroidPos.y - miner.position.y,
        asteroidPos.x - miner.position.x);

    return asteroid;
}

function travelingToAsteroid(miner, targetAsteroid = null) {
    if (!targetAsteroid) {
        targetAsteroid = asteroids.find(x => x._id === miner.target);
    }

    let distanceY = targetAsteroid.position.y - miner.position.y,
        distanceX = targetAsteroid.position.x - miner.position.x;
    let distance = Math.sqrt(distanceX ** 2 + distanceY ** 2);

    if (distance < miner.travelSpeed) {
        //arrived at the target
        miner.position.x = targetAsteroid.position.x;
        miner.position.y = targetAsteroid.position.y;
        miner.angle = 0;
        miner.status = MinerStatus.mining;
        //no change to target
    }
    else {
        miner.position.x += Math.cos(miner.angle) * miner.travelSpeed;
        miner.position.y += Math.sin(miner.angle) * miner.travelSpeed;
        //no change to angle and target and status, still traveling
    }
}

function mining(miner) {
    let targetAsteroid = asteroids.find(x => x._id === miner.target);

    //check the remaining minerals, and current capacity
    if (targetAsteroid.currentMinerals <= 0 || miner.minerals >= miner.carryCapacity) {
        //go back to original planet
        startTravelToPlanet(miner);
    }
    else {
        //do mining, determine the amount to carry
        let restCapacity = miner.carryCapacity - miner.minerals;
        let amount = Math.min(restCapacity, miner.miningSpeed, targetAsteroid.currentMinerals);

        targetAsteroid.currentMinerals -= amount;
        miner.minerals += amount;

        if (targetAsteroid.currentMinerals <= 0) {
            targetAsteroid.status = AsteroidStatus.depletion;
            startTravelToPlanet(miner);
        }

        //else, continue mining
        return targetAsteroid;
    }
}

function startTravelToPlanet(miner) {
    let planet = planets.find(x => x._id === miner.planet);
    miner.targetType = MinerTargetType.planet;
    miner.target = miner.planet;
    miner.status = MinerStatus.traveling;

    let planetPos = planet.position;
    miner.angle = Math.atan2(planetPos.y - miner.position.y,
        planetPos.x - miner.position.x);

    return planet
}

function travelingToPlanet(miner, planet = null) {
    if (!planet) {
        planet = planets.find(x => x._id === miner.target);
    }

    let distanceY = planet.position.y - miner.position.y,
        distanceX = planet.position.x - miner.position.x;
    let distance = Math.sqrt(distanceX ** 2 + distanceY ** 2);

    if (distance < miner.travelSpeed) {
        //arrived at the planet
        miner.position.x = planet.position.x;
        miner.position.y = planet.position.y;
        miner.angle = 0;
        miner.status = MinerStatus.transferring;
        //no change to target
    }
    else {
        miner.position.x += Math.cos(miner.angle) * miner.travelSpeed;
        miner.position.y += Math.sin(miner.angle) * miner.travelSpeed;
        //no change to angle and target and status, still traveling
    }
}

function transferringMinerals(miner) {
    let planet = planets.find(x => x._id === miner.planet);

    planet.minerals += miner.minerals;
    miner.minerals = 0;
    miner.status = MinerStatus.idle;

    return planet;
}

//the data returned to websocket response is actually maintained
//in the 3 lists instead of querying db each second
//but it might be updated due to the REST Api
//so provide this method to query data from db when api call occurs
async function queryData({updatePlanets, updateAsteroids, updateMiners}) {
    if (updatePlanets) {
        planets = (await Planet.getAll()).map(x => Planet.from(x));
    }
    if (updateAsteroids) {
        asteroids = (await Asteroid.getAll()).map(x => Asteroid.from(x));
    }
    if (updateMiners) {
        miners = (await Miner.getAll()).map(x => Miner.from(x));
    }
}

module.exports = {
    run, queryData
};