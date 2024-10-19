priority: 0

// Global Variables
//let 


// Start Game
function startGame(s) {
    
}

ItemEvents.entityInteracted("minecraft:interaction", e => {
    e.server.tell(e.entity.tags)
    e.level.spawnParticles("minecraft:wax_on", false, e.entity.x, e.entity.y, e.entity.z, .1, .1, .1, 40, 10);
    startGame(e.server);
    let player_c = e.server.playerCount;
    let guards = e.server.players.filter(p => p.tags.contains("guard"));
    e.server.tell(guards);
})