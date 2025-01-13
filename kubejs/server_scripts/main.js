priority: 2

let hpoints, gpoints;
let targetAlive
global.villagerPlaced = false

// Utility function to select entities by tag
function selectE(server, tag) {
    return server.level.getEntities(e => e.tags.contains(tag));
}

/**
 * blah blah blah
 * @param {Internal.MinecraftServer} server 
 */

/**
 * Event when interacting with entities
 */
ItemEvents.entityInteracted("minecraft:interaction", e => {
    if (e.target.type === 'minecraft:slime' && targetAlive == false) {
        e.level.runCommandSilent(`effect clear @e[tag=exit] minecraft:glowing`);
        hpoints++;
        e.server.runCommandSilent(`title @a title {"text":"Hitman escaped!", "bold":true, "color":"red"}`)
        e.server.runCommandSilent(`playsound minecraft:item.trident.thunder master @a ~ ~ ~ 1 1 1`)
        e.server.runCommandSilent(`playsound minecraft:entity.firework_rocket.blast master @a ~ ~ ~ 1 1 1`)
        e.server.runCommandSilent(`kill @e[type=minecraft:slime,tag=exit]`)
        e.server.runCommandSilent(`gamemode spectator @a`)
        e.server.scheduleInTicks(100, () => {
            endRound(e.server);
        })
    } 
});

/**
 * Starts the game initialization
 * @param {Internal.MinecraftServer} server 
 */
function startGame(server) {
    global.isGaming = false;
    global.villagerPlaced = false
    server.tell("Starting Game...");
    hpoints = 0, gpoints = 0;
    // Assign and teleport players by role
    global.guards = selectE(server, "guard");
    global.hitman = selectE(server, "hitman");
    server.runCommandSilent(`clear @a`)
    global.guards.forEach(guard => {
        guard.teleportTo(global.map.gSpawn.x, global.map.gSpawn.y, global.map.gSpawn.z);
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
    server.runCommandSilent(`give @r[tag=guard] minecraft:villager_spawn_egg{EntityTag:{NoAI:1b,Tags:["target"]}}`)
    server.runCommandSilent(`gamemode survival @a`) // Need to change when we figure out how to place the villager in adventure mode
    server.runCommandSilent(`weather ${global.map.condition.weather}`)
    server.runCommandSilent(`time set ${global.map.condition.time}`)
    global.hitman.forEach(hitman => hitman.teleportTo(-138, 262, 13));
}
/**
 * Starts the next round when the target spawns
 * @param {Internal.MinecraftServer} server 
 */
EntityEvents.spawned("minecraft:villager", e => {
    if (e.entity.tags.contains("target") && global.villagerPlaced == false) {
        global.targetPos = [e.entity.x, e.entity.y, e.entity.z]
        global.villagerPlaced = true
        
        global.isGaming = false
        e.entity.kill();
        endRound(e.server);
    }
});

/**
 * 
 * @param {Internal.MinecraftServer} server 
 */
function startRound(server) {
    server.runCommandSilent(`effect clear @a`)
    global.isGaming = true
    server.tell("Starting Round...");
    targetAlive = true
    global.guards.forEach(guard => guard.teleportTo(global.map.gSpawn.x, global.map.gSpawn.y, global.map.gSpawn.z));
    global.hitman.forEach(hitman => hitman.teleportTo(global.map.hSpawn.x, global.map.hSpawn.y, global.map.hSpawn.z));
    server.runCommandSilent(`gamemode survival @a`) // Need to change when we figure out how to place the villager in adventure mode
    server.runCommandSilent(`effect give @a minecraft:instant_health 1 255`)
    server.runCommandSilent(`effect give @a[tag=guard] minecraft:glowing infinite 0 true`)
    server.runCommandSilent(`effect give @a[tag=hitman] minecraft:resistance infinite ${global.difficulty} true`)
    server.runCommandSilent(`effect give @a minecraft:slowness 999999 0 true`)

    // Reload kits
    server.scheduleInTicks(5, () => {
        global.guards.forEach(guard => loadKit(server, guard, "guard", true));
    global.hitman.forEach(hitman => loadKit(server, hitman, "hitman", true))
    })
    
}

/**
 * Ends the game and declares the winning team
 * @param {Internal.MinecraftServer} server 
 */
function endGame(server) {
    global.isGaming = false;
    if (hpoints > gpoints) {
        server.tell("Hitman wins!");

    } else {
        server.tell("Guards Win!");
    }
    server.runCommandSilent(`tp @a 10000 -42 0`)
    server.runCommandSilent(`clear @a`)
    server.runCommandSilent(`effect clear @a`)
    server.runCommandSilent(`time set day`)
    server.runCommandSilent(`weather clear`)
    server.scheduleInTicks(5, () => { 
        server.runCommandSilent(`gamemode @a adventure`)
    })
    
}

/**
 * Ends the round and displays the current score
 * @param {Internal.MinecraftServer} server 
 */
function endRound(server) {
    global.isGaming = false
    server.tell(`${hpoints}-${gpoints}`);
    server.runCommandSilent(`kill @e[tag=target]`)
    server.runCommandSilent(`kill @e[type=item]`)
    server.runCommandSilent(`clear @a`)
    if (hpoints == 5 || gpoints == 5) {
        endGame(server)
    } else {
        server.tell("Ending round...");
        server.runCommandSilent(`summon villager ${global.targetPos[0]} ${global.targetPos[1]} ${global.targetPos[2]} {Tags:["target"],VillagerData:{level:1,profession:"minecraft:nitwit"}}`);
        server.runCommandSilent(`summon slime ${global.map.exit.x} ${global.map.exit.y} ${global.map.exit.z} {Size:0,Invulnerable:1b,NoAI:1b,PersistenceRequired:1b,Invisible:1b,Tags:["exit"]}`)
        server.runCommandSilent(`team join Target @e[tag=target]`)
        server.runCommandSilent(`effect give @e[tag=target] minecraft:glowing infinite 0 true`)
        startRound(server);
    }
}

PlayerEvents.tick(e => {
    global.spawnPosX = Math.round(e.player.x)
    global.spawnPosY = Math.round(e.player.y)
    global.spawnPosZ = Math.round(e.player.z)

    e.server.runCommandSilent(`spawnpoint ${e.player.username} ${global.spawnPosX} ${global.spawnPosY} ${global.spawnPosZ}`)
})

BlockEvents.rightClicked('minecraft:purple_concrete_powder', e => {
    console.log(global.spawnPosX)
    console.log(global.spawnPosY)
    console.log(global.spawnPosZ)
    console.log(`spawnpoint ${e.player.username} ${global.spawnPosX} ${global.spawnPosY} ${global.spawnPosZ}`)
})

/**
 * Handles death events
 */

EntityEvents.death(e => {
    e.server.tell(global.isGaming)
    if (e.entity.tags.contains("target") && global.isGaming) {
        e.server.runCommandSilent(`effect give @e[tag=exit] minecraft:glowing infinite 0 true`);
        e.server.runCommandSilent(`playsound minecraft:entity.wither.spawn master @a ~ ~ ~ 1 1 1`)
        e.server.runCommandSilent(`title @a actionbar {"text":"Target down!", "bold":true, "color":"red"}`)
        targetAlive = false
    } else if (e.entity.tags.contains("hitman")) {
        e.server.tell("Threat neutralized.");
        e.server.runCommandSilent(`playsound minecraft:entity.evoker.death master @a ~ ~ ~ 1 1 1`)
        gpoints++
        e.server.scheduleInTicks(2, () => {
            e.server.runCommandSilent(`gamemode ${e.entity.username} spectator`)
        })
        e.server.scheduleInTicks(20, () => {
            endRound(e.server)
        })
    } else if (e.entity.tags.contains("guard")) {
        e.server.runCommandSilent(`title @a actionbar {"text":"Guard down!", "bold":true, "color":"white"}`)
        e.server.runCommandSilent(`playsound minecraft:entity.allay.hurt master @a ~ ~ ~ 1 0.85 1`)
        respawnGuard(e.entity);
    }
});

/**
 * Respawns guards after a delay
 * @param {Player} guard 
 */
function respawnGuard(guard) {
    guard.persistentData.respawnTime = 120;
    guard.paint({ respawn_time: { visible: true } });
    //global.guards.forEach(guard => loadKit(guard, "guard", true)); // doesnt this load kits for every guard?
}

/**
 * Tick event for managing guard respawn times
 */
PlayerEvents.tick(e => {
    if (e.player.block.down.id == "minecraft:red_glazed_terracotta" && !e.player.tags.contains('hitman')) {
        e.player.getTags().remove('guard')
        e.player.getTags().add('hitman')
        e.server.tell(`${e.player.username} is now a hitman!`)
    }
    if (e.player.block.down.id == "minecraft:blue_glazed_terracotta" && !e.player.tags.contains('guard')) {
        e.player.getTags().remove('hitman')
        e.player.getTags().add('guard')
        e.server.tell(`${e.player.username} is now a guard!`)
    }
    if (!global.isGaming) return;

    // Decrease respawn time for guards
    if (e.player.persistentData.respawnTime > 1) {
        e.player.persistentData.respawnTime--;
        e.player.paint({ respawn_time: { text: `${e.player.persistentData.respawnTime}` } });
        e.player.setGameMode('spectator')
        e.player.potionEffects.add('minecraft:glowing', 99999, 0, false, false); // "INFINITE isnt defined"
    }

    // Respawn guard when time reaches zero
    if (e.player.persistentData.respawnTime == 1) {
        e.player.persistentData.respawnTime = 0; // dont run previous if statment again
        e.player.teleportTo(global.map.gSpawn.x, global.map.gSpawn.y, global.map.gSpawn.z);
        e.player.paint({ respawn_time: { visible: false } });
        e.player.displayClientMessage(Component.blue("Back in action!"), true);
        e.server.runCommandSilent(`playsound minecraft:entity.allay.ambient_without_item master @a ~ ~ ~ 1 1.2 1`)
        e.server.runCommandSilent(`playsound minecraft:entity.enderman.teleport master @a ~ ~ ~ 1 1 1`)
        e.server.runCommandSilent(`particle minecraft:end_rod ${e.player.x} ${e.player.y} ${e.player.z} 0.4 1 0.4 0 50 force`)
        e.player.setGameMode('survival')
        loadKit(e.server, e.player, "guard", true)
    
        
    }
    
});

/**
 * Plays a sound when right-clicking on a monitor block
 */
BlockEvents.rightClicked("kubejs:monitor", e => {
    if (e.getHand() == "off_hand") return; // Prevents event from firing twice
    if (e.level.getBlock(e.block.x, e.block.y - 2, e.block.z) == 'minecraft:lodestone') {
        if (!global.map) {
            if (e.getHand() == "off_hand") return;
            e.server.tell('There is no map selected!')
        } else {
            startGame(e.server);
        }
    }
    if (e.level.getBlock(e.block.x, e.block.y - 2, e.block.z) == 'minecraft:red_glazed_terracotta') {
        e.player.getTags().remove('guard')
        e.player.getTags().add('hitman')
        e.server.tell(`${e.player.username} is now a Hitman!`)
    }
    if (e.level.getBlock(e.block.x, e.block.y - 2, e.block.z) == 'minecraft:blue_glazed_terracotta') {
        e.player.getTags().remove('hitman')
        e.player.getTags().add('guard')
        e.server.tell(`${e.player.username} is now a Guard!`)
    }
    if (e.level.getBlock(e.block.x, e.block.y - 2, e.block.z) == 'minecraft:crafting_table') {
        e.server.runCommandSilent(`tp @p -8 -59 4`)
    }
    if (e.level.getBlock(e.block.x, e.block.y - 2, e.block.z) == 'minecraft:cartography_table') {
        e.server.runCommandSilent(`tp @p 10000 -42 0`)
    }

    // Map Selection
    if (e.level.getBlock(e.block.x, e.block.y - 2, e.block.z) == 'minecraft:white_glazed_terracotta') {
        e.server.runCommandSilent('title @a actionbar "Map Selected: ICA Training Facility"')
        e.server.runCommandSilent('playsound minecraft:block.note_block.bit master @a ~ ~ ~ 1 1 1');
        global.map = mapOptions[0]
    } 
    if (e.level.getBlock(e.block.x, e.block.y - 2, e.block.z) == 'minecraft:light_gray_glazed_terracotta') {
        e.server.runCommandSilent('title @a actionbar "Map Selected: Tethys Outpost"')
        e.server.runCommandSilent('playsound minecraft:block.note_block.chime master @a ~ ~ ~ 1 1 1');
        global.map = mapOptions[1]
    }
    if (e.level.getBlock(e.block.x, e.block.y - 2, e.block.z) == 'minecraft:gray_glazed_terracotta') {
        e.server.runCommandSilent('title @a actionbar "Map Selected: FBC Research Sector"')
        e.server.runCommandSilent('playsound minecraft:block.note_block.harp master @a ~ ~ ~ 1 1 1');
        global.map = mapOptions[2]
    } 

    // Difficulty Selection
    if (e.level.getBlock(e.block.x, e.block.y - 2, e.block.z) == 'minecraft:green_concrete') {
        e.server.runCommandSilent('title @a actionbar "Difficulty Selected: Casual"')
        e.server.runCommandSilent('playsound minecraft:block.note_block.bit master @a ~ ~ ~ 1 1 1');
        global.difficulty = 2
    } 
    if (e.level.getBlock(e.block.x, e.block.y - 2, e.block.z) == 'minecraft:yellow_concrete') {
        e.server.runCommandSilent('title @a actionbar "Difficulty Selected: Professional"')
        e.server.runCommandSilent('playsound minecraft:block.note_block.chime master @a ~ ~ ~ 1 1 1');
        global.difficulty = 1
    }
    if (e.level.getBlock(e.block.x, e.block.y - 2, e.block.z) == 'minecraft:red_concrete') {
        e.server.runCommandSilent('title @a actionbar "Difficulty Selected: Master"')
        e.server.runCommandSilent('playsound minecraft:block.note_block.harp master @a ~ ~ ~ 1 1 1');
        global.difficulty = 0
    } 
});

ServerEvents.commandRegistry(e => {
    const { commands: Commands, arguments: Arguments } = event
    
    e.register(Commands.literal('cancel') // The name of the command
      .requires(s => s.hasPermission(1)) // Check if the player has operator privileges
      .executes(() => {
        e.server.runCommandSilent(`kill @e[tag='target']`)
        e.server.runCommandSilent(`clear @a`)
        e.server.runCommandSilent(`tp @a 10000 -42 0`)
        e.server.runCommandSilent(`kubejs reload server_scripts`)
      })
    )
    
  })