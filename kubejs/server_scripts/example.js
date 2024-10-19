// priority: 0

// Visit the wiki for more info - https://kubejs.com/

console.info("Hello, World! (Loaded server scripts)");

ItemEvents.rightClicked('minecraft:stick', e => {
    e.player.give("minecraft:charcoal");
    e.level.tell(Component.aqua(`Someone named ${e.player.username} really just right-clicked a stick. Can you believe it? I cant`));
    e.level.spawnParticles("minecraft:wax_on", false, e.player.x, e.player.y, e.player.z, .1, .1, .1, 40, 10);
})
