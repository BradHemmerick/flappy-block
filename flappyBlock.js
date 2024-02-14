const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let block = {
    x: 50,
    y: 150,
    width: 30,
    height: 30,
    gravity: 0.6,
    lift: -11.5,
    velocity: 0
};

let pipes = [];
let pipeWidth = 50;
let gap = 120;
let frameCount = 0;

function drawblock() {
    ctx.fillStyle = "yellow";
    ctx.fillRect(block.x, block.y, block.width, block.height);
}

function updateblock() {
    block.velocity += block.gravity;
    block.y += block.velocity;

    if (block.y + block.height > canvas.height) {
        block.y = canvas.height - block.height;
        block.velocity = 0;
    }

    if (block.y < 0) {
        block.y = 0;
        block.velocity = 0;
    }
}

function drawPipes() {
    for (let i = 0; i < pipes.length; i++) {
        ctx.fillStyle = "green";
        ctx.fillRect(pipes[i].x, 0, pipeWidth, pipes[i].top);
        ctx.fillRect(pipes[i].x, canvas.height - pipes[i].bottom, pipeWidth, pipes[i].bottom);
    }
}

function updatePipes() {
    if (frameCount % 90 === 0) {
        let topHeight = Math.floor(Math.random() * (canvas.height - gap));
        let bottomHeight = canvas.height - topHeight - gap;
        pipes.push({ x: canvas.width, top: topHeight, bottom: bottomHeight });
    }

    for (let i = pipes.length - 1; i >= 0; i--) {
        pipes[i].x -= 2;

        if (pipes[i].x + pipeWidth < 0) {
            pipes.splice(i, 1);
        }
    }
}

function collisionDetection() {
    for (let i = 0; i < pipes.length; i++) {
        if (block.x < pipes[i].x + pipeWidth &&
            block.x + block.width > pipes[i].x &&
            (block.y < pipes[i].top || block.y + block.height > canvas.height - pipes[i].bottom)) {
            resetGame();
        }
    }
}

function resetGame() {
    block.y = 150;
    block.velocity = 0;
    pipes = [];
    frameCount = 0;
}

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    updateblock();
    drawblock();

    updatePipes();
    drawPipes();

    collisionDetection();

    frameCount++;

    requestAnimationFrame(gameLoop);
}

document.addEventListener("keydown", function(event) {
    if (event.code === "Space") {
        block.velocity += block.lift;
    }
});

gameLoop();
