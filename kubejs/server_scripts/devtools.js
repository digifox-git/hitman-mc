priority: 10

/**
 * Hopefully at some point these
 * will be commands
 */

ItemEvents.rightClicked("minecraft:nether_star", e => {
    let kits = JsonIO.read("kubejs/game_data/kits.json");
    // Save Kits
    if (e.player.isCrouching()) {

    }
    // Load Kits
    else {
        e.server.tell(kits);
    }
})