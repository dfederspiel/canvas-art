import { easeInCirc, easeInElastic, easeInExpo, easeInOutElastic, easeInOutQuart, easeInOutSine, easeInSine, easeOutSine } from "../../lib/easing";
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

  private step: number = .02525;

  private particleCenterX = 0;
  private particleCenterY = 0;
  private radius = 20;
  private angle = rand(0, Math.PI * 2);

  private direction = Math.PI * 2 / 60 / 2;

  private count: number = 0;
  private color: string = `rgb(${rand(200, 255)},0,0)`

  private toAngle = rand(Math.PI, Math.PI * 2);

  private particles: Sprite[] = [];

  constructor(width: number, height: number, context: CanvasRenderingContext2D) {
    this.width = width;
    this.height = height;
    this.ctx = context;

    this.particleCenterX = this.width / 2 - this.radius
    this.particleCenterY = this.height - this.radius
  }

  renderOtherStuff(objects: Sprite[]): void {
    objects.forEach((drop, idx) => {
      this.ctx.globalAlpha = drop.alpha;
      this.ctx.fillStyle = drop.colorString;
      this.ctx.fillRect(drop.x - drop.w / 2, drop.y - drop.h / 2, drop.w, drop.h);

      drop.update();
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
        this.radius = 20
        this.particleCenterX = this.width / 2 - this.radius
        this.particleCenterY = this.height - this.radius
        this.color = `rgb(${rand(20, 255)},${rand(20, 255)},${rand(20, 255)})`
      }

      this.particles.push(
        new Sprite(
          new Rect(x, y, 0, 0),
          30,
          this.color,
          easeInOutSine,
          0,
          0, //rand(-.1, .1),
          new Rect(0, 0, this.width, this.height),
          new Size(0, 0, 7, 7),
          500,
          ObjectType.Particle,
          0
        )
      );

      // run the render function
      this.angle += this.direction;

      if (this.angle >= this.toAngle && this.direction > 0) {
        this.direction = -this.direction;
        this.angle -= Math.PI;
        this.toAngle = -(rand(-Math.PI / 2, Math.PI / 2));
        const { x: newX, y: newY } = calculate.getVertexFromAngle(
          this.particleCenterX,
          this.particleCenterY,
          this.angle,
          -this.radius * (2 + this.step)
        );
        this.radius = this.radius * (1 + this.step)
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
          -this.radius * (2 + this.step)

        );
        this.radius = this.radius * (1 + this.step)
        this.particleCenterX = newX;
        this.particleCenterY = newY;
      }
    }
  }

  render(): void {
    this.ctx.clearRect(0, 0, this.width, this.height); // clear the screen

    this.count += 1
    this.ctx.globalAlpha = .2
    this.plotPoints(4)
    this.renderOtherStuff(this.particles);

    // Request to do this again ASAP
    while (this.particles.length > 2000) this.particles.shift();
  }

}