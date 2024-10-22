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

        // Items
        if (!Array.isArray(kits.guard.inv)) return;
        kits.guard.inv.forEach(item => {
            e.player.giveInHand(Item.of(item.id, item.count, item.nbt));
        });
        // Offhand
        let oh = kits.guard.offhand;
        // Armor
        if (!Array.isArray(kits.guard.armor)) return;
        let armor = kits.guard.armor;
        e.player.setFeetArmorItem(Item.of(armor[0].id, armor[0].count, armor[0].nbt));
        e.player.setLegsArmorItem(Item.of(armor[1].id, armor[1].count, armor[1].nbt));
        e.player.setChestArmorItem(Item.of(armor[2].id, armor[2].count, armor[2].nbt));
        e.player.setHeadArmorItem(Item.of(armor[3].id, armor[3].count, armor[3].nbt));
    }
})