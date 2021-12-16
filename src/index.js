import Drop from "./lib/Drop";
import Wall from "./lib/Wall";
import { rand } from "./lib/helpers";
import {
  easeInElastic,
  easeInOutBack,
  easeInOutQuad,
  easeLinear,
} from "./lib/easing";

// Create the canvas for the game to display in
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
document.body.appendChild(canvas);

let count = 0;
let frameNumber = 0;

const WIDTH = window.innerWidth;
const HEIGHT = window.innerHeight;

const DROP_SIZE = 10;

setInterval(() => {
  count++;
}, 1000);

const d = Date.now() + 10000;

const WALL_WIDTH = 100;
const WALL_HEIGHT = 100;
const wall = new Wall(
  WIDTH / 2 - WALL_WIDTH / 2,
  HEIGHT / 2 - WALL_HEIGHT / 2,
  WALL_WIDTH,
  WALL_HEIGHT,
  "rgb(200, 0, 0)"
);

const wall2 = new Wall(
  WIDTH * 0.2 - WALL_WIDTH / 2,
  HEIGHT / 2 - WALL_HEIGHT / 2,
  WALL_WIDTH,
  WALL_HEIGHT,
  "rgb(0, 200, 0)"
);

const wall3 = new Wall(
  WIDTH * 0.8 - WALL_WIDTH / 2,
  HEIGHT / 2 - WALL_HEIGHT / 2,
  WALL_WIDTH,
  WALL_HEIGHT,
  "rgb(0, 0, 200)"
);

let drops = [];
for (var x = 0; x < 15000; x++) {
  let size = DROP_SIZE * Math.random();
  drops.push(
    new Drop(
      rand(0, WIDTH),
      rand(0, HEIGHT),
      5,
      5,
      rand(60, 240),
      `rgb(60,60,60)`,
      easeLinear
    )
  );
}
for (var x = 0; x < 500; x++) {
  drops.push(
    new Drop(
      rand(0, WIDTH),
      rand(0, HEIGHT),
      15,
      15,
      rand(120, 480),
      `rgb(60,60,60)`,
      easeInElastic
    )
  );
}

for (var x = 0; x < 100; x++) {
  drops.push(
    new Drop(
      rand(0, WIDTH),
      rand(0, HEIGHT),
      25,
      25,
      rand(30, 45),
      `rgb(60,60,60)`,
      easeInElastic
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

  ctx.textAlign = "center";
  ctx.fillText(box1hits, WIDTH * 0.2, HEIGHT / 2 - 10);
  ctx.fillText(box2hits, WIDTH / 2, HEIGHT / 2 - 10);
  ctx.fillText(box3hits, WIDTH * 0.8, HEIGHT / 2 - 10);
};

// RECTANGLE/RECTANGLE
function rectRect(drop, wall) {
  if (
    drop.x + drop.w >= wall.x && // r1 right edge past r2 left
    drop.x <= wall.x + wall.w && // r1 left edge past r2 right
    drop.y + drop.h >= wall.y && // r1 top edge past r2 bottom
    drop.y <= wall.y + wall.h
  ) {
    // r1 bottom edge past r2 top
    return true;
  }
  return false;
}

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

  if (drop.x >= WIDTH - drop.w && drop.xdir > 0) {
    drop.xdir = -1;
  }

  if (drop.x <= 0 && drop.xdir < 0) {
    drop.xdir = 1;
  }

  if (drop.y >= HEIGHT - drop.h && drop.ydir > 0) {
    drop.ydir = -1;
  }

  if (drop.y < 0 && drop.ydir < 0) {
    drop.ydir = 1;
  }
}

function doCollision(angle, drop) {
  // did we have an intersection?
  if (angle !== null) {
    /// if we're not already in a hit situation, create one
    if (!drop.hit) {
      drop.hit = true;
      /// zone 1 - left
      if ((angle >= 0 && angle < 45) || (angle > 315 && angle < 360)) {
        /// if moving in + direction deflect rect 1 in x direction etc.
        if (drop.xdir > 0) drop.xdir = -drop.xdir;
      } else if (angle >= 45 && angle < 135) {
        /// zone 2 - top
        if (drop.ydir > 0) drop.ydir = -drop.ydir;
      } else if (angle >= 135 && angle < 225) {
        /// zone 3 - right
        if (drop.xdir < 0) drop.xdir = -drop.xdir;
      } else {
        /// zone 4 - bottom
        if (drop.ydir < 0) drop.ydir = -drop.ydir;
      }
    }
  } else drop.hit = false; /// reset hit when this hit is done (angle = null)
}

let box1hits = 0;
let box2hits = 0;
let box3hits = 0;

// Draw everything on the canvas
const render = function () {
  frameNumber++;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drops.forEach((drop, idx) => {
    ctx.fillStyle = drop.colorString;
    ctx.fillRect(drop.x, drop.y, drop.w, drop.h);

    drop.update();

    setDirection(drop);

    const angle = collides(drop, wall);
    if (angle) {
      box1hits++;
      drop.colorString = 'rgb(120, 0, 0)';
    }
    doCollision(angle, drop);
    const angle2 = collides(drop, wall2);
    if (angle2) {
      box2hits++;
      drop.colorString = 'rgb(0, 120, 0)';
    }
    doCollision(angle2, drop);
    const angle3 = collides(drop, wall3);
    if (angle3) {
      box3hits++;
      drop.colorString = 'rgb(0, 0, 120)';
    }
    doCollision(angle3, drop);
  });
  
  ctx.fillStyle = wall.fillStyle;
  ctx.fillRect(wall.x, wall.y, wall.w, wall.h);
  ctx.fillStyle = wall2.fillStyle;
  ctx.fillRect(wall2.x, wall2.y, wall2.w, wall2.h);
  ctx.fillStyle = wall3.fillStyle;
  ctx.fillRect(wall3.x, wall3.y, wall3.w, wall3.h);

  displayText();
};

// The main game loop
var main = function () {
  // run the update function
  //update(0.02); // do not change
  // run the render function
  render();
  // Request to do this again ASAP
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
