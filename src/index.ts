import { Randomizable, Scene } from "./lib/types";
import ClockScene from "./scenes/Clock/Clock.scene";
import EscherScene from "./scenes/EscherTrails/Escher.scene";
import FlowersScene from "./scenes/Flowers/Flowers.scene";
import IceCrystalScene from "./scenes/IceCrystals/IceCrystal.scene";
import OrbiterScene from "./scenes/Orbiter/Orbiter.scene";
import SeaSpaceScene from "./scenes/SeaSpace/SeaSpace.scene";
import SnakesScene from "./scenes/Snakes/Snakes.scene";
import SpaceTimeScene from "./scenes/SpaceTime/SpaceTime.scene";
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
  ctx.fillText(`Scene: ${pages[PAGE - 1].title}`, 10, 10);
  ctx.font = '16px Arial';
  ctx.fillText(`Press 1-${pages.length} to switch scenes`, 10, 40);
}

type Page = {
  title: string
  scene: Scene
}

let pages: Page[] = [
  { title: 'Supernovae', scene: new IceCrystalScene(WIDTH, HEIGHT, ctx) },
  { title: 'Sea Space', scene: new SeaSpaceScene(WIDTH, HEIGHT, ctx) },
  { title: 'Walls', scene: new WallsScene(WIDTH, HEIGHT, ctx) },
  { title: 'Waterfall', scene: new WaterfallScene(WIDTH, HEIGHT, ctx) },
  { title: 'Orbiters', scene: new OrbiterScene(WIDTH, HEIGHT, ctx) },
  { title: 'Space Clock', scene: new ClockScene(canvas.width, canvas.height, ctx) },
  { title: 'Flowers', scene: new FlowersScene(WIDTH, HEIGHT, ctx) },
  { title: 'Snakes on a Plane', scene: new SnakesScene(WIDTH, HEIGHT, ctx) },
  { title: 'Escher Smoke Trails', scene: new EscherScene(WIDTH, HEIGHT, ctx) },
  { title: 'Space Time', scene: new SpaceTimeScene(WIDTH, HEIGHT, ctx) },
]

let PAGE: number = parseInt(localStorage.getItem('scene')) || 1;

var main = function () {
  pages[PAGE - 1].scene.render();
  renderTitle();
  requestAnimationFrame(main);
};


document.addEventListener("keydown", (e) => {
  if (e.key === "1") {
    pages[0].scene = new IceCrystalScene(WIDTH, HEIGHT, ctx);
    PAGE = 1;
    localStorage.setItem('scene', '1')
  }
  if (e.key === "2") {
    pages[1].scene = new WallsScene(WIDTH, HEIGHT, ctx);
    PAGE = 2
    localStorage.setItem('scene', '2')
  };
  if (e.key === "3") {
    pages[2].scene = new WaterfallScene(WIDTH, HEIGHT, ctx);
    PAGE = 3
    localStorage.setItem('scene', '3')
  };
  if (e.key === "4") {
    pages[3].scene = new OrbiterScene(WIDTH, HEIGHT, ctx);
    PAGE = 4
    localStorage.setItem('scene', '4')
  };
  if (e.key === "5") {
    pages[4].scene = new ClockScene(WIDTH, HEIGHT, ctx);
    PAGE = 5
    localStorage.setItem('scene', '5')
  };
  if (e.key === "6") {
    pages[5].scene = new FlowersScene(WIDTH, HEIGHT, ctx);
    PAGE = 6
    localStorage.setItem('scene', '6')
  };
  if (e.key === "7") {
    pages[6].scene = new SnakesScene(WIDTH, HEIGHT, ctx);
    PAGE = 7
    localStorage.setItem('scene', '7')
  };
  if (e.key === "8") {
    pages[7].scene = new EscherScene(WIDTH, HEIGHT, ctx);
    PAGE = 8
    localStorage.setItem('scene', '8')
  };
  if (e.key === "9") {
    pages[8].scene = new SpaceTimeScene(WIDTH, HEIGHT, ctx);
    PAGE = 9
    localStorage.setItem('scene', '9')
  };
  if (e.key === "0") {
    pages[9].scene = new SeaSpaceScene(WIDTH, HEIGHT, ctx);
    PAGE = 10
    localStorage.setItem('scene', '10')
  };


  if (e.key === "ArrowRight") {
    if (PAGE < pages.length) {
      PAGE++
      localStorage.setItem('scene', PAGE.toString())
    }
  };

  if (e.key === "ArrowLeft") {
    if (PAGE > 1) {
      PAGE--
      localStorage.setItem('scene', PAGE.toString())
    }
  };

  if (e.key === "x") {
    let r = pages[7].scene as unknown as Randomizable
    r.randomize();
    r = pages[8].scene as unknown as Randomizable
    r.randomize();
    r = pages[0].scene as unknown as Randomizable
    r.randomize();
  }
});

main();
