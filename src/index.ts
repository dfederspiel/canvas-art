import { Scene } from "./lib/types";
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


type Page = {
  title: string
  scene: Scene
}
let pages: Page[] = [
  { title: 'Clock', scene: new ClockScene(WIDTH, HEIGHT, ctx) },
  { title: 'Sea Space', scene: new SeaSpaceScene(WIDTH, HEIGHT, ctx) },
  { title: 'Walls', scene: new WallsScene(WIDTH, HEIGHT, ctx) },
  { title: 'Orbiters', scene: new OrbiterScene(WIDTH, HEIGHT, ctx) },
]

let SCENE: number = 0;

var main = function () {
  ctx.clearRect(0, 0, canvas.width, canvas.height); // clear the screen

  pages[SCENE].scene.render();

  ctx.globalAlpha = .85;
  ctx.fillStyle = '#fff';
  ctx.font = '24px Arial'
  ctx.textAlign = 'left';
  ctx.fillText(`Scene ${SCENE + 1}: ${pages[SCENE].title}`, 10, 10);
  ctx.font = '16px Arial'
  ctx.fillText(`Press 1-${pages.length} to switch scenes`, 10, 40);

  requestAnimationFrame(main);
};


document.addEventListener("keydown", (e) => {
  if (e.key === "1") {
    pages[0].scene = new ClockScene(WIDTH, HEIGHT, ctx);
    SCENE = 0;
  }
  if (e.key === "2") {
    pages[1].scene = new SeaSpaceScene(WIDTH, HEIGHT, ctx);
    SCENE = 1
  };
  if (e.key === "3") {
    pages[2].scene = new WallsScene(WIDTH, HEIGHT, ctx);
    SCENE = 2
  };
  if (e.key === "4") {
    pages[3].scene = new OrbiterScene(WIDTH, HEIGHT, ctx);
    SCENE = 3
  };
});

main();
