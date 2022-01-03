import { easeInElastic, easeLinear } from "../../lib/easing";
import { ObjectType } from "../../lib/enums";
import { rand } from "../../lib/helpers";
import Rect from "../../lib/Rect";
import Size from "../../lib/Size";
import Sprite from "../../lib/Sprite";
import { Scene } from "../../lib/types";

export default class SeaSpaceScene implements Scene {
  width: number;
  height: number;

  #ctx: CanvasRenderingContext2D;
  #drops: Sprite[] = []

  constructor(width: number, height: number, context: CanvasRenderingContext2D) {
    this.width = width;
    this.height = height;
    this.#ctx = context;

    this.init()
  }

  private init() {
    for (var x = 0; x < 5000; x++) {
      this.#drops.push(
        new Sprite(
          new Rect(
            rand(0, this.width),
            rand(0, this.height),
            50,
            50,
          ),
          rand(60, 240),
          `rgb(${rand(0, 0)}, ${rand(0, 0)}, ${rand(0, 125)})`,
          easeLinear,
          rand(-4, 4),
          rand(-4, 4),
          new Rect(0, 0, this.width, this.height),
          new Size(5, 5, 10, 10),
          1000,
          ObjectType.Particle
        )
      )
    }

    for (var x = 0; x < 1000; x++) {
      this.#drops.push(
        new Sprite(
          new Rect(
            rand(0, this.width),
            rand(0, this.height),
            10,
            10,
          ),
          rand(120, 480),
          `rgb(${rand(0, 0)}, ${rand(0, 0)}, ${rand(200, 255)})`,
          easeInElastic,
          rand(-2, 2),
          rand(-2, 2),
          new Rect(0, 0, this.width, this.height),
          new Size(5, 5, 20, 20),
          1000,
          ObjectType.Particle
        )
      )
    }

    for (var x = 0; x < 50; x++) {
      this.#drops.push(
        new Sprite(
          new Rect(
            rand(0, this.width),
            rand(0, this.height),
            10,
            10,
          ),
          rand(60, 120),
          `rgb(${rand(100, 200)}, ${rand(0, 0)}, ${rand(0, 0)})`,
          easeInElastic,
          rand(-.5, .5),
          rand(-.5, .5),
          new Rect(0, 0, this.width, this.height),
          new Size(10, 10, 20, 20),
          1000,
          ObjectType.Particle
        )
      )
    }
  }

  render(): void {
    this.#ctx.clearRect(0, 0, this.width, this.height); // clear the screen

    this.#ctx.globalAlpha = .75;
    this.#drops.forEach((drop, idx) => {
      this.#ctx.fillStyle = drop.colorString;
      this.#ctx.fillRect(drop.x - drop.w / 2, drop.y - drop.h / 2, drop.w, drop.h)
      drop.checkBoundaries()
      drop.update();
    })
  }
}