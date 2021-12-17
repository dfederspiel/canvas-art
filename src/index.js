import Drop from "./lib/Drop";
import Wall from "./lib/Wall";
import { rand } from "./lib/helpers";
import {
  easeInElastic,
  easeInOutBack,
  easeInOutQuad,
  easeLinear,
} from "./lib/easing";
import Rect from "./lib/Rect";

// Create the canvas for the game to display in
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
document.body.appendChild(canvas);

let RIGHT_PRESSED = false;
let LEFT_PRESSED = false;
let UP_PRESSED = false;
let DOWN_PRESSED = false;

const WALL_DIVISIONS = 0
const PARTICLE_VX = 0;
const PARTICLE_VY = 0;
const ROTATION_STEP = .1;
const MAX_PARTICLES = 175;

document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowRight") RIGHT_PRESSED = true;
  else if (e.key === "ArrowLeft") LEFT_PRESSED = true;
  else if (e.key === "ArrowUp") UP_PRESSED = true;
  else if (e.key === "ArrowDown") DOWN_PRESSED = true;
});

document.addEventListener("keyup", (e) => {
  if (e.key === "ArrowRight") RIGHT_PRESSED = false;
  else if (e.key === "ArrowLeft") LEFT_PRESSED = false;
  else if (e.key === "ArrowUp") UP_PRESSED = false;
  else if (e.key === "ArrowDown") DOWN_PRESSED = false;
});

document.addEventListener("keyup", (e) => {
    if (e.key === "x") particles = [];
  });

let count = 0;
let frameNumber = 0;

const WIDTH = window.innerWidth;
const HEIGHT = window.innerHeight;

setInterval(() => {
  count++;
}, 1000);

const d = Date.now() + 10000;

let walls = [];
for (let idx = 0; idx < WALL_DIVISIONS; idx++) {
  const w = WIDTH;
  const h = 4;
  const x = rand(0, WIDTH - w);
  const y = (HEIGHT / WALL_DIVISIONS) * idx + HEIGHT / WALL_DIVISIONS / 2;

  walls.push(
    new Wall(
      x,
      y,
      w,
      h,
      `rgb(${rand(0, 255)}, ${rand(0, 255)}, ${rand(0, 255)})`
    )
  );
}

for (let idx = 0; idx < WALL_DIVISIONS; idx++) {
  const w = 4;
  const h = HEIGHT;
  const x = (WIDTH / WALL_DIVISIONS) * idx + WIDTH / WALL_DIVISIONS / 2;
  const y = rand(0, HEIGHT - h);

  walls.push(
    new Wall(
      x,
      y,
      w,
      h,
      `rgb(${rand(0, 255)}, ${rand(0, 255)}, ${rand(0, 255)})`
    )
  );
}

const WALL_WIDTH = 100;
const WALL_HEIGHT = 100;

// walls = [
// //   new Wall(
// //     WIDTH * 0.2 - WALL_WIDTH / 2,
// //     HEIGHT / 2 - WALL_HEIGHT / 2,
// //     WALL_WIDTH,
// //     WALL_HEIGHT,
// //     "#f7b267"
// //   ),
//   new Wall(
//     WIDTH / 2 - WALL_WIDTH / 2,
//     HEIGHT / 2 - WALL_HEIGHT / 2,
//     WALL_WIDTH,
//     WALL_HEIGHT,
//     "#f4845f"
//   ),
// //   new Wall(
// //     WIDTH * 0.8 - WALL_WIDTH / 2,
// //     HEIGHT / 2 - WALL_HEIGHT / 2,
// //     WALL_WIDTH,
// //     WALL_HEIGHT,
// //     "#f25c54"
// //   ),
// ];

let drops = [];
for (var x = 0; x < 1000; x++) {
  let size = Math.floor(rand(2, 12));
  drops.push(
    new Drop(
      new Rect(rand(0, WIDTH), rand(0, HEIGHT), size, size, {
        min: {
          w: 2,
          h: 2,
        },
        max: {
          w: 18,
          h: 18,
        },
      }),
      rand(15, 600),
      `rgb(160,160,160)`,
      easeInElastic,
      rand(0.01, 2),
      rand(0.01, 2),
      rand(2000, 10000)
    )
  );
}

// for (var x = 0; x < 20000; x++) {
//   let size = Math.floor(rand(2, 12));
//   drops.push(
//     new Drop(
//       new Rect(rand(0, -WIDTH), rand(0, -HEIGHT), size, size, {
//         min: {
//           w: 2,
//           h: 2,
//         },
//         max: {
//           w: 6,
//           h: 6,
//         },
//       }),
//       rand(15, 600),
//       `rgb(60,60,60)`,
//       [easeInOutBack, easeInElastic, easeInOutQuad, easeLinear][
//         Math.floor(rand(0, 4))
//       ],
//       rand(1, 5),
//       rand(1, 5),
//       rand(50, 2000)
//     )
//   );
// }

// for (var x = 0; x < 100; x++) {
//   let size = Math.floor(rand(2, 12));
//   drops.push(
//     new Drop(
//       new Rect(rand(0, WIDTH), rand(HEIGHT / 2 + 200, HEIGHT), size, size, {
//         min: {
//           w: 10,
//           h: 10,
//         },
//         max: {
//           w: 25,
//           h: 25,
//         },
//       }),
//       rand(1, 300),
//       `rgb(60,60,60)`,
//       easeInElastic
//     )
//   );
// }

// for (var x = 0; x < 100; x++) {
//   let size = Math.floor(rand(2, 12));
//   drops.push(
//     new Drop(
//       new Rect(rand(0, WIDTH), rand(HEIGHT / 2 + 200, HEIGHT), size, size, {
//         min: {
//           w: 10,
//           h: 10,
//         },
//         max: {
//           w: 25,
//           h: 25,
//         },
//       }),
//       rand(30, 60),
//       `rgb(60,60,60)`,
//       easeInOutBack
//     )
//   );
// }

// for (var x = 0; x < 100; x++) {
//   let size = rand(2, 12);
//   drops.push(
//     new Drop(
//       new Rect(rand(0, WIDTH), rand(HEIGHT / 2 + 200, HEIGHT), size, size, {
//         min: {
//           x: 10,
//           y: 10,
//         },
//         max: {
//           x: 25,
//           y: 25,
//         },
//       }),
//       rand(120, 480),
//       `rgb(60,60,60)`,
//       easeInOutQuad
//     )
//   );
// }

const displayText = () => {
  ctx.fillStyle = "rgb(255, 255, 255)";
  ctx.font = "20px Helvetica";
  ctx.textAlign = "left";
  ctx.textBaseline = "top";

  ctx.fillText("Time: " + count, 20, 20);
  ctx.fillText("Frame: " + frameNumber, 20, 50);
  ctx.fillText("FPS: " + (frameNumber / count).toFixed(2), 20, 80);

  //   ctx.textAlign = "center";
  //   ctx.fillText(walls[0].hits, WIDTH * 0.2, HEIGHT / 2 - 10);
  //   ctx.fillText(walls[1].hits, WIDTH / 2, HEIGHT / 2 - 10);
  //   ctx.fillText(walls[2].hits, WIDTH * 0.8, HEIGHT / 2 - 10);
};

// RECTANGLE/RECTANGLE
// function rectRect(drop, wall) {
//   if (
//     drop.x + drop.w >= wall.x && // r1 right edge past r2 left
//     drop.x <= wall.x + wall.w && // r1 left edge past r2 right
//     drop.y + drop.h >= wall.y && // r1 top edge past r2 bottom
//     drop.y <= wall.y + wall.h
//   ) {
//     // r1 bottom edge past r2 top
//     return true;
//   }
//   return false;
// }

function collides(r1, r2) {
  /// classic intersection test
  var hit = !(
    r1.x + r1.w < r2.x ||
    r2.x + r2.w < r1.x ||
    r1.y + r1.h < r2.y ||
    r2.y + r2.h < r1.y
  );

  /// if intersects, get angle between the two rects to determine hit zone
  if (hit) {
    /// calc angle
    var dx = r2.x + r2.w / 2 - (r1.x + r1.w / 2);
    var dy = r2.y + r2.h / 2 - (r1.y + r1.h / 2);

    /// for simplicity convert radians to degree
    var angle = (Math.atan2(dy, dx) * 180) / Math.PI;
    if (angle < 0) angle += 360;

    return angle;
  } else return null;
}

function setDirection(drop) {
  if (drop.x - drop.w / 2 >= WIDTH - drop.w && drop.xdir > 0) {
    drop.xdir = -1;
  }

  if (drop.x - drop.w / 2 <= 0 && drop.xdir < 0) {
    drop.xdir = 1;
  }

  if (drop.y - drop.h / 2 >= HEIGHT - drop.h && drop.ydir > 0) {
    drop.ydir = -1;
  }

  if (drop.y - drop.h / 2 < 0 && drop.ydir < 0) {
    drop.ydir = 1;
  }
}

function doCollision(angle, drop, wall) {
  // did we have an intersection?
  if (angle !== null) {
    /// if we're not already in a hit situation, create one
    if (!drop.hit) {
      drop.hit = true;
      const { angles } = wall;
      /// zone 1 - left
      if (
        (angle >= 0 && angle < angles.tl) ||
        (angle > angles.bl && angle < 360)
      ) {
        /// if moving in + direction deflect rect 1 in x direction etc.
        if (drop.xdir > 0) drop.xdir = -drop.xdir;
      } else if (angle >= angles.tl && angle < angles.tr) {
        /// zone 2 - top
        if (drop.ydir > 0) drop.ydir = -drop.ydir;
      } else if (angle >= angles.tr && angle < angles.br) {
        /// zone 3 - right
        if (drop.xdir < 0) drop.xdir = -drop.xdir;
      } else {
        /// zone 4 - bottom
        if (drop.ydir < 0) drop.ydir = -drop.ydir;
      }
    }
  } else drop.hit = false; /// reset hit when this hit is done (angle = null)
}

// Draw everything on the canvas
const render = function (objects) {
  ctx.globalAlpha = 0.5;
  objects.forEach((drop, idx) => {
    ctx.globalAlpha = drop.alpha;
    ctx.fillStyle = drop.colorString;
    ctx.fillRect(drop.x - drop.w / 2, drop.y - drop.h / 2, drop.w, drop.h);

    if (RIGHT_PRESSED) drop.xdir = 1;
    if (LEFT_PRESSED) drop.xdir = -1;
    if (UP_PRESSED) drop.ydir = -1;
    if (DOWN_PRESSED) drop.ydir = 1;

    drop.update();

    setDirection(drop);

    walls.forEach((wall) => {
      const angle = collides(
        {
          x: drop.x - drop.w / 2, // use a center x point to calculate trajectory
          y: drop.y - drop.h / 2, // use a center y point to calculate trajectory
          w: drop.w,
          h: drop.h,
        },
        wall
      );
      if (angle) {
        wall.hits++;
        drop.colorString = wall.colorString;
        //drop.hitTime = Date.now();
      }
      if (drop.hitTime > 0) {
        drop.alpha = easeInOutQuad(
          Date.now() - drop.hitTime,
          0,
          1,
          drop.hitEffectDuration
        );
        if (Date.now() > drop.hitTime + drop.hitEffectDuration * 2) {
          drop.hitTime = 0;
          drop.alpha = 0;
        }
      }
      doCollision(angle, drop, wall);
    });
    // console.log(walls[0].angles())
  });

  ctx.globalAlpha = 0.2;
  walls.forEach((w) => {
    ctx.fillStyle = w.colorString;
    ctx.fillRect(w.x, w.y, w.w, w.h);
  });

  ctx.globalAlpha = 1;
  displayText();
};

let angle = 0;
function getXYOnCircle(x, y, a, distance) {
  return {
    x: x + Math.cos(a) * distance,
    y: y + Math.sin(a) * distance,
  };
}

// The main game loop
let particles = [];
let particleCenterX = rand(0, WIDTH);
let particleCenterY = rand(0, HEIGHT);
let radius = rand(50, 200);
var main = function () {
  frameNumber++;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const wall = walls[0];
  const { x, y } = getXYOnCircle(
    particleCenterX,
    particleCenterY,
    angle,
    radius
  );
  particles.push(
    new Drop(
      new Rect(x, y, 10, 10, {
        min: {
          w: 10,
          h: 10,
        },
        max: {
          w: 20,
          h: 20,
        },
      }),
      120,
      `rgb(${rand(50, 255)}, ${rand(50, 255)}, ${rand(50, 255)})`,
      easeInElastic,
      PARTICLE_VX,
      PARTICLE_VY,
      2000
    )
  );
  // run the render function
  render(drops);
  render(particles);
  angle += ROTATION_STEP;
  if (angle >= 2 * Math.PI) {
    angle = 0;
    particleCenterX = rand(0, WIDTH);
    particleCenterY = rand(0, HEIGHT);
    radius = rand(50, 200);
  }
  // Request to do this again ASAP
  while (particles.length > MAX_PARTICLES) particles.shift();
  requestAnimationFrame(main);
};

// Cross-browser support for requestAnimationFrame
var w = window;
requestAnimationFrame =
  w.requestAnimationFrame ||
  w.webkitRequestAnimationFrame ||
  w.msRequestAnimationFrame ||
  w.mozRequestAnimationFrame;

main();
