priority: 801

const canvas = {
    x: -6,
    y: -41,
    z: -245,
    length: 16,
    width: 32
}
let ball = {
    x: 0,
    y: 0,
    vel: {
        x: 1,
        y: 1
    }
}

let left_paddle = {
    y: 0
}

/**
 * Reset canvas
 * @param {Internal.Level} level 
 */
function background(level) {
    for (let i=canvas.x; i<canvas.x-canvas.width; i++) {
        for (let j=canvas.y; j<canvas.y+canvas.length; j++) {
            level.getBlock(i, j, canvas.z).set("minecraft:white_concrete");
        }
    }
}




/**
 * Main display loop
 * @param {Internal.Level} level 
 */
function drawLoop(level) {
    ball.x+=ball.vel.x;
    ball.y+=ball.vel.y;
    if (ball.x > canvas.width || ball.x < 0) {
        ball.vel.x*=-1; // flips velocity
        ball.x+=ball.vel.x;
    }
    if (ball.y > canvas.height || ball.y < 0) {
        ball.vel.y*=-1; // flips velocity
        ball.y+=ball.vel.y;
    }



    background(level);
    //draw ball
    level.getBlock(canvas.x+ball.x, canvas.y-ball.y, canvas.z).set("minecraft:orange_concrete");
    
}














ItemEvents.rightClicked("minecraft:iron_nugget", e => {
    //if (e.getHand() == ) return;
    e.player.tell(ball)
    drawLoop(e.level);
})