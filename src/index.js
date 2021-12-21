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

// In order for things to move slowly around the screen, it
let radiansPerSecond = (Math.PI * 2) / 60;
let radiansPerMinute = radiansPerSecond / 60; // 0.10471975511966 / 60 minutes = 0.001745329251994 radians
let radiansPerHour = (radiansPerMinute * 60) / 12 / 60;
let ROTATION_INTERVAL = (Math.PI * 2) / (60 * 60);
let ROTATION_ANGLE = ROTATION_INTERVAL - (Math.PI * 2) / 4;

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
walls.push(
  new Wall(
    scene.width * 0.3 - WALL_WIDTH / 2,
    scene.height / 2 - 300 / 2,
    WALL_WIDTH,
    300,
    "#F51720"
  ),
//   new Wall(
//     scene.width / 2 - WALL_WIDTH / 2,
//     scene.height / 2 - WALL_HEIGHT / 2,
//     WALL_WIDTH,
//     WALL_HEIGHT,
//     "#0f0"
//   ),
  new Wall(
    scene.width * 0.7 - WALL_WIDTH / 2,
    scene.height / 2 - 300 / 2,
    WALL_WIDTH,
    300,
    "#F51720"
  )
);

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

function renderParticleRing(cx, cy, srcRect, radius, angle) {
  const { x, y } = getXYOnCircle(cx, cy, ROTATION_ANGLE, radius);
  particles.push(
    new Drop(
      new Rect(x, y, 1, 1, new Size(2, 2, 6, 6)),
      60,
      `rgb(${rand(209, 255)}, ${rand(211, 251)}, ${rand(158, 218)})`,
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
  render(particles, false, false);
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
  
  render(backgroundGlitter, true, true);

  // Second Hand Position
  const { x: secondsX, y: secondsY } = getXYOnCircle(
    scene.width / 2,
    scene.height / 2,
    (timeInMs / 1000) * radiansPerSecond - (Math.PI * 2) / 4,
    RADIUS + 20
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
    (timeInMs / 1000) * radiansPerSecond * 60 - (Math.PI * 2) / 4,
    25
  );

  renderParticleRing(
    secondHandOrbiterX,
    secondHandOrbiterY,
    new Rect(scene.width / 2, scene.height / 2, 20, 20),
    10
  );

  scene.ctx.globalAlpha = 1;

  scene.ctx.beginPath();

  scene.ctx.strokeStyle = "#ddd";

  scene.ctx.moveTo(scene.width / 2, scene.height / 2);
  scene.ctx.lineTo(secondsX, secondsY);

  scene.ctx.moveTo(scene.width / 2, scene.height / 2);
  scene.ctx.lineTo(minutesX, minutesY);

  scene.ctx.moveTo(scene.width / 2, scene.height / 2);
  scene.ctx.lineTo(hoursX, hoursY);

  scene.ctx.moveTo(secondsX, secondsY);
  scene.ctx.lineTo(secondHandOrbiterX, secondHandOrbiterY);

  scene.ctx.stroke();

  scene.ctx.strokeStyle = "#cc0";
  scene.ctx.fillStyle = "#cc0";

  scene.ctx.beginPath();
  scene.ctx.arc(scene.width / 2, scene.height / 2, 15, 0, 2 * Math.PI);
  scene.ctx.stroke();
  scene.ctx.fill();

  scene.ctx.beginPath();
  scene.ctx.arc(secondsX, secondsY, 8, 0, 2 * Math.PI);
  scene.ctx.fill();
  scene.ctx.stroke();
  
  scene.ctx.beginPath();
  scene.ctx.arc(minutesX, minutesY, 10, 0, 2 * Math.PI);
  
  scene.ctx.stroke();
  scene.ctx.fill();
  
  scene.ctx.beginPath();
  scene.ctx.arc(hoursX, hoursY, 12, 0, 2 * Math.PI);
  
  scene.ctx.fill();
  scene.ctx.stroke();
  
  scene.ctx.beginPath();
  scene.ctx.arc(secondHandOrbiterX, secondHandOrbiterY, 5, 0, 2 * Math.PI);
  scene.ctx.fill();
  
  scene.ctx.textAlign = "center";
  scene.ctx.textBaseline = "top";
  scene.ctx.fillStyle = '#000'
  scene.ctx.font = "10px Helvetica";
  scene.ctx.fillText(date.getSeconds(), secondsX, secondsY - 5)
  scene.ctx.font = "12px Helvetica";
  scene.ctx.fillText(date.getMinutes(), minutesX, minutesY - 6)
  scene.ctx.font = "16px Helvetica";
  scene.ctx.fillText(date.getHours() > 12 ? date.getHours() - 12 : date.getHours(), hoursX, hoursY - 8)

  requestAnimationFrame(main);
//   ROTATION_ANGLE += ROTATION_INTERVAL;
};

main();
