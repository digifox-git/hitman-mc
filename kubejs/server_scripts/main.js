// priority: 1;

let hpoints, gpoints;
let targetAlive
// Utility function to select entities by tag
function selectE(server, tag) {
    return server.level.getEntities(e => e.tags.contains(tag));
}

/**
 * Event when interacting with entities
 */
ItemEvents.entityInteracted("minecraft:interaction", e => {
    if (e.target.type === 'minecraft:slime' && targetAlive == false) {
        e.level.runCommandSilent(`effect clear @e[tag=exit] minecraft:glowing`);
        hpoints++;
        endRound(e.server);
    } else if (e.target.type == 'minecraft:interaction') {
        e.level.spawnParticles("minecraft:wax_on", false, e.target.x, e.target.y, e.target.z, .1, .1, .1, 40, 10);
        startGame(e.server);
    }
});

/**
 * Starts the game initialization
 * @param {Internal.MinecraftServer} server 
 */
function startGame(server) {
    global.isGaming = true;
    server.tell("Starting game");
    hpoints = 0, gpoints = 0;
    // Assign and teleport players by role
    global.guards = selectE(server, "guard");
    global.hitman = selectE(server, "hitman");
    global.g_spawn = selectE(server, "g_spawn")[0];
    global.h_spawn = selectE(server, "h_spawn")[0];
    global.g_respawn = selectE(server, "g_respawn")[0];
    global.h_respawn = selectE(server, "h_respawn")[0];

    global.guards.forEach(guard => {
        guard.teleportTo(global.g_spawn.x, global.g_spawn.y, global.g_spawn.z);
        loadKit(guard, "guard", true);
        guard.giveInHand(Item.of("minecraft:villager_spawn_egg", 1, '{EntityTag:{Tags:["target"], NoAI:1b}}'));
        guard.paint({
            respawn_time: {
                type: 'text',
                text: "alive!",
                scale: 1.5,
                x: -4,
                y: -4,
                alignX: 'right',
                alignY: 'bottom',
                draw: 'always',
                visible: false
            }
        });
    });
    global.hitman.forEach(hitman => hitman.teleportTo(global.h_respawn.x, global.h_respawn.y, global.h_respawn.z));
}

/**
 * Starts the next round when the target spawns
 * @param {Internal.MinecraftServer} server 
 */
EntityEvents.spawned("minecraft:villager", e => {
    if (e.entity.tags.contains("target")) {
        global.targetPos = [e.entity.x, e.entity.y, e.entity.z]
        startRound(e.server);
    }
});

function startRound(server) {
    targetAlive = true
    global.guards.forEach(guard => guard.teleportTo(global.g_spawn.x, global.g_spawn.y, global.g_spawn.z));
    global.hitman.forEach(hitman => hitman.teleportTo(global.h_spawn.x, global.h_spawn.y, global.h_spawn.z));

    // Reload kits
    global.guards.forEach(guard => loadKit(guard, "guard", true));
    global.hitman.forEach(hitman => loadKit(hitman, "hitman", true));
}

/**
 * Ends the game and declares the winning team
 * @param {Internal.MinecraftServer} server 
 */
function endGame(server) {
    global.isGaming = false;
    if (hpoints > gpoints) {
        server.tell("hitman won");
    } else {
        server.tell("guards won");
    }
    
}

/**
 * Ends the round and displays the current score
 * @param {Internal.MinecraftServer} server 
 */
function endRound(server) {
    server.tell(`${hpoints}-${gpoints}`);
    if (hpoints == 5 || gpoints == 5) {
        endGame(server)
    } else {
        e.level.runCommandSilent(`summon villager ${global.targetPos[0]} ${global.targetPos[1]} ${global.targetPos[2]} {Tags:["target"], NoAI:1b}`);
        startRound(server);
    }
    
}

/**
 * Handles death events
 */
EntityEvents.death(e => {
    if (e.entity.tags.contains("target")) {
        e.level.runCommandSilent(`effect give @e[tag=exit] minecraft:glowing infinite 0 true`);
        targetAlive = false
    } else if (e.entity.tags.contains("hitman")) {
        e.server.tell("Danger Neutralized");
        endRound(e.server);
    } else if (e.entity.tags.contains("guard")) {
        e.server.tell("Guard down!");
        respawnGuard(e.entity);
    }
});

/**
 * Respawns guards after a delay
 * @param {Player} guard 
 */
function respawnGuard(guard) {
    guard.teleportTo(global.g_respawn.x, global.g_respawn.y, global.g_respawn.z);
    guard.persistentData.respawnTime = 120;
    guard.paint({ respawn_time: { visible: true } });
}

/**
 * Tick event for managing guard respawn times
 */
PlayerEvents.tick(e => {
    if (!global.isGaming) return;

    // Decrease respawn time for guards
    if (e.player.persistentData.respawnTime > 0) {
        e.player.persistentData.respawnTime--;
        e.player.paint({ respawn_time: { text: `${e.player.persistentData.respawnTime}` } });
    }

    // Respawn guard when time reaches zero
    if (e.player.persistentData.respawnTime === 1) {
        e.player.teleportTo(global.g_spawn.x, global.g_spawn.y, global.g_spawn.z);
        e.player.paint({ respawn_time: { visible: false } });
        e.player.displayClientMessage(Component.blue("Back in action!"), true);
    }
});

/**
 * Plays a sound when right-clicking on a monitor block
 */
BlockEvents.rightClicked("kubejs:monitor", event => {
    Utils.server.runCommandSilent('playsound minecraft:block.note_block.bit master @a[distance=0..16] ~ ~ ~ 1 1 0');
});