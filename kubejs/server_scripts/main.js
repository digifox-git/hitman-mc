priority: 1

// Global Variables
//let 


// Start Game
// function startGame(s) {
    
// }


ItemEvents.entityInteracted("minecraft:interaction", e => {
    //e.server.tell(e.entity.tags)
    e.level.spawnParticles("minecraft:wax_on", false, e.target.x, e.target.y, e.target.z, .1, .1, .1, 40, 10);
    // startGame(e.server);
    // global.player_c = e.server.playerCount;
    // Get all players with right tags tag
    //let guards = e.server.players.filter(p => p.tags.contains("guard"));
    let guards = selectE(e, "guard");
    // global.hitman = selectE(e, "hitman");
    // global.target = selectE(e, "target");
    // Get spawns
    //let g_spawn = e.server.entities.filter(i => p.tags.contains("g_spawn"));
    let g_spawn = selectE(e, "g_spawn")[0]
    // global.h_spawn = selectE(e, "h_spawn")[0].pos;
    // global.g_respawn = selectE(e, "g_respawn")[0].pos;
    // global.h_respawn = selectE(e, "h_respawn")[0].pos; // Hitman doesn't respawn, but this is where they're put while target is hiding
    //Teleport players to proper places
    guards.forEach(g => g.teleportTo(g_spawn.x, g_spawn.y, g_spawn.z));
    e.server.tell(guards);
    e.server.tell(g_spawn);
})

// wheehee hoohoo blop glop eevents

ServerEvents.recipes(event => {
    event.smelting('minecraft:dead_fire_coral', 'minecraft:fire_coral')
})

ItemEvents.rightClicked('minecraft:dead_fire_coral', e => {
    let pos = player.position;
    let x = pos.x;
    let y = pos.y;
    let z = pos.z;
    e.level.tell(Component.red(`KILL ${e.player.username} NOW!!!`));
    e.level.getBlock(x,y,z).createEntity("minecraft:lightning_bolt")
    
})