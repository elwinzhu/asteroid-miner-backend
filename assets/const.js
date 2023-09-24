const MinerStatus = {
    idle: 0,
    traveling: 1,
    mining: 2,
    transferring: 3
};

const AsteroidStatus = {
    hasMineral: 1,
    depletion: 0
};

const MinerTargetType = {
    planet: "Planet",
    asteroid: "Asteroid"
};

module.exports = {
    MinerStatus, AsteroidStatus, MinerTargetType
};

//eV6pE2mUmH6NS6Ta