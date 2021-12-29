import Scene from "./scenes/Clock/ClockScene";

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

document.body.appendChild(canvas);


let count = 0;

setInterval(() => {
  count++;
}, 1000);


let frameNumber = 0;
const clockScene = new Scene(WIDTH, HEIGHT, ctx)

const SCENE = 0;

var main = function () {

  ctx.clearRect(0, 0, canvas.width, canvas.height); // clear the screen

  switch (SCENE) {
    case 0:
      clockScene.render();
      break;
  }

  frameNumber++;
  requestAnimationFrame(main);
};

main();
