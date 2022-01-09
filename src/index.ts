import { Randomizable, Scene } from "./lib/types";
import ClockScene from "./scenes/Clock/Clock.scene";
import EscherScene from "./scenes/EscherTrails/Escher.scene";
import FlowersScene from "./scenes/Flowers/Flowers.scene";
import OrbiterScene from "./scenes/Orbiter/Orbiter.scene";
import SeaSpaceScene from "./scenes/SeaSpace/SeaSpace.scene";
import SnakesScene from "./scenes/Snakes/Snakes.scene";
import SpaceTimeScene from "./scenes/SpaceTime/SpaceTime.scene";
import WallsScene from "./scenes/Walls/Walls.scene";
import WaterfallScene from "./scenes/Waterfall/Waterfall.scene";
import SupernovaeScene from "./scenes/Supernovae/SupernovaeScene.scene";
import FireworkScene from "./scenes/Fireworks/Fireworks.scene";

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
  ctx.fillText(`Scene ${PAGE + 1}: ${pages[PAGE].title}`, 10, 10);
  ctx.font = '16px Arial';
  ctx.fillText(`Use the arrow keys to switch scenes`, 10, 40);
}

function renderHelp(pages: Page[]) {
  ctx.globalAlpha = .85;
  ctx.font = '13px Arial';
  ctx.fillStyle = 'rgba(0,0,0,1)';
  ctx.fillRect(0, 75, 190, 20 * pages.length + 5)
  pages.forEach((page, idx) => {
    ctx.fillStyle = PAGE === idx ? 'rgba(255, 255, 255, .7)' : 'rgba(255, 255, 255, .2)';
    ctx.fillText(`${idx + 1}: ${page.title}`, 10, (idx * 20) + 80)
  });
}

type Page = {
  title: string
  scene: Scene | Randomizable
}

let pages: Page[] = [
  { title: 'Supernovae', scene: new SupernovaeScene(WIDTH, HEIGHT, ctx) },
  { title: 'Snakes on a Plane', scene: new SnakesScene(WIDTH, HEIGHT, ctx) },
  { title: 'Space Time Rift', scene: new SpaceTimeScene(WIDTH, HEIGHT, ctx) },
  { title: 'Flowers', scene: new FlowersScene(WIDTH, HEIGHT, ctx) },
  { title: 'Fireworks', scene: new FireworkScene(WIDTH, HEIGHT, ctx) },
  { title: 'Escher Smoke Trails', scene: new EscherScene(WIDTH, HEIGHT, ctx) },
  { title: 'Space Clock', scene: new ClockScene(canvas.width, canvas.height, ctx) },
  { title: 'Sea Space', scene: new SeaSpaceScene(WIDTH, HEIGHT, ctx) },
  { title: 'Walls', scene: new WallsScene(WIDTH, HEIGHT, ctx) },
  { title: 'Waterfall', scene: new WaterfallScene(WIDTH, HEIGHT, ctx) },
  { title: 'Orbiters', scene: new OrbiterScene(WIDTH, HEIGHT, ctx) },
]

let PAGE: number = parseInt(localStorage.getItem('scene')) || 0;

var main = function () {
  (pages[PAGE].scene as Scene).render();
  renderTitle();
  renderHelp(pages);
  requestAnimationFrame(main);
};


document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowDown") {
    if (PAGE < pages.length - 1) {
      ctx.clearRect(0, 0, WIDTH, HEIGHT);
      PAGE++
      localStorage.setItem('scene', PAGE.toString())
    }
  };

  if (e.key === "ArrowUp") {
    if (PAGE > 0) {
      ctx.clearRect(0, 0, WIDTH, HEIGHT);
      PAGE--
      localStorage.setItem('scene', PAGE.toString())
    }
  };

  if (e.key === " ") {

  };

  if (e.key === "x") {
    ctx.clearRect(0, 0, WIDTH, HEIGHT);
    if ("randomize" in pages[PAGE].scene) {
      console.log(pages[PAGE].scene);
      (pages[PAGE].scene as Randomizable).randomize();
      (pages[PAGE].scene as Scene).render();
    }
  }
});

main();
