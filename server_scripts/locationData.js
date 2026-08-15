priority: 1; // needs to be loaded before main.js 

function newNPC(x, y, z, id) {
  let npc = {
    x: x,
    y: y,
    z: z,
    id: id
  }
  return npc;
}

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
  },
  window: [
    {

    }
  ],
  difficulty: 15
} // !WARNING! - Map it unused (poorly designed/confusing layout)

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
  window: [
    {

    }
  ],
  npcs: [
    newNPC(102, -55, 58, "mechanic"),
    newNPC(74, -46, 27, "mechanic"),
    newNPC(66, -51, 40, "mechanic"),
    newNPC(82, -55, 33, "civilian"),
    newNPC(63, -51, 48, "civilian"),
    newNPC(64, -51, 48, "civilian"),
    newNPC(67, -51, 44, "civilian"),
    newNPC(61, -51, 33, "civilian"),
    newNPC(61, -51, 34, "civilian"),
    newNPC(68, -51, 28, "civilian"),
    newNPC(68, -51, 29, "civilian"),
    newNPC(65, -51, 27, "civilian"),
    newNPC(65, -51, 28, "civilian"),
    newNPC(57, -51, 29, "civilian"),
    newNPC(70, -51, 28, "civilian"),
    newNPC(70, -51, 27, "civilian"),
    newNPC(73, -51, 20, "civilian"),
    newNPC(74, -51, 20, "civilian"),
    newNPC(75, -51, 21, "civilian"),
    newNPC(75, -51, 22, "civilian"),
    newNPC(65, -51, 16, "civilian"),
    newNPC(67, -51, 16, "civilian"),
    newNPC(63, -51, 76, "civilian"),
    newNPC(62, -51, 76, "civilian")
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
  window: [
    {

    }
  ],
  difficulty: 15
}

const warehouse = {
  spawnSelection: false,
  hSpawn: {
    x: -62,
    y: -59,
    z: 612
  },
  gSpawn: {
    x: -52,
    y: -55,
    z: 741
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
  window: [
    {

    }
  ],
  difficulty: 15
}

const cubaTraining = {
  spawnSelection: false,
  hSpawn: {
    x: 0,
    y: 0,
    z: 0
  },
  gSpawn: {
    x: 0,
    y: 0,
    z: 0
  },
  condition: {
    time: "midnight",
    weather: "clear"
  },
  exit: [
    {
      x: 0,
      y: 0,
      z: 0
    }
  ],
  window: [
    {
      x: -1,
      y: -59,
      z: -81
    },
    {
      x: -3,
      y: -59,
      z: -81
    },
  ],
  difficulty: 15
}


const mapOptions = [freeformTraining, theWoods, control, cubaTraining]

// You *should* be able to put a number in for time, but no clue if it works.