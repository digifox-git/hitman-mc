priority: 0;

class Location {
    constructor(spawnSelection, hitmanSpawns, guardSpawns) {
      this.spawnSelection = spawnSelection;
      this.hitmanSpawns = hitmanSpawns;
      this.guardSpawns = guardSpawns;
    }
}

const theWoods = new Location(false, [176,-60,209], [-97.5,-57,134]);
const freeformTraining = new Location(false,[101,-55,20],[58,-56,26]);

const mapOptions = [theWoods, freeformTraining]