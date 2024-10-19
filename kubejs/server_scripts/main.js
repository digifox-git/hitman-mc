priority: 1

// Global Variables
//let 


// Start Game
function startGame(s) {
    
}


ItemEvents.entityInteracted("minecraft:interaction", e => {
    e.server.tell(e.entity.tags)
    e.level.spawnParticles("minecraft:wax_on", false, e.target.x, e.target.y, e.target.z, .1, .1, .1, 40, 10);
    startGame(e.server);
    global.player_c = e.server.playerCount;
    // Get all players with right tags tag
    let guards = e.server.entities.filter(p => p.tags.contains("guard"));
    //global.guards = selectE(e, "guard");
    global.hitman = selectE(e, "hitman");
    global.target = selectE(e, "target");
    // Get spawns
    global.g_spawn = selectE(e, "g_spawn")[0].pos;
    global.h_spawn = selectE(e, "h_spawn")[0].pos;
    global.g_respawn = selectE(e, "g_respawn")[0].pos;
    global.h_respawn = selectE(e, "h_respawn")[0].pos; // Hitman doesn't respawn, but this is where they're put while target is hiding
    //Teleport players to proper places
    global.guards.forEach(g => g.teleportTo(global.g_spawn));
    e.server.tell(guards[0].name);
    e.server.tell(global.g_spawn);
})