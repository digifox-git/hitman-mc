priority: 1;
// Global Variables
//let 
// Start Game
function startGame(s) {
    global.isGaming = true;
    s.runCommandSilent(`spawnpoint @a[tag=guard] ${global.g_respawn.x} ${global.g_respawn.y} ${global.g_respawn.z}`);
    s.tell("starting game");
    // global.player_c = s.playerCount;
    // Get all players with right tags tag
    //let guards = s.players.filter(p => p.tags.contains("guard"));
    global.guards = selectE(e, "guard");
    //global.hitman = selectE(e, "hitman");
    // global.target = selectE(e, "target");
    // Get spawns
    //let g_spawn = s.entities.filter(i => p.tags.contains("g_spawn"));
    global.g_spawn = selectE(e, "g_spawn")[0];
    // global.h_spawn = selectE(e, "h_spawn")[0].pos;
    global.g_respawn = selectE(e, "g_respawn")[0];
    // global.h_respawn = selectE(e, "h_respawn")[0].pos; // Hitman doesn't respawn, but this is where they're put while target is hiding
    
    //Teleport players to proper places
    global.guards.forEach(g => g.teleportTo(global.g_spawn.x, global.g_spawn.y, global.g_spawn.z));

    //Kits
    global.guards.forEach(g => loadKit(g, "guard"));

    s.tell(global.guards);
    s.tell(global.g_spawn);
    global.guards.forEach(g => g.paint({      
                                    respawn_time: {
                                        type: 'text',
                                        text: `alive!`,
                                        scale: 1.5,
                                        x: -4,
                                        y: -4,
                                        alignX: 'right',
                                        alignY: 'bottom',
                                        draw: 'always',
                                        visible: false
                                    }
                                }))
}
// End Game
function endGame(s) {
    global.isGaming = false;
    s.tell("Gaurds won");
}
ItemEvents.entityInteracted("minecraft:interaction", e => {
    //e.player.setFeetArmorItem(Item.of())
    
    //e.server.tell(e.entity.tags)
    e.level.spawnParticles("minecraft:wax_on", false, e.target.x, e.target.y, e.target.z, .1, .1, .1, 40, 10);
    let st = 5;
    for (let i = st; i > 1; i--) {
        e.server.scheduleInTicks((st-i)*20, e.server.tell(Component.red(`Starting game in ${i} seconds!`)));
    }
    e.server.scheduleInTicks(st*20, startGame(e.server));

});
EntityEvents.death("minecraft:player", e => {
    if (e.player.tags.contains("hitman")) {
        endGame(e.server);
    }
    if (e.player.tags.contains("guard")) {
        //e.player.teleportTo(global.g_respawn.x, global.g_respawn.y, global.g_respawn.z);
        e.player.persistentData.respawnTime = 120;
        e.player.paint({respawn_time: {visible: true}})
    }
});
PlayerEvents.tick(e => {
    if (!global.isGaming)
        return;
    if (e.player.persistentData.respawnTime > 0) {
        e.player.persistentData.respawnTime--;
        e.player.paint({respawn_time: {text: `${e.player.persistentData.respawnTime}`}})
    }
    if (e.player.persistentData.respawnTime == 1) {
        // Respawn Guard
        e.player.teleportTo(global.g_spawn.x, global.g_spawn.y, global.g_spawn.z);
        e.player.paint({respawn_time: {visible: false}})
    }
});

