
const canvas_pos = { x: -6, y: -41, z: -245 }
let ball_pos = {
    x: 0,
    y: 0
}

/**
 * Main display loop
 * @param {Internal.Level} level 
 */
function drawLoop(level) {
    level.getBlock(canvas_pos.x+ball_pos.x, canvas_pos.y, canvas_pos.z-ball_pos.y).set("minecraft:orange_concrete");
    ball_pos.x++;
}

ItemEvents.rightClicked("minecraft:iron_nugget", e => {
    //if (e.getHand() == ) return;
    e.player.tell(ball_pos)
    drawLoop(e.level);
})