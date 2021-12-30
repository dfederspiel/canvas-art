import { Scene } from "./lib/types";
import ClockScene from "./scenes/Clock/Clock.scene";
import FlowersScene from "./scenes/Flowers/Flowers.scene";
import OrbiterScene from "./scenes/Orbiter/Orbiter.scene";
import SeaSpaceScene from "./scenes/SeaSpace/SeaSpace.scene";
import WallsScene from "./scenes/Walls/Walls.scene";
import WaterfallScene from "./scenes/Waterfall/Waterfall.scene";

let WIDTH = window.innerWidth;
let HEIGHT = window.innerHeight;

let canvas: HTMLCanvasElement;
let ctx: CanvasRenderingContext2D;

canvas = document.createElement("canvas");
ctx = canvas.getContext("2d");

canvas.width = WIDTH;
canvas.height = HEIGHT;
document.body.appendChild(canvas);

window.onresize = () => {
  WIDTH = canvas.width = window.innerWidth;
  HEIGHT = canvas.height = window.innerHeight;
};

let count = 0;

setInterval(() => {
  count++;
}, 1000);


function renderTitle() {
  ctx.globalAlpha = .85;
  ctx.fillStyle = '#fff';
  ctx.font = '24px Arial';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  ctx.fillText(`Scene ${PAGE}: ${pages[PAGE - 1].title}`, 10, 10);
  ctx.font = '16px Arial';
  ctx.fillText(`Press 1-${pages.length} to switch scenes`, 10, 40);
}

type Page = {
  title: string
  scene: Scene
}

let pages: Page[] = [
  { title: 'Space Clock', scene: new ClockScene(canvas.width, canvas.height, ctx) },
  { title: 'Sea Space', scene: new SeaSpaceScene(WIDTH, HEIGHT, ctx) },
  { title: 'Walls', scene: new WallsScene(WIDTH, HEIGHT, ctx) },
  { title: 'Orbiters', scene: new OrbiterScene(WIDTH, HEIGHT, ctx) },
  { title: 'Flowers', scene: new FlowersScene(WIDTH, HEIGHT, ctx) },
  { title: 'Waterfall', scene: new WaterfallScene(WIDTH, HEIGHT, ctx) },
]

let PAGE: number = parseInt(localStorage.getItem('scene')) || 1;

var main = function () {
  ctx.clearRect(0, 0, WIDTH, HEIGHT); // clear the screen

  pages[PAGE - 1].scene.render();

  renderTitle();

  requestAnimationFrame(main);
};


document.addEventListener("keydown", (e) => {
  if (e.key === "1") {
    pages[0].scene = new ClockScene(WIDTH, HEIGHT, ctx);
    PAGE = 1;
    localStorage.setItem('scene', '1')
  }
  if (e.key === "2") {
    pages[1].scene = new SeaSpaceScene(WIDTH, HEIGHT, ctx);
    PAGE = 2
    localStorage.setItem('scene', '2')
  };
  if (e.key === "3") {
    pages[2].scene = new WallsScene(WIDTH, HEIGHT, ctx);
    PAGE = 3
    localStorage.setItem('scene', '3')
  };
  if (e.key === "4") {
    pages[3].scene = new OrbiterScene(WIDTH, HEIGHT, ctx);
    PAGE = 4
    localStorage.setItem('scene', '4')
  };
  if (e.key === "5") {
    pages[4].scene = new FlowersScene(WIDTH, HEIGHT, ctx);
    PAGE = 5
    localStorage.setItem('scene', '5')
  };
  if (e.key === "6") {
    pages[5].scene = new WaterfallScene(WIDTH, HEIGHT, ctx);
    PAGE = 6
    localStorage.setItem('scene', '6')
  };
});

main();
