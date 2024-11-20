priority: 801

const canvas = {
    x: -6,
    y: -41,
    z: -245,
    height: 16,
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
    x: 1,
    y: 0,
    height: 4
}

/**
 * Reset canvas
 * @param {Internal.Level} level 
 */
function background(level) {
    for (let i=canvas.x; i<canvas.x+canvas.width; i++) {
        for (let j=canvas.y; j>canvas.y-canvas.height; j--) {
            level.getBlock(i, j, canvas.z).set("minecraft:white_concrete");
        }
    }
}



/**
 * Main game/logic loop
 * @param {Internal.Level} level 
 */
function gameLoop(level) {
    ball.x+=ball.vel.x;
    ball.y+=ball.vel.y;
    if (ball.x > canvas.width-1 || ball.x < 0) {
        ball.vel.x*=-1; // flips velocity
        ball.x+=ball.vel.x;
    }
    if (ball.y > canvas.height-1 || ball.y < 0) {
        ball.vel.y*=-1; // flips velocity
        ball.y+=ball.vel.y;
    }

    drawLoop(level);
}

/**
 * Main display loop
 * @param {Internal.Level} level 
 */
function drawLoop(level) {
    //clear last drawn content
    background(level);
    //draw paddle
    for (let i=left_paddle.y; i<left_paddle.y+left_paddle.height; i++) {
        level.getBlock(canvas.x+left_paddle.x, canvas.y-i, canvas.z).set("minecraft:blue_concrete");
    }
    //draw ball
    level.getBlock(canvas.x+ball.x, canvas.y-ball.y, canvas.z).set("minecraft:orange_concrete");
}













ItemEvents.rightClicked("minecraft:gold_nugget", e => {
    let dist = 1;
    if (e.player.isCrouching()) dist = -1;
    //move paddle
    left_paddle.y+=dist;

    if (left_paddle.y < 0 || left_paddle.y+left_paddle.height > canvas.height) {
        left_paddle-=dist;
    }

    gameLoop(e.level);
})
ItemEvents.rightClicked("minecraft:iron_nugget", e => {
    e.player.tell(ball)
    gameLoop(e.level);
})