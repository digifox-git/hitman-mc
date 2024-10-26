priority: 1;




/**
 * Starts the PRE game
 * @param {Internal.MinecraftServer} s 
 */
function startGame(s) {
    global.isGaming = true;
    
    s.tell("starting game");

    // Get all players with right tags tag
    global.guards = selectE(s, "guard");
    global.hitman = selectE(s, "hitman");
    //global.target = selectE(s, "target");
    // Get spawns
    global.g_spawn = selectE(s, "g_spawn")[0];
    global.h_spawn = selectE(s, "h_spawn")[0];
    global.g_respawn = selectE(s, "g_respawn")[0];
    global.h_respawn = selectE(s, "h_respawn")[0]; // Hitman doesn't respawn, but this is where they're put while target is hiding

    // s.tell(selectE(s, "g_spawn"))
    // s.tell(`${global.g_respawn.x},${global.g_respawn.y},${global.g_respawn.z}`)

    // e.level.runCommand(`spawnpoint @a[tag=guard] ${global.g_respawn.x} ${global.g_respawn.y} ${global.g_respawn.z}`);
    //Teleport players to proper places
    global.guards.forEach(g => g.teleportTo(global.g_spawn.x, global.g_spawn.y, global.g_spawn.z));
    global.hitman.forEach(g => g.teleportTo(global.h_respawn.x, global.h_respawn.y, global.h_respawn.z));

    //Kits
    global.guards.forEach(g => {
        loadKit(g, "guard", true);
        g.giveInHand(Item.of("minecraft:villager_spawn_egg", 1, '{EntityTag:{Tags:["target"], NoAI:1b}}'));
    });
    global.hitman.forEach(g => loadKit(g, "hitman", true));

    //s.tell(global.guards);
    //s.tell(global.g_spawn);
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
/**
 * Starts the game, for real this time
 * @param {Internal.MinecraftServer} s 
 */
function startGameFR(s) {
    global.guards.forEach(g => g.teleportTo(global.g_spawn.x, global.g_spawn.y, global.g_spawn.z));
    global.hitman.forEach(g => g.teleportTo(global.h_spawn.x, global.h_spawn.y, global.h_spawn.z));


    // Load kits again because why not
    global.guards.forEach(g => loadKit(g, "guard", true));
    global.hitman.forEach(g => loadKit(g, "hitman", true));
}
/**
 * Ends the game, whodda thunk
 * @param {Internal.MinecraftServer} s 
 */
function endGame(s) {
    global.isGaming = false;
    s.tell("Guards won");
}

/**
 * Starts a new round
 * @param {Internal.MinecraftServer} s 
 */
function endRound(s) {
    s.tell("New round go! ");
}

ItemEvents.entityInteracted("minecraft:interaction", e => {
    // e.player.setFeetArmorItem(Item.of())
    if (e.target.tags.contains("target")) {
        e.server.tell(e.target)
    }
    
    // e.server.tell(e.entity.tags)
    e.level.spawnParticles("minecraft:wax_on", false, e.target.x, e.target.y, e.target.z, .1, .1, .1, 40, 10);
    let st = 5
    //for (let i = st; i > 1; i--) {
    //    e.server.scheduleInTicks((st-i)*20, e.server.tell(Component.red(`Starting game in ${i} seconds!`)));
    //}
    //e.server.scheduleInTicks(st*20, startGame(e.server));
    startGame(e.server)
});

/**
 * A majority of game logic happens on deaths,
 * and thus in this event:
 */
EntityEvents.death(e => {
    e.server.tell('test')
    if (e.entity.type != "minecraft:player" && e.entity.type != "minecraft:villager") return;

    if (e.player.tags.contains("hitman")) {
        endRound(e.server);
    }
    if (e.player.tags.contains("guard")) {
        e.player.teleportTo(global.g_respawn.x, global.g_respawn.y, global.g_respawn.z);
        e.player.persistentData.respawnTime = 120;
        e.player.paint({respawn_time: {visible: true}})
    }
    if (e.entity.tags.contains("target")) {
        e.server.tell('test')
        global.hitman.tell('Target down; good work agent. Make your way to an exit.')
    }
});
PlayerEvents.tick(e => {
    if (!global.isGaming) return;

    // Respawn Guard
    if (e.player.persistentData.respawnTime > 0) {
        e.player.persistentData.respawnTime--;
        e.player.paint({respawn_time: {text: `${e.player.persistentData.respawnTime}`}})
    }
    if (e.player.persistentData.respawnTime == 1) {
        e.player.teleportTo(global.g_spawn.x, global.g_spawn.y, global.g_spawn.z);
        e.player.paint({respawn_time: {visible: false}})
        e.player.displayClientMessage(Component.blue("RARRRRR"), true);
    }
});

EntityEvents.spawned("minecraft:villager", e => {
    if (!e.entity.tags.contains("target")) return;
    startGameFR(e.server);
})

BlockEvents.rightClicked('kubejs:monitor', event => Utils.server.runCommandSilent('playsound minecraft:block.note_block.bit master @a[distance=0..16] ~ ~ ~ 1 1 0'))