import {
  easeInCirc,
  easeInElastic,
  easeInExpo,
  easeInOutBack,
  easeInOutElastic,
  easeInOutExpo,
  easeInOutQuad,
  easeInOutSine,
  easeLinear,
} from "../../lib/easing";
import { ObjectType } from "../../lib/enums";
import { calculate, rand } from "../../lib/helpers";
import Rect from "../../lib/Rect";
import Size from "../../lib/Size";
import Sprite from "../../lib/Sprite";
import { Scene } from "../../lib/types";

export default class FlowersScene implements Scene {
  width: number;
  height: number;
  ctx: CanvasRenderingContext2D;

  private particleCenterX = 0;
  private particleCenterY = 0;
  private radius = 255;
  private angle = 0;
  private animationDirection = 1;
  private frame = 0;

  private direction = -1;

  private particles: Sprite[] = [];

  constructor(
    width: number,
    height: number,
    context: CanvasRenderingContext2D
  ) {
    this.width = width;
    this.height = height;
    this.ctx = context;

    this.particleCenterX = this.width / 2; // rand(this.radius, this.width - this.radius)
    this.particleCenterY = this.height / 2; // rand(this.radius, this.height - this.radius)
  }

  pushParticles(count: number) {
    for (var x = 0; x < count; x++) {
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
          `rgb(${this.radius}, 0, ${this.radius / 4})`,
          easeInElastic,
          0,
          0,
          new Rect(0, 0, this.width, this.height),
          new Size(4, 4, 10, 10),
          1000,
          ObjectType.Particle,
          this.frame
        )
      );

      if (this.animationDirection > 0) {
        this.frame++;
      } else if (this.animationDirection < 0) {
        this.frame--;
      }

      if (this.frame >= 60 || this.frame <= 0)
        this.animationDirection = -this.animationDirection;

      this.angle += 0.01564;
      if (this.direction < 0) {
        this.radius -= 6;
      } else if (this.direction > 0) {
        this.radius += 6;
      }
      if (this.radius > 254 || this.radius < 0)
        this.direction = -this.direction;
    }
  }

  renderParticles(objects: Sprite[]): void {
    objects.forEach((drop, idx) => {
      this.ctx.globalAlpha = drop.alpha;
      this.ctx.fillStyle = drop.colorString;
      this.ctx.fillRect(
        drop.x - drop.w / 2,
        drop.y - drop.h / 2,
        drop.w,
        drop.h
      );

      drop.update();
      drop.checkBoundaries();
    });
  }

  render(): void {
    this.ctx.clearRect(0, 0, this.width, this.height); // clear the screen

    this.pushParticles(15);
    this.renderParticles(this.particles);
    while (this.particles.length > 5000) this.particles.shift();
  }
}
