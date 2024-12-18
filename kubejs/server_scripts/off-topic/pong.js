priority: 801


const canvas = {
    x: -6,
    y: -41,
    z: -245,
    height: 16, //try to keep these even
    width: 32 //try to keep these even
}
let ball = {
    x: 0,
    y: 0,
    vel: {
        x: 1,
        y: 1
    },
    delay: 4
}

let left_paddle = {
    x: 1,
    y: 6,
    height: 4,
    points: 0
}
let right_paddle = {
    x: 30,
    y: 6,
    height: 4,
    points: 0
}

let gaming = false;

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
    // ball
    ball.x+=ball.vel.x;
    ball.y+=ball.vel.y;

    // walls
    // -1 and 0 because we like a frame of the ball on the wall before resetting
    if (ball.x > canvas.width-1 || ball.x < 0) {
        ball.vel.x*=-1; // flips velocity

        //kill ball
        ball.x = canvas.width/2;
        ball.y = canvas.height/2;
    }

    // ceilings
    // -2 and 1 because its better than checking if ball is in wall and undoing movement
    if (ball.y > canvas.height-2 || ball.y < 1) {
        ball.vel.y*=-1; // flips velocity
    }

    paddleCollisions();
    
    drawLoop(level);
}

/**
 * Check seperately to call from multiple sources
 * @param {Internal.level} level 
 */
function paddleCollisions() {

    if ((ball.x == left_paddle.x || ball.x == left_paddle.x+1) && ball.y >= left_paddle.y && ball.y <= left_paddle.y+left_paddle.height) {
        ball.vel.x*=-1;
        left_paddle.points++;
        //in paddle
        if (ball.x == left_paddle.x) ball.x+=ball.vel.x;

    }

    if ((ball.x == right_paddle.x || ball.x == right_paddle.x-1) && ball.y >= right_paddle.y && ball.y <= right_paddle.y+right_paddle.height) {
        ball.vel.x*=-1;
        right_paddle.points++;
        //in paddle
        if (ball.x == right_paddle.x) ball.x+=ball.vel.x;

    }
}

/**
 * Main display loop
 * @param {Internal.Level} level 
 */
function drawLoop(level) {
    //clear last drawn content
    background(level);
    //draw paddles
    for (let i=left_paddle.y; i<left_paddle.y+left_paddle.height; i++) {
        level.getBlock(canvas.x+left_paddle.x, canvas.y-i, canvas.z).set("minecraft:blue_concrete");
    }
    for (let i=right_paddle.y; i<right_paddle.y+right_paddle.height; i++) {
        level.getBlock(canvas.x+right_paddle.x, canvas.y-i, canvas.z).set("minecraft:blue_concrete");
    }
    //draw ball
    level.getBlock(canvas.x+ball.x, canvas.y-ball.y, canvas.z).set("minecraft:orange_concrete");

    //score
    level.runCommandSilent(`execute positioned ${canvas.x} ${canvas.y} ${canvas.z} run title @a[distance=..50] actionbar {"text":"${left_paddle.points} : ${right_paddle.points}","bold":true}`);
}













ItemEvents.rightClicked("minecraft:gold_nugget", e => {
    let dist = -1;
    if (e.player.isCrouching()) dist = 1;
    //move paddle
    right_paddle.y+=dist;

    if (right_paddle.y < 0 || right_paddle.y+right_paddle.height > canvas.height) {
        right_paddle.y-=dist;
    }

    paddleCollisions();
    drawLoop(e.level);
})
ItemEvents.rightClicked("minecraft:gold_ingot", e => {
    let dist = -1;
    if (e.player.isCrouching()) dist = 1;
    //move paddle
    left_paddle.y+=dist;

    if (left_paddle.y < 0 || left_paddle.y+left_paddle.height > canvas.height) {
        left_paddle.y-=dist;
    }

    paddleCollisions();
    drawLoop(e.level);
})

ItemEvents.rightClicked("minecraft:iron_nugget", e => {
   e.server.getScheduledEvents().events.forEach(v => e.player.tell("All event ids: "+v.id+" "));

    
    gameLoop(e.level);
})

ItemEvents.rightClicked("minecraft:amethyst_shard", e => {
    if (gaming) {
        e.player.tell("Game already in progress!");
        return;
    }
    gaming = true;
    e.server.scheduleRepeatingInTicks(ball.delay, () => gameLoop(e.level));
})
ItemEvents.rightClicked("minecraft:quartz", e => {
    gaming = false;
    e.server.getScheduledEvents().events.forEach(v => e.server.scheduledEvents.clear(v.id)); // clear every event cause i dont know how to select the one i want
    
})