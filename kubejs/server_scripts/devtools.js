priority: 10

/**
 * Hopefully at some point these
 * will be commands
 */

ItemEvents.rightClicked("minecraft:nether_star", e => {
    let kits = JsonIO.read("kubejs/game_data/kits.json");
    let working_kit = e.item;
    if (working_kit.getNbtString() == "null"
        || !working_kit.nbt.getAllKeys().toString().includes("kit")
        || !kits.containsKey(working_kit.nbt.kit)) {
        e.player.tell(Component.lightPurple("Missing data to edit kits"));
        return;
    }
    working_kit = e.item.nbt.kit;
    //e.player.tell(kits.containsKey(working_kit))
    //e.item.nbt.get("kit")
    // Save Kits
    if (e.player.isCrouching()) {
        kits[working_kit] = {inv:[],offhand:{},armor:[]}

        let inventory = e.player.inventory.items.filter(i => (i.id != 'minecraft:air' && i.id != 'minecraft:nether_star')); // Gets inventory not air items (no offhand or armor yet)
        inventory.forEach(item => {
            kits[working_kit].inv.push( { id: item.id, count: item.count, nbt: item.hasNBT() ? item.nbtString : "{}" } );
        })
        let offhand = e.player.offHandItem;
        kits[working_kit].offhand = { id: offhand.id, count: offhand.count, nbt: offhand.hasNBT() ? offhand.nbtString : "{}" }
        let armor = e.player.armorSlots;
        armor.forEach(item => {
            kits[working_kit].armor.push( { id: item.id, count: item.count, nbt: item.hasNBT() ? item.nbtString : "{}" } );
        })

        e.player.tell(Component.lightPurple(`Saved kit [${working_kit}]`));

        JsonIO.write("kubejs/game_data/kits.json", kits);
    }
    // Load Kits
    else {
        loadKit(e.player, working_kit, false);

        e.player.tell(Component.lightPurple(`Loaded kit [${working_kit}]`));
    }
})