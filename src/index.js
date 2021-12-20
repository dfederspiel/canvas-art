import Drop from "./lib/Drop";
import Wall from "./lib/Wall";
import { rand } from "./lib/helpers";
import {
  easeInCubic,
  easeInElastic,
  easeInOutQuad,
  effects,
} from "./lib/easing";
import Rect from "./lib/Rect";

import { calculate } from "./lib/helpers";
import Size from "./lib/Size";

import Scene from "./lib/Scene";

const scene = new Scene(window.innerWidth, window.innerHeight);
document.body.appendChild(scene.canvas);

let RIGHT_PRESSED = false;
let LEFT_PRESSED = false;
let UP_PRESSED = false;
let DOWN_PRESSED = false;

let radiansPerSecond = (Math.PI * 2) / 60;
let radiansPerMinute = radiansPerSecond / 60;
let radiansPerHour = (radiansPerMinute * 5) / 60;
let ROTATION_INTERVAL = (Math.PI * 2) / (60 * 60);
let ROTATION_ANGLE = ROTATION_INTERVAL - (Math.PI * 2) / 4;
let ROTATION_ANGLE_MINUTES = ROTATION_ANGLE;

console.log(radiansPerHour, radiansPerMinute, radiansPerSecond);

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
  ROTATION_ANGLE_MINUTES += ROTATION_INTERVAL;
}, 1000);

let walls = [];
// walls.push(
//   new Wall(
//     scene.width * 0.3 - WALL_WIDTH / 2,
//     scene.height / 2 - 300 / 2,
//     WALL_WIDTH,
//     300,
//     "#f00"
//   ),
//   new Wall(
//     scene.width / 2 - WALL_WIDTH / 2,
//     scene.height / 2 - WALL_HEIGHT / 2,
//     WALL_WIDTH,
//     WALL_HEIGHT,
//     "#0f0"
//   ),
//   new Wall(
//     scene.width * 0.7 - WALL_WIDTH / 2,
//     scene.height / 2 - 300 / 2,
//     WALL_WIDTH,
//     300,
//     "#00f"
//   )
// );

for (let idx = 0; idx < WALL_DIVISIONS; idx++) {
  const w = scene.width;
  const h = WALL_HEIGHT;
  const x = rand(0, scene.width - w);
  const y =
    (scene.height / WALL_DIVISIONS) * idx + scene.height / WALL_DIVISIONS / 2;

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
  const h = scene.height;
  const x =
    (scene.width / WALL_DIVISIONS) * idx + scene.width / WALL_DIVISIONS / 2;
  const y = rand(0, scene.height - h);

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

let backgroundGlitter = [];
for (var x = 0; x < 1000; x++) {
  backgroundGlitter.push(
    new Drop(
      new Rect(
        rand(0, window.innerWidth),
        rand(0, window.innerHeight),
        10,
        10,
        new Size(2, 2, rand(10, 10), rand(10, 10))
      ),
      rand(15, 600),
      `rgb(160,160,160)`,
      easeInElastic,
      rand(-1, 1),
      rand(-0.2, 0.2),
      rand(2000, 10000),
      new Rect(40, 40, scene.width - 40, scene.height - 40)
    )
  );
}

const displayText = () => {
  scene.ctx.fillStyle = "rgb(255, 255, 255)";
  scene.ctx.font = "20px Helvetica";
  scene.ctx.textAlign = "left";
  scene.ctx.textBaseline = "top";

  scene.ctx.fillText("Time: " + count, 20, 20);
  scene.ctx.fillText("Frame: " + frameNumber, 20, 50);
  scene.ctx.fillText("FPS: " + (frameNumber / count).toFixed(2), 20, 80);
};

/**
 *
 * @param {Rect} r1
 * @param {Rect} r2
 * @returns
 */
function collides(r1, r2) {
  var hit = calculate.hit(r1, r2);
  if (hit) {
    return calculate.angle(r1, r2);
  } else return null;
}

// function deflectBoundaries(drop) {
//   if (drop.x - drop.w / 2 >= scene.width - drop.w && drop.speedx > 0) {
//     drop.speedx = -drop.speedx;
//   }

//   if (drop.x - drop.w / 2 <= 0 && drop.speedx < 0) {
//     drop.speedx = -drop.speedx;
//   }

//   if (drop.y - drop.h / 2 >= scene.height - drop.h && drop.speedy > 0) {
//     drop.speedy = -drop.speedy;
//   }

//   if (drop.y - drop.h / 2 < 0 && drop.speedy < 0) {
//     drop.speedy = -drop.speedy;
//   }
// }

function doCollision(angle, obj, wall) {
  // did we have an intersection?
  if (angle !== null) {
    /// if we're not already in a hit situation, create one
    if (!obj.hit) {
      obj.hit = true;
      const { angles } = wall;
      /// zone 1 - left
      if (
        (angle >= 0 && angle < angles.tl) ||
        (angle > angles.bl && angle < 360)
      ) {
        /// if moving in + direction deflect rect 1 in x direction etc.
        if (obj.speedx > 0) obj.speedx = -obj.speedx;
      } else if (angle >= angles.tl && angle < angles.tr) {
        /// zone 2 - top
        if (obj.speedy > 0) obj.speedy = -obj.speedy;
      } else if (angle >= angles.tr && angle < angles.br) {
        /// zone 3 - right
        if (obj.speedx < 0) obj.speedx = -obj.speedx;
      } else {
        /// zone 4 - bottom
        if (obj.speedy < 0) obj.speedy = -obj.speedy;
      }
    }
  } else obj.hit = false; /// reset hit when this hit is done (angle = null)
}

// Draw everything on the canvas
const render = function (objects, checkBoundaries, checkCollisions) {
  scene.ctx.globalAlpha = 0.5;
  objects.forEach((p, idx) => {
    const cp = {
      x: p.x - p.w / 2, // use a center x point to calculate trajectory
      y: p.y - p.h / 2, // use a center y point to calculate trajectory
      w: p.w,
      h: p.h,
    };
    scene.ctx.globalAlpha = p.alpha;
    scene.ctx.fillStyle = p.colorString;
    scene.ctx.fillRect(cp.x, cp.y, p.w, p.h);

    // if (RIGHT_PRESSED) p.speedx = Math.abs(p.speedx);
    // if (LEFT_PRESSED) p.speedx = -Math.abs(p.speedx);
    // if (UP_PRESSED) p.speedy = -Math.abs(p.speedy);
    // if (DOWN_PRESSED) p.speedy = Math.abs(p.speedy);

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
        doCollision(angle, p, wall);
      });
    }
  });

  walls.forEach((w) => {
    scene.ctx.fillStyle = w.colorString;
    scene.ctx.globalAlpha = CHECK_COLLISIONS ? 0.8 : 0.2;
    scene.ctx.fillRect(w.x, w.y, w.w, w.h);
  });

  scene.ctx.globalAlpha = 0.2;
  displayText();
};

let angle = 0;
function getXYOnCircle(x, y, a, distance) {
  return {
    x: x + Math.cos(a) * distance,
    y: y + Math.sin(a) * distance,
  };
}

let particles = [];

function renderParticleRing(cx, cy, srcRect, radius) {
  const { x, y } = getXYOnCircle(cx, cy, ROTATION_ANGLE, radius);
  particles.push(
    new Drop(
      new Rect(x, y, 1, 1, new Size(2, 2, 5, 5)),
      60,
      `rgb(${rand(50, 255)}, ${rand(50, 255)}, ${rand(0, 0)})`,
      easeInElastic,
      (x - (srcRect.x + srcRect.w / 2)) / rand(radius * 16, radius * 100),
      (y - (srcRect.y + srcRect.h / 2)) / rand(radius * 16, radius * 100),
      60,
      new Rect(
        100,
        scene.height / 4,
        scene.width - 100,
        scene.height - scene.height / 4
      )
    )
  );
  scene.ctx.globalAlpha = 1;
  render(particles, CHECK_COLLISIONS, CHECK_COLLISIONS);
  if (angle >= Math.PI * 2) {
    angle = 0;
  }
  while (particles.length > MAX_PARTICLES) particles.shift();
}

var main = function () {
  const date = new Date();
  let timeInMs =
    (date.getHours() * 60 * 60 + date.getMinutes() * 60 + date.getSeconds()) *
      1000 +
    date.getMilliseconds();
  frameNumber++;
  scene.ctx.clearRect(0, 0, scene.canvas.width, scene.canvas.height); // clear the screen
  render(backgroundGlitter, true);

  // Second Hand Position
  const { x: secondsX, y: secondsY } = getXYOnCircle(
    scene.width / 2,
    scene.height / 2,
    (timeInMs / 1000) * radiansPerSecond - (Math.PI * 2) / 4,
    RADIUS + 30
  );

  // Minute Hand Position
  const { x: minutesX, y: minutesY } = getXYOnCircle(
    scene.width / 2,
    scene.height / 2,
    (timeInMs / 1000) * radiansPerMinute - (Math.PI * 2) / 4,
    RADIUS + 100
  );

  // Hour Hand Position
  const { x: hoursX, y: hoursY } = getXYOnCircle(
    scene.width / 2,
    scene.height / 2,
    (timeInMs / 1000) * radiansPerHour - (Math.PI * 2) / 4,
    RADIUS + 150
  );

  //
  const { x: secondHandOrbiterX, y: secondHandOrbiterY } = getXYOnCircle(
    secondsX,
    secondsY,
    ROTATION_ANGLE * 60,
    25
  );

  // renderParticleRing(
  //   scene.width / 2,
  //   scene.height / 2,
  //   new Rect(scene.width / 2, scene.height / 2, 50, 50),
  //   RADIUS
  // );

  // renderParticleRing(
  //   secondHandOrbiterX,
  //   secondHandOrbiterY,
  //   new Rect(scene.width / 2, scene.height / 2, 20, 20),
  //   4
  // );

  scene.ctx.globalAlpha = 0.9;
  scene.ctx.beginPath();

  scene.ctx.fillStyle = "red";
  scene.ctx.fillRect(scene.width / 2 - 10, scene.height / 2 - 10, 20, 20);
  scene.ctx.strokeStyle = "#cc0";
  scene.ctx.fillStyle = "#cc0";
  scene.ctx.arc(scene.width / 2, scene.height / 2, 20, 0, 2 * Math.PI);
  scene.ctx.stroke();
  scene.ctx.fill();

  scene.ctx.beginPath();
  scene.ctx.strokeStyle = "#cc0";
  scene.ctx.fillStyle = "#cc0";
  scene.ctx.arc(secondsX, secondsY, 10, 0, 2 * Math.PI);
  scene.ctx.stroke();
  scene.ctx.fill();

  scene.ctx.beginPath();
  scene.ctx.fillStyle = "#fff";
  scene.ctx.arc(minutesX, minutesY, 12, 0, 2 * Math.PI);
  scene.ctx.stroke();
  scene.ctx.fill();

  scene.ctx.beginPath();
  scene.ctx.fillStyle = "#fff";
  scene.ctx.arc(hoursX, hoursY, 12, 0, 2 * Math.PI);
  scene.ctx.stroke();
  scene.ctx.fill();

  scene.ctx.globalAlpha = 1;
  scene.ctx.fillStyle = "#369";
  scene.ctx.fillRect(secondHandOrbiterX - 2.5, secondHandOrbiterY - 2.5, 5, 5);

  scene.ctx.beginPath();

  scene.ctx.strokeStyle = "#cc0";
  scene.ctx.fillStyle = "#cc0";
  scene.ctx.arc(secondHandOrbiterX, secondHandOrbiterY, 5, 0, 2 * Math.PI);
  scene.ctx.fill();

  scene.ctx.strokeStyle = "#fff";
  // scene.ctx.moveTo(scene.width / 2, scene.height / 2);
  // scene.ctx.lineTo(q, r);
  // scene.ctx.moveTo(scene.width / 2, scene.height / 2);
  // scene.ctx.lineTo(x, y);
  // scene.ctx.moveTo(f, g);
  // scene.ctx.lineTo(x, y);
  // scene.ctx.moveTo(f, g);
  // scene.ctx.lineTo(scene.width / 2, scene.height / 2);

  scene.ctx.stroke();

  requestAnimationFrame(main);
  ROTATION_ANGLE += ROTATION_INTERVAL;
};

main();
