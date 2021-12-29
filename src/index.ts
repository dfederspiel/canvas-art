import ClockScene from "./scenes/Clock/ClockScene";
import OrbiterScene from "./scenes/Orbiter/Orbiter.scene";
import SeaSpaceScene from "./scenes/SeaSpace/SeaSpace.scene";
import WallsScene from "./scenes/Walls/Walls.scene";

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


let clockScene = new ClockScene(WIDTH, HEIGHT, ctx)
let seaSpaceScene = new SeaSpaceScene(WIDTH, HEIGHT, ctx);
let wallsScene = new WallsScene(WIDTH, HEIGHT, ctx);
let orbiterScene = new OrbiterScene(WIDTH, HEIGHT, ctx);

let SCENE: number = 0;
let title = '';

var main = function () {

  ctx.clearRect(0, 0, canvas.width, canvas.height); // clear the screen

  switch (SCENE) {
    case 0:
      title = "Clock"
      clockScene.render();
      break;
    case 1:
      title = "Sea Space"
      seaSpaceScene.render();
      break;
    case 2:
      title = "Walls"
      wallsScene.render();
      break;
    case 3:
      title = "Orbiters"
      orbiterScene.render();
      break;
  }

  ctx.globalAlpha = .85;
  ctx.fillStyle = '#fff';
  ctx.font = '24px Arial'
  ctx.fillText(title, WIDTH / 2, 10);

  requestAnimationFrame(main);
};


document.addEventListener("keydown", (e) => {
  if (e.key === "1") {
    clockScene = new ClockScene(WIDTH, HEIGHT, ctx);
    SCENE = 0;
  }
  if (e.key === "2") {
    seaSpaceScene = new SeaSpaceScene(WIDTH, HEIGHT, ctx);
    SCENE = 1
  };
  if (e.key === "3") {
    wallsScene = new WallsScene(WIDTH, HEIGHT, ctx);
    SCENE = 2
  };
  if (e.key === "4") {
    orbiterScene = new OrbiterScene(WIDTH, HEIGHT, ctx);
    SCENE = 3
  };
});

main();
