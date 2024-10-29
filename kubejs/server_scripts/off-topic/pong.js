
const canvas_pos = { x: -5, y: -42, z: -241 }
let ball_pos = {
    x: 0,
    y: 0
}

/**
 * Main display loop
 * @param {Internal.Level} l 
 */
function drawLoop(l) {
    l.setBlock([canvas_pos.x+ball_pos.x, canvas_pos.y-ball_pos.y, canvas_pos.z], "minecraft:orange_concrete");
}

ItemEvents.rightClicked("minecraft:iron_nugget", e => {
    //if (e.getHand() == ) return;
    drawLoop(e.level);
})