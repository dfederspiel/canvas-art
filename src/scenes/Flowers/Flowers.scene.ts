import {
  easeInCirc,
  easeInElastic,
  easeInExpo,
  easeInOutBack,
  easeInOutQuad,
  easeInOutSine,
  easeLinear,
} from "../../lib/easing";
import { ObjectType } from "../../lib/enums";
import { calculate, rand } from "../../lib/helpers";
import Rect from "../../lib/Rect";
import RGB from "../../lib/RGB";
import Size from "../../lib/Size";
import Sprite from "../../lib/Sprite";
import { Randomizable, Scene } from "../../lib/types";

const easings = [
  easeInCirc,
  easeInElastic,
  easeInOutBack,
  easeInOutQuad,
  easeInOutSine,
  easeLinear,
];

type SpirographOptions = {
  angleStep: number;
  color: string;
  stroke: string;
  easing: (t: number, b: number, c: number, d: number) => number;
  frames: number;
  minRadius: number;
  maxRadius: number;
  rate: number;
};

const getRandomOptions = (): SpirographOptions => {
  let r = Math.floor(rand(5, 255));
  let g = Math.floor(rand(5, 255));
  let b = Math.floor(rand(5, 255));

  const color = new RGB(r, g, b, 1);
  const fill = color.toString();
  color.darken(50);
  const stroke = color.toString();
  return {
    angleStep: rand(-0.05, 0.05),
    color: fill,
    stroke,
    easing: easings[Math.floor(rand(1, easings.length))],
    frames: Math.floor(rand(1, 200)),
    minRadius: Math.floor(rand(20, 100)),
    maxRadius: Math.ceil(rand(75, 250)),
    rate: Math.floor(rand(1, 40)),
  };
};

export default class FlowersScene implements Scene, Randomizable {
  width: number;
  height: number;
  ctx: CanvasRenderingContext2D;

  private options = getRandomOptions();
  private particleCenterX = 0;
  private particleCenterY = 0;
  private radius = this.options.minRadius;
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

    this.randomize();
  }

  randomize(): void {
    this.particles = [];
    this.options = getRandomOptions();
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
          this.options.frames,
          this.options.color,
          this.options.easing,
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

      this.angle += this.options.angleStep;
      if (this.direction < 0) {
        this.radius -= this.radius / 25;
      } else if (this.direction > 0) {
        this.radius += this.radius / 25;
      }
      if (
        (this.radius > this.options.maxRadius && this.direction > 0) ||
        (this.radius < this.options.minRadius && this.direction <= 0)
      )
        this.direction = -this.direction;
    }
  }

  renderParticles(objects: Sprite[]): void {
    objects.forEach((drop, idx) => {
      this.ctx.globalAlpha = drop.alpha;
      this.ctx.fillStyle = this.options.color;
      this.ctx.strokeStyle = this.options.stroke;

      this.ctx.beginPath();
      const e = this.options.easing(idx + 1, 1, drop.w / 2, objects.length);

      this.ctx.arc(drop.x, drop.y, e > 0 ? e : 0, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.stroke();

      drop.update();
      drop.checkBoundaries();
    });
  }

  render(): void {
    this.ctx.clearRect(0, 0, this.width, this.height); // clear the screen

    this.pushParticles(this.options.rate);
    this.renderParticles(this.particles);
    while (this.particles.length > 1000) this.particles.shift();
  }
}
