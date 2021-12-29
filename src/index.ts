import Sprite from "./lib/Sprite";
import Wall from "./lib/Wall";
import { colorRand, rand } from "./lib/helpers";
import {
  easeInElastic,
  easeInOutQuad,
} from "./lib/easing";
import Rect from "./lib/Rect";

import { calculate } from "./lib/helpers";
import Size from "./lib/Size";

import Scene from "./lib/Scene";
import { ObjectType } from "./lib/enums";

let WIDTH = window.innerWidth;
let HEIGHT = window.innerHeight;

let canvas = document.createElement("canvas");
let ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.onresize = () => {
  WIDTH = canvas.width = window.innerWidth;
  HEIGHT = canvas.height = window.innerHeight;
};

// const scene = new Scene(WIDTH, HEIGHT);
document.body.appendChild(canvas);

let RIGHT_PRESSED = false;
let LEFT_PRESSED = false;
let UP_PRESSED = false;
let DOWN_PRESSED = false;

// In order for things to move slowly around the screen, it
let radiansPerSecond = (Math.PI * 2) / 60;
let radiansPerMinute = radiansPerSecond / 60; // 0.10471975511966 / 60 minutes = 0.001745329251994 radians
let radiansPerHour = (radiansPerMinute * 60) / 12 / 60;

let ROTATION_INTERVAL = (Math.PI * 2) / (60 * 60);
let ROTATION_ANGLE = ROTATION_INTERVAL - (Math.PI * 2) / 4;

let RADIUS = 50;
let CHECK_COLLISIONS = false;
let SPACE_BAR = false;

const WALL_DIVISIONS = 0;
const WALL_WIDTH = 5;
const WALL_HEIGHT = 5;
const MAX_PARTICLES = 1500;

document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowRight") RIGHT_PRESSED = true;
  else if (e.key === "ArrowLeft") LEFT_PRESSED = true;
  else if (e.key === "ArrowUp") UP_PRESSED = true;
  else if (e.key === "ArrowDown") DOWN_PRESSED = true;
  if (e.key === "x") {
    particles = [];
  }
  if (e.key === " ") SPACE_BAR = true;
});

document.addEventListener("keyup", (e) => {
  if (e.key === "ArrowRight") RIGHT_PRESSED = false;
  else if (e.key === "ArrowLeft") LEFT_PRESSED = false;
  else if (e.key === "ArrowUp") UP_PRESSED = false;
  else if (e.key === "ArrowDown") DOWN_PRESSED = false;

  if (e.key === "z") CHECK_COLLISIONS = !CHECK_COLLISIONS;
  if (e.key === " ") SPACE_BAR = false;
});

let count = 0;
let frameNumber = 0;

setInterval(() => {
  count++;
}, 1000);

let walls: Array<Wall> = [];
walls.push(
  new Wall(
    WIDTH * 0.3 - WALL_WIDTH / 2,
    HEIGHT / 2 - 300 / 2,
    WALL_WIDTH,
    HEIGHT * .360,
    colorRand()
  ),
  new Wall(
    WIDTH * 0.7 - WALL_WIDTH / 2,
    HEIGHT / 2 - 300 / 2,
    WALL_WIDTH,
    HEIGHT * .360,
    colorRand()
  ),
  new Wall(
    WIDTH * 0.3 - WALL_WIDTH / 2,
    HEIGHT / 2 - 300 / 2,
    WIDTH * .4,
    WALL_WIDTH,
    colorRand()
  ),
  new Wall(
    WIDTH * 0.3 - WALL_WIDTH / 2,
    HEIGHT / 2 + 300 / 2,
    WIDTH * .4,
    WALL_WIDTH,
    colorRand()
  )
);

for (let idx = 0; idx < WALL_DIVISIONS; idx++) {
  const w = WIDTH;
  const h = WALL_HEIGHT;
  const x = rand(0, WIDTH - w);
  const y =
    (HEIGHT / WALL_DIVISIONS) * idx + HEIGHT / WALL_DIVISIONS / 2;

  walls.push(
    new Wall(
      x,
      y - h / 2,
      w,
      h,
      `rgb(${rand(0, 255)}, ${rand(0, 255)}, ${rand(0, 255)})`
    )
  );
}

for (let idx = 0; idx < WALL_DIVISIONS; idx++) {
  const w = WALL_WIDTH;
  const h = HEIGHT;
  const x =
    (WIDTH / WALL_DIVISIONS) * idx + WIDTH / WALL_DIVISIONS / 2;
  const y = rand(0, HEIGHT - h);

  walls.push(
    new Wall(
      x - w / 2,
      y,
      w,
      h,
      `rgb(${rand(0, 255)}, ${rand(0, 255)}, ${rand(0, 255)})`
    )
  );
}

let backgroundGlitter: Sprite[] = [];
for (var x = 0; x < 1000; x++) {
  let sizeMin = rand(1, 3)
  let sizeMax = rand(4, 6)
  backgroundGlitter.push(
    new Sprite(
      new Rect(
        rand(0, WIDTH),
        rand(0, HEIGHT),
        rand(2, 10),
        rand(2, 10),
      ),
      rand(15, 240),
      '#000',
      easeInElastic,
      rand(-2, 2),
      rand(-2, 2),
      new Rect(40, 40, WIDTH - 40, HEIGHT - 40),
      new Size(sizeMin, sizeMin, sizeMax, sizeMax),
      rand(500, 5000),
      ObjectType.Particle,
    )
  );
}

const displayText = () => {
  ctx.fillStyle = "rgb(255, 255, 255)";
  ctx.font = "20px Helvetica";
  ctx.textAlign = "left";
  ctx.textBaseline = "top";

  ctx.fillText("Time: " + count, 20, 20);
  ctx.fillText("Frame: " + frameNumber, 20, 50);
  ctx.fillText("FPS: " + (frameNumber / count).toFixed(2), 20, 80);
};

/**
 *
 * @param {Rect} r1
 * @param {Rect} r2
 * @returns
 */
function collides(r1: Rect, r2: Rect) {
  var hit = calculate.hit(r1, r2);
  if (hit) {
    return calculate.angle(r1, r2);
  } else return null;
}

function doCollision(angle: number, obj: Sprite) {
  let { angles, speedx, speedy } = obj;
  /// zone 1 - left
  if (
    (angle >= 0 && angle < angles.tl) ||
    (angle > angles.bl && angle < 360)
  ) {
    /// if moving in + direction deflect rect 1 in x direction etc.
    if (speedx > 0) speedx = -speedx;
  } else if (angle >= angles.tl && angle < angles.tr) {
    /// zone 2 - top
    if (speedy > 0) speedy = -speedy;
  } else if (angle >= angles.tr && angle < angles.br) {
    /// zone 3 - right
    if (speedx < 0) speedx = -speedx;
  } else {
    /// zone 4 - bottom
    if (speedy < 0) speedy = -speedy;
  }
}

// Draw everything on the canvas
const render = function (objects: Array<Sprite>, checkBoundaries: boolean, checkCollisions: boolean) {
  ctx.globalAlpha = 0.5;
  objects.forEach((p, idx) => {
    const cp = {
      x: p.x - p.w / 2, // use a center x point to calculate trajectory
      y: p.y - p.h / 2, // use a center y point to calculate trajectory
      w: p.w,
      h: p.h,
    } as Rect;
    ctx.globalAlpha = p.alpha;
    ctx.fillStyle = p.colorString;
    ctx.fillRect(cp.x, cp.y, p.w, p.h);

    if (RIGHT_PRESSED) p.speedx = Math.abs(p.speedx);
    if (LEFT_PRESSED) p.speedx = -Math.abs(p.speedx);
    if (UP_PRESSED) p.speedy = -Math.abs(p.speedy);
    if (DOWN_PRESSED) p.speedy = Math.abs(p.speedy);

    p.update();

    if (checkBoundaries) {
      p.checkBoundaries();
    }

    if (checkCollisions) {
      walls.forEach((wall) => {
        const angle = collides(cp, wall);

        if (angle) {
          wall.hits++;
          p.colorString = wall.colorString;
          p.hitTime = Date.now();
          p.alpha = 1;
        }

        if (p.hitTime > 0) {
          const a = easeInOutQuad(
            Date.now() - p.hitTime,
            0,
            1,
            p.hitEffectDuration
          );
          p.alpha = 1 - a;
          if (Date.now() > p.hitTime + p.hitEffectDuration) {
            p.hitTime = 0;
            p.alpha = 0;
          }
        }

        if (angle !== null) {
          /// if we're not already in a hit situation, create one
          if (!p.hit) {
            p.hit = true;
            doCollision(angle, p);
          }
        } else p.hit = false; /// reset hit when this hit is done (angle = null)
      });
    }
  });

  walls.forEach((w) => {
    ctx.fillStyle = w.colorString;
    ctx.globalAlpha = CHECK_COLLISIONS ? 0.8 : 0.2;
    ctx.fillRect(w.x, w.y, w.w, w.h);
  });

  ctx.globalAlpha = 0.2;
  displayText();
};

function getXYOnCircle(x: number, y: number, a: number, distance: number) {
  return {
    x: x + Math.cos(a) * distance,
    y: y + Math.sin(a) * distance,
  };
}

let particles: Sprite[] = [];

function renderParticleRing(cx: number, cy: number, srcRect: Rect, radius: number, angle: number) {
  const { x, y } = getXYOnCircle(cx, cy, ROTATION_ANGLE, radius);
  let sizeMin = rand(.5, 1.5)
  let sizeMax = rand(2.5, 5)
  particles.push(
    new Sprite(
      new Rect(x, y, 3, 3),
      60,
      `rgb(${rand(209, 255)}, ${rand(211, 251)}, ${rand(158, 218)})`,
      easeInElastic,
      (x - (srcRect.x + srcRect.w / 2)) / rand(radius * 16, radius * 100),
      (y - (srcRect.y + srcRect.h / 2)) / rand(radius * 16, radius * 100),
      new Rect(
        100,
        HEIGHT / 4,
        WIDTH - 100,
        HEIGHT - HEIGHT / 4
      ),
      new Size(sizeMin, sizeMin, sizeMax, sizeMax),
      rand(2000, 10000),
      ObjectType.Particle
    )
  );
  ctx.globalAlpha = 1;
  render(particles, false, true);
  if (angle >= Math.PI * 2) {
    angle = 0;
  }
  while (particles.length > MAX_PARTICLES) particles.shift();
}

var main = function () {
  WIDTH = window.innerWidth;
  HEIGHT = window.innerHeight;
  const date = new Date();
  let timeInMs =
    (date.getHours() * 60 * 60 + date.getMinutes() * 60 + date.getSeconds()) *
    1000 +
    date.getMilliseconds();

  frameNumber++;

  // timeInMs += frameNumber * timeInMs / 1000

  ctx.clearRect(0, 0, canvas.width, canvas.height); // clear the screen

  ctx.globalAlpha = .75;
  render(backgroundGlitter, true, true);

  // Second Hand Position
  const { x: secondsX, y: secondsY } = getXYOnCircle(
    WIDTH / 2,
    HEIGHT / 2,
    (timeInMs / 1000) * radiansPerSecond - (Math.PI * 2) / 4,
    RADIUS + 20
  );

  // Minute Hand Position
  const { x: minutesX, y: minutesY } = getXYOnCircle(
    WIDTH / 2,
    HEIGHT / 2,
    (timeInMs / 1000) * radiansPerMinute - (Math.PI * 2) / 4,
    RADIUS + 100
  );

  // Hour Hand Position
  const { x: hoursX, y: hoursY } = getXYOnCircle(
    WIDTH / 2,
    HEIGHT / 2,
    (timeInMs / 1000) * radiansPerHour - (Math.PI * 2) / 4,
    RADIUS + 150
  );

  //
  const { x: secondHandOrbiterX, y: secondHandOrbiterY } = getXYOnCircle(
    secondsX,
    secondsY,
    (timeInMs / 1000) * radiansPerSecond * 60 - (Math.PI * 2) / 4,
    25
  );

  renderParticleRing(
    secondHandOrbiterX,
    secondHandOrbiterY,
    new Rect(secondsX, secondsY, 1, 1),
    10,
    10
  );

  ctx.globalAlpha = 1;

  ctx.beginPath();

  ctx.strokeStyle = "#ddd";

  ctx.moveTo(WIDTH / 2, HEIGHT / 2);
  ctx.lineTo(secondsX, secondsY);

  ctx.moveTo(WIDTH / 2, HEIGHT / 2);
  ctx.lineTo(minutesX, minutesY);

  ctx.moveTo(WIDTH / 2, HEIGHT / 2);
  ctx.lineTo(hoursX, hoursY);

  ctx.moveTo(secondsX, secondsY);
  ctx.lineTo(secondHandOrbiterX, secondHandOrbiterY);

  ctx.stroke();

  ctx.strokeStyle = "#cc0";
  ctx.fillStyle = "#cc0";

  ctx.beginPath();
  ctx.arc(WIDTH / 2, HEIGHT / 2, 15, 0, 2 * Math.PI);
  ctx.stroke();
  ctx.fill();

  ctx.beginPath();
  ctx.arc(secondsX, secondsY, 8, 0, 2 * Math.PI);
  ctx.fill();
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(minutesX, minutesY, 10, 0, 2 * Math.PI);

  ctx.stroke();
  ctx.fill();

  ctx.beginPath();
  ctx.arc(hoursX, hoursY, 12, 0, 2 * Math.PI);

  ctx.fill();
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(secondHandOrbiterX, secondHandOrbiterY, 5, 0, 2 * Math.PI);
  ctx.fill();

  ctx.textAlign = "center";
  ctx.textBaseline = "top";
  ctx.fillStyle = '#000'
  ctx.font = "10px Helvetica";
  ctx.fillText(`${date.getSeconds()}`, secondsX, secondsY - 5)
  ctx.font = "12px Helvetica";
  ctx.fillText(`${date.getMinutes()}`, minutesX, minutesY - 6)
  ctx.font = "16px Helvetica";
  ctx.fillText(`${date.getHours() > 12 ? date.getHours() - 12 : date.getHours()}`, hoursX, hoursY - 8)

  requestAnimationFrame(main);
  //   ROTATION_ANGLE += ROTATION_INTERVAL;
};

main();
