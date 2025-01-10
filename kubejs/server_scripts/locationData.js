priority: 1; // needs to be loaded before main.js 

const theWoods = {
  spawnSelection: false,
  hSpawn: {
    x: -176,
    y: -60,
    z: 209
  },
  gSpawn: {
    x: -97.5,
    y: -57,
    z: 134
  },
  condition: {
    time: "midnight",
    weather: "rain"
  },
  exit: {
    x: -52.3,
    y: -58.5,
    z: 146.5
  }
}

const freeformTraining = {
  spawnSelection: false,
  hSpawn: {
    x: 101,
    y: -55,
    z: 20
  },
  gSpawn: {
    x: 58,
    y: -56,
    z: 26
  },
  condition: {
    time: "day",
    weather: "clear"
  },
  exit: {
    x: 55.5,
    y: -55,
    z: 11.5
  }
}

const control = {
  spawnSelection: false,
  hSpawn: {
    x: -122,
    y: 45,
    z: -245
  },
  gSpawn: {
    x: 0,
    y: 0,
    z: 0
  },
  condition: {
    time: "day",
    weather: "clear"
  },
  exit: {
    x: 0,
    y: 0,
    z: 0
  }
}


const mapOptions = [freeformTraining, theWoods, control]

// You *should* be able to put a number in for time, but no clue if it works.