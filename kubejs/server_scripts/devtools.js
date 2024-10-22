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
        e.player.tell(kits.guard.inv[0].id);
        e.player.giveInHand(kits.guard.inv[1].id);
        e.player.giveInHand(Item.of(kits.guard.inv[1].id, kits.guard.inv[1].count))
        // Items
        //if (!Array.isArray(kits.guard.inv)) return;
        kits.guard.inv.forEach(item => {
            e.player.tell(item)
            e.player.giveInHand(item.id);
        });
        
        // Offhand
        let oh = kits.guard.offhand;
        e.player.tell("Inv loaded");
        
        // Armor
        if (!Array.isArray(kits.guard.armor)) return;
        let armor = kits.guard.armor;
        e.player.setFeetArmorItem(Item.of(armor[0].id, armor[0].count, armor[0].nbt));
        e.player.setLegsArmorItem(Item.of(armor[1].id, armor[1].count, armor[1].nbt));
        e.player.setChestArmorItem(Item.of(armor[2].id, armor[2].count, armor[2].nbt));
        e.player.setHeadArmorItem(Item.of(armor[3].id, armor[3].count, armor[3].nbt));
        e.player.tell("Armor loaded");
    }
})