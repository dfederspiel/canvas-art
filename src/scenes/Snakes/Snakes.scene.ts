import { easeInCirc, easeInElastic, easeInExpo, easeInOutElastic, easeInOutSine, easeInSine, easeOutSine } from "../../lib/easing";
import { ObjectType } from "../../lib/enums";
import { calculate, rand } from "../../lib/helpers";
import Rect from "../../lib/Rect";
import Size from "../../lib/Size";
import Sprite from "../../lib/Sprite";
import { Scene } from "../../lib/types";

export default class SnakesScene implements Scene {
  width: number;
  height: number;
  ctx: CanvasRenderingContext2D

  private particleCenterX = 0;
  private particleCenterY = 0;
  private radius = 25;
  private angle = rand(0, Math.PI * 2);

  private direction = Math.PI * 2 / 60 / 2;

  private count: number = 0;

  private toAngle = rand(Math.PI, Math.PI * 2);

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

  plotPoints(count: number) {
    for (let c = 0; c < count; c++) {
      const { x, y } = calculate.getVertexFromAngle(
        this.particleCenterX,
        this.particleCenterY,
        this.angle,
        this.radius
      );

      if (x < 0 || x > this.width || y < 0 || y > this.height) {
        this.particleCenterX = rand(this.radius, this.width - this.radius)
        this.particleCenterY = rand(this.radius, this.height - this.radius)
      }

      this.particles.push(
        new Sprite(
          new Rect(x, y, 10, 10),
          30,
          `rgb(${rand(200, 255)},0,0)`,
          //`rgb(${rand(50, 255)}, ${rand(50, 255)}, ${rand(50, 255)})`,
          easeInOutSine,
          //rand(1, 2),
          //rand(1, 2),
          0,
          0,
          new Rect(0, 0, this.width, this.height),
          new Size(1, 1, 5, 5),
          500,
          ObjectType.Particle,
          0
        )
      );
      // make the particle dance by randomizing XY 
      // this.particleCenterX += rand(0, this.dx)
      // this.particleCenterY += rand(0, this.dy)

      // run the render function
      this.angle += this.direction;
    }
  }

  render(): void {
    this.count++
    this.ctx.globalAlpha = .5
    this.plotPoints(10)
    this.renderOtherStuff(this.particles);

    // clockwise motion 
    if (this.angle >= this.toAngle && this.direction > 0) {
      this.direction = -this.direction;
      this.angle -= Math.PI;
      this.toAngle = -(rand(-Math.PI * 2, Math.PI * 2));
      const { x: newX, y: newY } = calculate.getVertexFromAngle(
        this.particleCenterX,
        this.particleCenterY,
        this.angle,
        -this.radius * 2
      );
      this.particleCenterX = newX;
      this.particleCenterY = newY;
    }
    // counter clockwise
    if (this.angle <= this.toAngle && this.direction < 0) {
      this.direction = -this.direction;
      this.angle += Math.PI;
      this.toAngle = rand(-Math.PI * 2, Math.PI * 2);
      const { x: newX, y: newY } = calculate.getVertexFromAngle(
        this.particleCenterX,
        this.particleCenterY,
        this.angle,
        -this.radius * 2
      );
      this.particleCenterX = newX;
      this.particleCenterY = newY;
    }

    if (this.count % 500 == 0) {
      this.particleCenterX = rand(this.radius, this.width - this.radius)
      this.particleCenterY = rand(this.radius, this.height - this.radius)
    }

    // Request to do this again ASAP
    while (this.particles.length > 1500) this.particles.shift();
  }

}