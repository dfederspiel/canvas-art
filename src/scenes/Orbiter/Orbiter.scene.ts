import { easeInElastic } from "../../lib/easing";
import { calculate, rand } from "../../lib/helpers";
import Rect from "../../lib/Rect";
import Size from "../../lib/Size";
import Sprite from "../../lib/Sprite";
import { Scene } from "../../lib/types";

export default class OrbiterScene implements Scene {
  width: number;
  height: number;
  ctx: CanvasRenderingContext2D

  private particleCenterX = 0;
  private particleCenterY = 0;
  private radius = rand(50, 200);
  private angle = 0;

  private particles: Sprite[] = [];

  constructor(width: number, height: number, context: CanvasRenderingContext2D) {
    this.width = width;
    this.height = height;
    this.ctx = context;
  }

  renderOtherStuff(objects: Sprite[]): void {
    this.ctx.globalAlpha = 0.5;
    objects.forEach((drop, idx) => {
      this.ctx.globalAlpha = drop.alpha;
      this.ctx.fillStyle = drop.colorString;
      this.ctx.fillRect(drop.x - drop.w / 2, drop.y - drop.h / 2, drop.w, drop.h);

      // if (RIGHT_PRESSED) drop.xdir = 1;
      // if (LEFT_PRESSED) drop.xdir = -1;
      // if (UP_PRESSED) drop.ydir = -1;
      // if (DOWN_PRESSED) drop.ydir = 1;

      drop.update();

      drop.checkBoundaries();
    });
  }

  render(): void {
    const { x, y } = calculate.getVertexFromAngle(
      this.particleCenterX,
      this.particleCenterY,
      this.angle,
      this.radius
    );
    this.particles.push(
      new Sprite(
        new Rect(x, y, 10, 10),
        120,
        `rgb(${rand(50, 255)}, ${rand(50, 255)}, ${rand(50, 255)})`,
        easeInElastic,
        0,
        0,
        new Rect(0, 0, this.width, this.height),
        new Size(5, 5, 5, 5)
      )
    );
    // run the render function
    // this.renderOtherStuff(this.drops);
    this.renderOtherStuff(this.particles);
    this.angle += .1;
    if (this.angle >= 2 * Math.PI) {
      this.angle = 0;
      this.particleCenterX = rand(0, this.width);
      this.particleCenterY = rand(0, this.height);
      this.radius = rand(50, 200);
    }
    // Request to do this again ASAP
    while (this.particles.length > 1500) this.particles.shift();
  }

}