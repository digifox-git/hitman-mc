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
  exit: [
    {
      x: -52.3,
      y: -58.5,
      z: 146.5
    }
  ],
  difficulty: 15 
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
  exit: [
    {
      x: 57.5,
      y: -55,
      z: 10.5
    },
    {
      x: 93.5,
      y: -54,
      z: 11.5
    },
    {
      x: 69.5,
      y: -42,
      z: 39.5
    }
  ],
  difficulty: 15 
}

const control = {
  spawnSelection: false,
  hSpawn: {
    x: -115,
    y: 21,
    z: -350
  },
  gSpawn: {
    x: -123,
    y: 57,
    z: -343
  },
  condition: {
    time: "day",
    weather: "clear"
  },
  exit: [
    {
      x: -122,
      y: 46,
      z: -245
    }
  ],
  difficulty: 15 
}


const mapOptions = [freeformTraining, theWoods, control]

// You *should* be able to put a number in for time, but no clue if it works.