import { easeInElastic } from "../../lib/easing";
import { ObjectType } from "../../lib/enums";
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

    this.particleCenterX = rand(this.radius, this.width - this.radius)
    this.particleCenterY = rand(this.radius, this.height - this.radius)
  }

  renderOtherStuff(objects: Sprite[]): void {
    this.ctx.globalAlpha = 0.5;
    objects.forEach((drop, idx) => {
      this.ctx.globalAlpha = drop.alpha;
      this.ctx.fillStyle = drop.colorString;
      this.ctx.fillRect(drop.x - drop.w / 2, drop.y - drop.h / 2, drop.w, drop.h);

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
        new Size(5, 5, 20, 20),
        500,
        ObjectType.Particle,
        0
      )
    );
    // run the render function
    this.renderOtherStuff(this.particles);
    this.angle += .05;
    // this.radius += rand(-.5, .5); // add perturbations to radius for each step to create chaotic pattern in arc
    if (this.angle >= 2 * Math.PI) {
      this.angle = 0;
      let r = rand(50, 200)
      this.particleCenterX = rand(r, this.width - r)
      this.particleCenterY = rand(r, this.height - r)
      this.radius = r;
    }
    // Request to do this again ASAP
    while (this.particles.length > 1500) this.particles.shift();
  }

}