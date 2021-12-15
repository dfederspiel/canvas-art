import Drop from './lib/Drop'
import { rand } from './lib/helpers';
import { easeInElastic, easeInOutBack, easeInOutQuad, easeLinear } from './lib/easing';

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

setInterval(() => { 
    count++;
}, 1000)


console.log(Date.now())
const d = Date.now() + 10000

let drops = [];
for(var x = 0; x < 5000; x++ ) {
    drops.push(
        new Drop(
            rand(0, WIDTH), 
            rand(0, HEIGHT),
            WIDTH,
            HEIGHT,
            rand(60, 240),
            `rgb(${rand(0, 0)}, ${rand(0, 0)}, ${rand(0, 125)})`,
            easeLinear
        )
    )
}
for(var x = 0; x < 1000; x++ ) {
    drops.push(
        new Drop(
            rand(0, WIDTH), 
            rand(0, HEIGHT),
            WIDTH,
            HEIGHT,
            rand(120, 480),
            `rgb(${rand(0, 0)}, ${rand(0, 0)}, ${rand(200, 255)})`,
            easeInElastic
        )
    )
}

for(var x = 0; x < 100; x++ ) {
    drops.push(
        new Drop(
            rand(0, WIDTH), 
            rand(0, HEIGHT),
            WIDTH,
            HEIGHT,
            rand(30, 45),
            `rgb(${rand(100, 200)}, ${rand(0, 0)}, ${rand(0, 0)})`,
            easeInElastic
        )
    )
}

const displayText = () => {
    // Display score and time 
    ctx.fillStyle = "rgb(255, 255, 255)";
    ctx.font = "30px Helvetica";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillText("Time: " + count, 20, 20);

    ctx.fillText("Frame: " + frameNumber, 20, 50);

    ctx.fillText("FPS: " + (frameNumber / count).toFixed(2), 20, 80)
}

// Draw everything on the canvas
var render = function () {
    frameNumber++;
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    drops.forEach((drop, idx) => {
        ctx.fillStyle = drop.colorString;
        ctx.fillRect(drop.x - drop.size / 2, drop.y - drop.size / 2, drop.size, drop.size)
        drop.update();
    })

    //displayText();
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
requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;

main();