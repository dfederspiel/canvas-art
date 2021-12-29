import ClockScene from "./scenes/Clock/ClockScene";
import SeaSpaceScene from "./scenes/SeaSpace/SeaSpace.scene";

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
const clockScene = new ClockScene(WIDTH, HEIGHT, ctx)
const seaSpaceScene = new SeaSpaceScene(WIDTH, HEIGHT, ctx);

let SCENE: number = 0;

var main = function () {

  ctx.clearRect(0, 0, canvas.width, canvas.height); // clear the screen

  switch (SCENE) {
    case 0:
      clockScene.render();
      break;
    case 1:
      seaSpaceScene.render();
      break;
  }

  frameNumber++;
  requestAnimationFrame(main);
};


document.addEventListener("keydown", (e) => {
  if (e.key === "1") SCENE = 0;
  if (e.key === "2") SCENE = 1;
  if (e.key === "3") SCENE = 2;
  if (e.key === "4") SCENE = 3;
  if (e.key === "5") SCENE = 4;
});

main();
