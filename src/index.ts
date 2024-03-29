import { Randomizable, Scene } from "./lib/types";
import ClockScene from "./scenes/Clock/Clock.scene";
import EscherScene from "./scenes/EscherTrails/Escher.scene";
import SpirographScene, { SpirographOptions } from "./scenes/Spirograph/Spirograph.scene";
import OrbiterScene from "./scenes/Orbiter/Orbiter.scene";
import SeaSpaceScene from "./scenes/SeaSpace/SeaSpace.scene";
import SnakesScene from "./scenes/Snakes/Snakes.scene";
import SpaceTimeScene from "./scenes/SpaceTime/SpaceTime.scene";
import WallsScene from "./scenes/Walls/Walls.scene";
import WaterfallScene from "./scenes/Waterfall/Waterfall.scene";
import SupernovaeScene from "./scenes/Supernovae/SupernovaeScene.scene";
import FireworkScene from "./scenes/Fireworks/Fireworks.scene";
import FlowersScene from "./scenes/Flowers/Flowers.scene";
import RGB from './lib/RGB';

let WIDTH = window.innerWidth;
let HEIGHT = window.innerHeight - 50;

let canvas: HTMLCanvasElement;
let ctx: CanvasRenderingContext2D;
let randomizeButton = document.getElementById("randomize") as HTMLButtonElement;

function addRandomizerEvent() {
  randomizeButton.addEventListener("click", listener);
  randomizeButton.hidden = isRandomizable(pages[PAGE].scene) ? false : true;
}

canvas = document.getElementById("canvas") as HTMLCanvasElement;
ctx = canvas.getContext("2d");

canvas.width = WIDTH;
canvas.height = HEIGHT;

window.onresize = () => {
  WIDTH = canvas.width = window.innerWidth;
  HEIGHT = canvas.height = window.innerHeight;
};

let count = 0;

setInterval(() => {
  count++;
}, 1000);

function renderTitle() {
  ctx.globalAlpha = 0.85;
  ctx.fillStyle = "#fff";
  ctx.font = "24px Arial";
  ctx.textAlign = "left";
  ctx.textBaseline = "top";
  ctx.fillText(`Scene ${PAGE + 1}: ${pages[PAGE].title}`, 10, 10);
  ctx.font = "16px Arial";
  ctx.fillText(`use the buttons below to switch scenes`, 10, 40);
}

function storeScene(sceneName: string, params = {}) {
  const state = {
    scene: sceneName,
    params: params,
  };

  const title = `Scene: ${sceneName}`;
  const url = `/${sceneName}?${new URLSearchParams(params).toString()}`;

  // Push the state into the history stack
  history.pushState(state, title, url);
}

function isRandomizable(scene: Scene | Randomizable): scene is Randomizable {
  return (<Randomizable>scene).randomize !== undefined;
}

type Page = {
  title: string;
  scene: Scene | Randomizable;
};

let pages: Page[] = [
  { title: "Supernovae", scene: new SupernovaeScene(WIDTH, HEIGHT, ctx) },
  { title: "Snakes on a Plane", scene: new SnakesScene(WIDTH, HEIGHT, ctx) },
  { title: "Space Time Rift", scene: new SpaceTimeScene(WIDTH, HEIGHT, ctx) },
  { title: "Spiral Graph", scene: new SpirographScene(WIDTH, HEIGHT, ctx) },
  { title: "Flowers", scene: new FlowersScene(WIDTH, HEIGHT, ctx) },
  { title: "Fireworks", scene: new FireworkScene(WIDTH, HEIGHT, ctx) },
  { title: "Escher Smoke Trails", scene: new EscherScene(WIDTH, HEIGHT, ctx) },
  {
    title: "Space Clock",
    scene: new ClockScene(canvas.width, canvas.height, ctx),
  },
  { title: "Sea Space", scene: new SeaSpaceScene(WIDTH, HEIGHT, ctx) },
  { title: "Walls", scene: new WallsScene(WIDTH, HEIGHT, ctx) },
  { title: "Waterfall", scene: new WaterfallScene(WIDTH, HEIGHT, ctx) },
  { title: "Orbiters", scene: new OrbiterScene(WIDTH, HEIGHT, ctx) },
];

let PAGE: number = 0;  // parseInt(localStorage.getItem("scene")) || 0;

var main = function () {
  (pages[PAGE].scene as Scene).render();
  renderTitle();
  requestAnimationFrame(main);
};

const listener = (ev: Event) => {
  if (isRandomizable(pages[PAGE].scene)) {
    (<Randomizable>pages[PAGE].scene).randomize();
  }
};

const nextButton = document.getElementById("nextButton");
nextButton.addEventListener("click", () => {
  if (PAGE < pages.length - 1) {
    ctx.clearRect(0, 0, WIDTH, HEIGHT);
    PAGE++;
    //localStorage.setItem("scene", PAGE.toString());
    randomizeButton.hidden = isRandomizable(pages[PAGE].scene) ? false : true;
    storeScene(PAGE.toString())
  }
});

const previousButton = document.getElementById("previousButton");
previousButton.addEventListener("click", () => {
  if (PAGE > 0) {
    ctx.clearRect(0, 0, WIDTH, HEIGHT);
    PAGE--;
    //localStorage.setItem("scene", String(PAGE));
    randomizeButton.hidden = isRandomizable(pages[PAGE].scene) ? false : true;
    storeScene(PAGE.toString())
  }
});

function loadScene(sceneName: string, params: any) {
  // Clear the current scene
  // ...
  console.log('PARAMS', sceneName, params)
  PAGE = Number(sceneName)

  if (sceneName === '3') {
    const scene = (pages[3].scene as SpirographScene);
    
    if (params.angleStep) {
      params.color = new RGB(params.color.redChannel, params.color.greenChannel, params.color.blueChannel, 1)
      scene.options = params;
    }
    // Load the new scene based on the sceneName
  }
  
}

window.addEventListener("popstate", (event) => {
  console.log('POPTATE', event.state.scene, event.state.params)
  if (event.state && event.state.scene) {
    loadScene(event.state.scene, event.state.params);
  }
});

PAGE = window.location.pathname === '/' ? 0 : Number(window.location.pathname.split('/')[1]);
storeScene(PAGE.toString())

addRandomizerEvent();
main();
