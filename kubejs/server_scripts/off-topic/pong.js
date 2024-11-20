
const canvas_pos = { x: -5, y: -42, z: -241 }
let ball_pos = {
    x: 0,
    y: 0
}

/**
 * Main display loop
 * @param {Internal.Level} level 
 */
function drawLoop(level) {
    level.getBlock(canvas_pos.x+ball_pos.x, canvas_pos.y-ball_pos.y, canvas_pos.z).set("minecraft:orange_concrete");
    x++;
}

ItemEvents.rightClicked("minecraft:iron_nugget", e => {
    //if (e.getHand() == ) return;
    drawLoop(e.level);
})