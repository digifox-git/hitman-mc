priority: 2

// Utility function to select entities by tag
function selectE(server, tag) {
    return server.getLevel("minecraft:overworld").getEntities().filter(e => e.tags.contains(tag));
}

/**
 * blah blah blah blah
 * @param {Internal.MinecraftServer} server 
 */

/**
 * Event when interacting with entities
 */
ItemEvents.entityInteracted(e => {
    let data = e.server.data;
    if (e.target.type == 'minecraft:slime' && !data.get("targetAlive") && e.player.tags.contains("hitman")) {
        e.level.runCommandSilent(`effect clear @e[tag=exit] minecraft:glowing`);
        data.put("hpoints", data.get("hpoints") + 1);
        e.server.runCommandSilent(`title @a title {"text":"Hitman escaped!", "bold":true, "color":"red"}`)
        e.server.runCommandSilent(`playsound minecraft:item.trident.thunder master @a ~ ~ ~ 1 1 1`)
        e.server.runCommandSilent(`playsound minecraft:entity.firework_rocket.blast master @a ~ ~ ~ 1 1 1`)
        e.server.runCommandSilent(`kill @e[type=minecraft:slime,tag=exit]`)
        e.server.runCommandSilent(`gamemode spectator @a`)
        e.server.scheduleInTicks(100, () => {
            endRound(e.server);
        })
        let currPoints = Math.trunc(Math.round(((10000 * (data.get("guards").length ** 1.7)) / (data.get("map").difficulty ** 2 * data.get("hitman").length) - (500 * data.get("killCount")) / 10) * 10))
        if (currPoints < 0) {
            currPoints = 0
        }
        e.server.tell(currPoints)
        data.put("points", currPoints + data.get("points"));
    }
});

/**
 * Starts the game initialization
 * @param {Internal.MinecraftServer} server 
 */
function startGame(server) {
    let data = server.data;
    data.put("points", 0);
    data.put("villagerPlaced", false);
    server.tell("Starting Game...");
    server.runCommandSilent("playsound minecraft:item.trident.riptide_1 master @a ~ ~ ~ 1 1 1")
    data.put("hpoints", 0);
    data.put("gpoints", 0);
    server.runCommandSilent("clear @a")
    data.get("guards").forEach(guard => {
        guard.teleportTo(
            data.get("map").gSpawn.x,
            data.get("map").gSpawn.y,
            data.get("map").gSpawn.z
        );
    });
    server.runCommandSilent(`give @r[tag=guard] minecraft:villager_spawn_egg[minecraft:entity_data={id:"minecraft:villager",NoAI:1b,Tags:["target"]}]`)
    server.runCommandSilent(`gamemode survival @a`) // Need to change when we figure out how to place the villager in adventure mode
    server.runCommandSilent(`weather ${data.get("map").condition.weather}`)
    server.runCommandSilent(`time set ${data.get("map").condition.time}`)
    data.get("hitman").forEach(hitman => hitman.teleportTo(-138, 262, 13));
}
/**
 * Starts the next round when the target spawns
 * @param {Internal.MinecraftServer} server 
 */
EntityEvents.spawned("minecraft:villager", e => {
    let data = e.server.data;
    if (e.entity.tags.contains("target") && !data.get("villagerPlaced")) {
        data.put("targetPos", [e.entity.x, e.entity.y, e.entity.z]);
        data.put("villagerPlaced", true);

        data.put("isGaming", false);
        e.entity.kill();
        endRound(e.server);
    }
});

/**
 * 
 * @param {Internal.MinecraftServer} server 
 */
function startRound(server) {
    let data = server.data;
    let map = data.get("map");
    data.put("killCount", 0);
    server.runCommandSilent(`effect clear @a`);
    data.put("isGaming", true);
    server.tell("Starting Round...");
    data.put("targetAlive", true);
    data.get("guards").forEach(guard => guard.teleportTo(map.gSpawn.x, map.gSpawn.y, map.gSpawn.z));
    data.get("hitman").forEach(hitman => hitman.teleportTo(map.hSpawn.x, map.hSpawn.y, map.hSpawn.z));
    server.runCommandSilent(`gamemode survival @a`) // Need to change when we figure out how to place the villager in adventure mode
    server.runCommandSilent(`effect give @a minecraft:instant_health 1 255`)
    server.runCommandSilent(`effect give @a[tag=guard] minecraft:glowing infinite 0 true`)
    server.runCommandSilent(`effect give @a[tag=hitman] minecraft:resistance infinite ${data.get("difficulty")} true`)
    server.runCommandSilent(`effect give @a minecraft:slowness 999999 0 true`)

    // Reload kits
    server.scheduleInTicks(5, () => {
        data.get("guards").forEach(guard => loadKit(server, guard, "guard", true));
        data.get("hitman").forEach(hitman => loadKit(server, hitman, "hitman", true))
        server.runCommandSilent(`team join Target @e[tag=target]`)

    })

}

/**
 * Ends the game and declares the winning team
 * @param {Internal.MinecraftServer} server 
 */
function endGame(server) {
    let data = server.data;
    data.put("isGaming", false);
    if (data.get("hpoints") > data.get("gpoints")) {
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
        server.runCommandSilent(`gamemode adventure @a`)
    })
    server.tell(data.get("points"));
}

/**
 * Ends the round and displays the current score
 * @param {Internal.MinecraftServer} server 
 */
function endRound(server) {
    let data = server.data;

    data.put("isGaming", false);
    server.runCommandSilent(`title @a title {"text":"§kX§c§l${data.get("hpoints")}§f§l-§9§l${data.get("gpoints")}§kX", "bold":true}`)
    server.runCommandSilent(`playsound minecraft:entity.ender_dragon.growl master @a`)
    server.runCommandSilent(`kill @e[tag=target]`)
    server.runCommandSilent(`kill @e[type=item]`)
    server.runCommandSilent(`clear @a`)
    if (data.get("hpoints") == 5 || data.get("gpoints") == 5) {
        endGame(server)
    } else {
        let map = data.get("map");
        let targetPos = data.get("targetPos");
        server.runCommandSilent(`summon minecraft:villager ${targetPos[0]} ${targetPos[1]} ${targetPos[2]} {Tags:["target"],villager_data:{level:1,profession:"minecraft:nitwit",type:"minecraft:plains"}}`);
        for (let i = 0; i < map.exit.length; i++) {
            server.runCommandSilent(`summon slime ${map.exit[i].x} ${map.exit[i].y} ${map.exit[i].z} {Size:0,Invulnerable:1b,NoAI:1b,PersistenceRequired:1b,Invisible:1b,Tags:["exit"]}`)
        }
        server.runCommandSilent(`team join Target @e[tag=target]`)
        server.runCommandSilent(`effect give @e[tag=target] minecraft:glowing infinite 0 true`)
        server.runCommandSilent(`effect give @e[tag=target] minecraft:slowness infinite 1 true`)
        startRound(server);
    }
}

PlayerEvents.tick(e => {
    e.server.runCommandSilent(`spawnpoint ${e.player.username} ${Math.round(e.player.x)} ${Math.round(e.player.y)} ${Math.round(e.player.z)}`)
})

BlockEvents.rightClicked('minecraft:purple_concrete_powder', e => {
    let data = e.server.data;
    console.log(data.get("spawnPosX"))
    console.log(data.get("spawnPosY"))
    console.log(data.get("spawnPosZ"))
    console.log(`spawnpoint ${e.player.username} ${data.get("spawnPosX")} ${data.get("spawnPosY")} ${data.get("spawnPosZ")}`)
})

/**
 * Handles death events
 */

EntityEvents.death(e => {
    let data = e.server.data;
    if (e.entity.tags.contains("target") && data.get("isGaming")) {
        e.server.runCommandSilent(`effect give @e[tag=exit] minecraft:glowing infinite 0 true`);
        data.put("targetAlive", false);
    } else if (e.entity.tags.contains("hitman")) {
        e.server.tell("Threat neutralized.");
        e.server.runCommandSilent(`playsound minecraft:entity.evoker.death master @a ~ ~ ~ 1 1 1`)
        data.put("gpoints", data.get("gpoints") + 1);
        e.server.scheduleInTicks(20, () => {
            endRound(e.server)
        })
        e.server.runCommandSilent(`kill @e[type=minecraft:slime,tag=exit]`)
    } else if (e.entity.tags.contains("guard")) {
        e.server.tell("[DEBUG] A guard died!")
        data.put("killCount", data.get("killCount") + 1);
        /*if (e.source.entity.isPlayer()) {
            global.killCount++
        }*/

    }
});

PlayerEvents.respawned(e => {
    let data = e.server.data;
    e.server.runCommandSilent(`playsound minecraft:entity.allay.hurt player ${e.player.username}`)
    e.server.runCommandSilent(`gamemode spectator ${e.player.username}`)
    if (e.player.tags.contains("guard")) {
        e.server.scheduleInTicks(120, () => {
            e.player.teleportTo(
                data.get("map").gSpawn.x,
                data.get("map").gSpawn.y,
                data.get("map").gSpawn.z
            );
            e.player.displayClientMessage(Component.blue("Back in action!"), true);
            e.server.runCommandSilent(`playsound minecraft:entity.allay.ambient_without_item master ${e.player.username} ~ ~ ~ 1 1.2 1`)
            e.server.runCommandSilent(`playsound minecraft:entity.enderman.teleport master ${e.player.username} ~ ~ ~ 1 1 1`)
            e.server.runCommandSilent(`particle minecraft:end_rod ${e.player.x} ${e.player.y} ${e.player.z} 0.4 1 0.4 0 50 force`)
            e.player.setGameMode('adventure')
            loadKit(e.server, e.player, "guard", true)
        })
    }

})

function tell(e, message) {
    e.server.tell(`${message}`);
}

EntityEvents.spawned("minecraft:villager", e => {
    if (e.entity.tags.contains("target") && !e.server.data.get("villagerPlaced")) {
        data.put("targetPos", [e.entity.x, e.entity.y, e.entity.z]);
        data.put("villagerPlaced", true);
        data.put("isGaming", false);
        e.entity.kill();
        endRound(e.server);
    }
});

PlayerEvents.tick(e => {
    const Pose = Java.loadClass('net.minecraft.world.entity.Pose')

    // let distance = Math.hypot(e.player.x - global.windowPos[0], e.player.y - global.windowPos[1], e.player.z - global.windowPos[2])

    // if (distance < 3 && e.player.isCrouching()) {
    //     e.player.potionEffects.add('minecraft:speed', 1, 2, false, false)
    //     e.player.setPose(Pose.SWIMMING);
    // }

    // if (distance < 3 && e.player.isCrouching()) {
    //     e.player.potionEffects.add('minecraft:speed', 1, 2, false, false)
    //     e.player.setPose(Pose.SWIMMING);
    // }
});

BlockEvents.placed("kubejs:glow", e => {
    if (e.getHand() == "off_hand") return;
    e.server.runCommandSilent(`placed ${e.block}`)
    e.server.runCommandSilent(`setblock ~ ~ ~ minecraft:end_gateway replace`)
})


BlockEvents.rightClicked("kubejs:glow", e => {
    if (e.getHand() == "off_hand") return;
    e.server.tell('debug;')
    windowtest()
})

function windowtest() {
    let map = e.server.get("map");
    for (let i = 0; i < map.window.length; i++) {
        e.server.tell('UNLEASH!')
        server.runCommandSilent(`summon slime ${map.exit[i].x} ${map.exit[i].y} ${map.exit[i].z} {Size:0,Invulnerable:1b,NoAI:1b,PersistenceRequired:1b,Invisible:1b,Tags:["exit"]}`)
    }
}


/**
 * Tick event for managing guard respawn times
 */
PlayerEvents.tick(e => {
    let data = e.server.data;
    let map = data.get("map");
    data.put("guards", selectE(e.server, "guard"));
    data.put("hitman", selectE(e.server, "hitman"));
    if (e.player.block.down.id == "minecraft:red_glazed_terracotta" && !e.player.tags.contains('hitman')) {
        e.player.getTags().remove('guard')
        e.player.getTags().add('hitman')
        e.server.runCommandSilent(`team leave ${e.player.username}`)
        e.server.runCommandSilent(`team join Hitman ${e.player.username}`)
        e.server.tell(`${e.player.username} is now a hitman!`)
        e.server.runCommandSilent(`playsound minecraft:block.beacon.deactivate master @a[distance=0..512] ~ ~ ~ 1 1 1`)
    }
    if (e.player.block.down.id == "minecraft:blue_glazed_terracotta" && !e.player.tags.contains('guard')) {
        e.player.getTags().remove('hitman')
        e.player.getTags().add('guard')
        e.server.runCommandSilent(`team leave ${e.player.username}`)
        e.server.runCommandSilent(`team join Guard ${e.player.username}`)
        e.server.tell(`${e.player.username} is now a guard!`)
        e.server.runCommandSilent(`playsound minecraft:block.beacon.activate master @a[distance=0..512] ~ ~ ~ 1 1 1`)
    }
    if (!data.get("isGaming")) return;

    // Decrease respawn time for guards
    if (e.player.persistentData.respawnTime > 1) {
        e.player.persistentData.respawnTime--;
        e.player.paint({ respawn_time: { text: `${e.player.persistentData.respawnTime}` } });
        e.server.runCommandSilent(`gamemode spectator ${e.player.username}`)
        e.player.potionEffects.add('minecraft:glowing', 99999, 0, false, false); // "INFINITE isnt defined"
    }
});

/**
 * Plays a sound when right-clicking on a monitor block
 */
BlockEvents.rightClicked("kubejs:monitor", e => {
    let data = e.server.data;
    if (e.level.getBlock(e.block.x, e.block.y - 2, e.block.z) == 'minecraft:dirt') {
        e.server.tell(data.get("guards").length)
        e.server.tell(data.get("hitman").length)
    }
    if (e.getHand() == "off_hand") return; // Prevents event from firing twice
    if (e.level.getBlock(e.block.x, e.block.y - 2, e.block.z) == 'minecraft:lodestone') {
        if (!data.get("map")) {
            e.server.tell('There is no map selected!')
        } else if (data.get("hitman").length == 0) {
            e.server.runCommandSilent('title @a actionbar {"text":"You need at least 1 Hitman to play!","bold":true,"color":"yellow"}')
            e.server.runCommandSilent('playsound minecraft:entity.enderman.hurt master @a ~ ~ ~ 1 1 1')
        } else if (data.get("guards").length == 0) {
            e.server.runCommandSilent('title @a actionbar {"text":"You need at least 1 Guard to play!","bold":true,"color":"yellow"}')
            e.server.runCommandSilent('playsound minecraft:entity.enderman.hurt master @a ~ ~ ~ 1 1 1')
        } else {
            startGame(e.server);
        }

    }
    if (e.level.getBlock(e.block.x, e.block.y - 2, e.block.z) == 'minecraft:red_glazed_terracotta') {
        e.player.getTags().remove('guard')
        e.player.getTags().add('hitman')
        e.server.tell(`${e.player.username} is now a Hitman!`)
        e.server.runCommandSilent(`playsound minecraft:block.beacon.deactivate master @a[distance=0..512] ~ ~ ~ 1 1 1`)
    }
    if (e.level.getBlock(e.block.x, e.block.y - 2, e.block.z) == 'minecraft:blue_glazed_terracotta') {
        e.player.getTags().remove('hitman')
        e.player.getTags().add('guard')
        e.server.tell(`${e.player.username} is now a Guard!`)
        e.server.runCommandSilent(`playsound minecraft:block.beacon.activate master @a[distance=0..512] ~ ~ ~ 1 1 1`)
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
        data.put("map", mapOptions[0]);
    }

    if (e.level.getBlock(e.block.x, e.block.y - 2, e.block.z) == 'minecraft:light_gray_glazed_terracotta') {
        e.server.runCommandSilent('title @a actionbar "Map Selected: Tethys Outpost"')
        e.server.runCommandSilent('playsound minecraft:block.note_block.chime master @a ~ ~ ~ 1 1 1');
        data.put("map", mapOptions[1]);
    }
    if (e.level.getBlock(e.block.x, e.block.y - 2, e.block.z) == 'minecraft:gray_glazed_terracotta') {
        e.server.runCommandSilent('title @a actionbar "Map Selected: FBC Research Sector"')
        e.server.runCommandSilent('playsound minecraft:block.note_block.harp master @a ~ ~ ~ 1 1 1');
        data.put("map", mapOptions[2]);
    }

    // Difficulty Selection
    if (e.level.getBlock(e.block.x, e.block.y - 2, e.block.z) == 'minecraft:green_concrete') {
        e.server.runCommandSilent('title @a actionbar "Difficulty Selected: Casual"')
        e.server.runCommandSilent('playsound minecraft:item.firecharge.use master @a ~ ~ ~ 1 0.8 1');
        data.put("difficulty", 2);
    }
    if (e.level.getBlock(e.block.x, e.block.y - 2, e.block.z) == 'minecraft:yellow_concrete') {
        e.server.runCommandSilent('title @a actionbar "Difficulty Selected: Professional"')
        e.server.runCommandSilent('playsound minecraft:item.firecharge.use master @a ~ ~ ~ 1 1 1');
        data.put("difficulty", 1);
    }
    if (e.level.getBlock(e.block.x, e.block.y - 2, e.block.z) == 'minecraft:red_concrete') {
        e.server.runCommandSilent('title @a actionbar "Difficulty Selected: Master"')
        e.server.runCommandSilent('playsound minecraft:item.firecharge.use master @a ~ ~ ~ 1 1.2 1');
        data.put("difficulty", 0);
    }

    // Matchmaking GUI
    if (e.level.getBlock(e.block.x, e.block.y - 2, e.block.z) == 'minecraft:redstone_block') {
        e.server.runCommandSilent(`openguiscreen matchmaking ${e.player.username}`)
    }

    if (e.level.getBlock(e.block.x, e.block.y - 2, e.block.z) == 'minecraft:lapis_block') {
        e.server.runCommandSilent(`openguiscreen teamsettings ${e.player.username}`)
    }
});

// ServerEvents.customCommand('cancel', e => {
//     e.server.runCommandSilent(`kill @e[tag='target']`)
//     e.server.runCommandSilent(`clear @a`)
//     e.server.runCommandSilent(`tp @a 10000 -42 0`)
//     e.server.runCommandSilent(`kubejs reload server_scripts`)
// })


// ServerEvents.customCommand('setMap0', e => {
//     data.put("map", mapOptions[0]);
//     e.server.tell('Map Selected: ICA Training Facility')
//     e.server.runCommandSilent('playsound minecraft:block.note_block.bit master @a ~ ~ ~ 1 1 1');
// })

// ServerEvents.customCommand('setMap2', e => {
//     data.put("map", mapOptions[2]);
//     e.server.tell('Map Selected: FBC Research Sector')
//     e.server.runCommandSilent('playsound minecraft:block.note_block.harp master @a ~ ~ ~ 1 1 1');
// })

// ServerEvents.customCommand('startGame', e => {
//     let data = e.server.data;
//     if (!data.get("map")) {
//         e.server.tell('There is no map selected!')
//     } else if (data.get("hitman").length == 0) {
//         e.server.runCommandSilent('title @a actionbar {"text":"You need at least 1 Hitman to play!","bold":true,"color":"yellow"}')
//         e.server.runCommandSilent('playsound minecraft:entity.enderman.hurt master @a ~ ~ ~ 1 1 1')
//     } else if (data.get("guards").length == 0) {
//         e.server.runCommandSilent('title @a actionbar {"text":"You need at least 1 Guard to play!","bold":true,"color":"yellow"}')
//         e.server.runCommandSilent('playsound minecraft:entity.enderman.hurt master @a ~ ~ ~ 1 1 1')
//     } else {
//         startGame(e.server);
//         e.server.runCommandSilent(`closeguiscreen @a`)
//     }
// })

// ServerEvents.customCommand('joinTeamHitman', e => {
//     if (!e.player.tags.contains('hitman')) {
//         e.player.getTags().remove('guard')
//         e.player.getTags().add('hitman')
//         e.server.runCommandSilent(`team leave ${e.player.username}`)
//         e.server.runCommandSilent(`team join Hitman ${e.player.username}`)
//         e.server.tell(`${e.player.username} is now a hitman!`)
//         e.server.runCommandSilent(`playsound minecraft:block.beacon.deactivate master @a ~ ~ ~ 1 1 1`)
//     }
// })

// ServerEvents.customCommand('joinTeamGuard', e => {
//     if (!e.player.tags.contains('guard')) {
//         e.player.getTags().remove('hitman')
//         e.player.getTags().add('guard')
//         e.server.runCommandSilent(`team leave ${e.player.username}`)
//         e.server.runCommandSilent(`team join Guard ${e.player.username}`)
//         e.server.tell(`${e.player.username} is now a guard!`)
//         e.server.runCommandSilent(`playsound minecraft:block.beacon.activate master @a ~ ~ ~ 1 1 1`)
//     }
// })