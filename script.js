const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let frames = 0;
const DEGREE = Math.PI/180;

// Load sprite (optional, you can replace with colors)
const bird = {
  x: 50,
  y: 150,
  width: 30,
  height: 30,
  gravity: 0.25,
  jump: 4.6,
  velocity: 0,
  draw() {
    ctx.fillStyle = "yellow";
    ctx.fillRect(this.x, this.y, this.width, this.height);
  },
  flap() {
    this.velocity = -this.jump;
  },
  update() {
    this.velocity += this.gravity;
    this.y += this.velocity;

    if (this.y + this.height >= canvas.height) {
      this.y = canvas.height - this.height;
      gameOver = true;
    }
  }
};

const pipes = [];
const pipeWidth = 60;
const pipeGap = 120;

function drawPipes() {
  ctx.fillStyle = "green";
  for (let i = 0; i < pipes.length; i++) {
    let p = pipes[i];
    ctx.fillRect(p.x, 0, pipeWidth, p.top);
    ctx.fillRect(p.x, p.top + pipeGap, pipeWidth, canvas.height - (p.top + pipeGap));
  }
}

function updatePipes() {
  if (frames % 100 === 0) {
    let top = Math.floor(Math.random() * (canvas.height - pipeGap - 50)) + 20;
    pipes.push({ x: canvas.width, top: top });
  }

  for (let i = 0; i < pipes.length; i++) {
    let p = pipes[i];
    p.x -= 2;

    // Collision detection
    if (
      bird.x < p.x + pipeWidth &&
      bird.x + bird.width > p.x &&
      (bird.y < p.top || bird.y + bird.height > p.top + pipeGap)
    ) {
      gameOver = true;
    }

    if (p.x + pipeWidth < 0) {
      pipes.splice(i, 1);
      score++;
    }
  }
}

let score = 0;
let gameOver = false;

function drawScore() {
  ctx.fillStyle = "#000";
  ctx.font = "30px Arial";
  ctx.fillText(score, canvas.width/2, 50);
}

function loop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  bird.update();
  bird.draw();

  updatePipes();
  drawPipes();

  drawScore();

  frames++;

  if (!gameOver) {
    requestAnimationFrame(loop);
  } else {
    ctx.fillStyle = "red";
    ctx.font = "40px Arial";
    ctx.fillText("Game Over", canvas.width/2 - 100, canvas.height/2);
  }
}

document.addEventListener("keydown", function(e) {
  if (e.code === "Space") {
    bird.flap();
  }
});

loop();
