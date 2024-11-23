priority: 0;
const nums = {
    0: [
        1,1,1,
        1,0,1,
        1,0,1,
        1,0,1,
        1,1,1,
    ],
    1: [
        0,0,1,
        0,0,1,
        0,0,1,
        0,0,1,
        0,0,1,
    ],
    2: [
        1,1,1,
        0,0,1,
        1,1,1,
        1,0,0,
        1,1,1,
    ],
    3: [
        1,1,1,
        0,0,1,
        1,1,1,
        0,0,1,
        1,1,1,
    ],
    4: [
        1,0,1,
        1,0,1,
        1,1,1,
        0,0,1,
        0,0,1,
    ],
    5: [
        1,1,1,
        1,0,0,
        1,1,1,
        0,0,1,
        1,1,1,
    ],
    6: [1,1,1,
        1,0,0,
        1,1,1,
        1,0,1,
        1,1,1,
    ],
    7: [
        1,1,1,
        0,0,1,
        0,0,1,
        0,0,1,
        0,0,1,
    ],
    8: [
        1,1,1,
        1,0,1,
        1,1,1,
        1,0,1,
        1,1,1,
    ],
    9: [
        1,1,1,
        1,0,1,
        1,1,1,
        0,0,1,
        1,1,1,
    ]
}

/**
 * 
 * @param {Internal.level} level 
 * @param {*} pos 
 * @param {number[]} display_array 
 */
function blockDisplay(level, pos, display_array) {

}

/**
 * Selects all entities with a tag
 * @param {Internal.MinecraftServer} s 
 * @param {String} tag 
 * @returns Array of entities that have the tag
 */
function selectE(s, tag) {
    return s.entities.filter(i => i.tags.contains(tag));
}

/**
 * Loads a kit to a player.
 * @param {Internal.Player} player 
 * @param {String} kit Kit name, "guard", "hitman", etc.
 * @param {boolean} clear_inv Clear inventory before loading kit
 * @returns true if could load whole kit, false if failed to load any part
 */
function loadKit(player, kit, clear_inv) {
    let kits = JsonIO.read("kubejs/game_data/kits.json");
    if (!kits.containsKey(kit)) return false;

    if (clear_inv) player.inventory.clear();
    // Items
    if (!Array.isArray(kits[kit].inv)) return false;
    kits[kit].inv.forEach(item => {
        player.give(`${item.count}x ${item.id} ${item.nbt}`);
    });

    // Offhand
    let oh = kits[kit].offhand;
    player.setOffHandItem(`${oh.count}x ${oh.id} ${oh.nbt}`);

    // Armor
    if (!Array.isArray(kits[kit].armor)) return false;
    let armor = kits[kit].armor;
    player.setFeetArmorItem(`${armor[0].count}x ${armor[0].id} ${armor[0].nbt}`);
    player.setLegsArmorItem(`${armor[1].count}x ${armor[1].id} ${armor[1].nbt}`);
    player.setChestArmorItem(`${armor[2].count}x ${armor[2].id} ${armor[2].nbt}`);
    player.setHeadArmorItem(`${armor[3].count}x ${armor[3].id} ${armor[3].nbt}`);

    return true;
}

