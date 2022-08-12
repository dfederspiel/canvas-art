import effects from "../../lib/easing";
import { ObjectType } from "../../lib/enums";
import { calculate, rand } from "../../lib/helpers";
import Rect from "../../lib/Rect";
import RGB from "../../lib/RGB";
import Size from "../../lib/Size";
import Sprite from "../../lib/Sprite";
import { Randomizable, Scene } from "../../lib/types";

type SpirographOptions = {
  angleStep: number;
  radiusStepExit: number;
  radiusStepReturn: number;
  color: string;
  stroke: string;
  easing: (t: number, b: number, c: number, d: number) => number;
  frames: number;
  minRadius: number;
  maxRadius: number;
  rate: number;
};

const getRandomOptions = (): SpirographOptions => {
  let r = Math.floor(rand(0, 255));
  let g = Math.floor(rand(0, 255));
  let b = Math.floor(rand(0, 255));

  const color = new RGB(r, g, b, 1);
  const fill = color.toString();
  color.lighten(50);
  const stroke = color.toString();

  const maxRadius = Math.ceil(rand(150, 300));
  return {
    angleStep: (Math.PI * 2) / rand(10, 150),
    radiusStepExit: rand(5, 150),
    radiusStepReturn: rand(5, 150),
    color: fill,
    stroke,
    easing: effects[Math.floor(rand(0, effects.length))],
    frames: Math.floor(rand(15, 300)),
    minRadius: Math.floor(rand(10, 60)),
    maxRadius,
    rate: Math.ceil(maxRadius / 5),
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
          new Size(5, 5, 10, 10),
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

      if (this.frame >= this.options.frames || this.frame <= 0)
        this.animationDirection = -this.animationDirection;

      this.angle += this.options.angleStep;
      if (this.direction < 0) {
        this.radius -= this.options.maxRadius / this.options.radiusStepReturn;
      } else if (this.direction > 0) {
        this.radius += this.options.maxRadius / this.options.radiusStepExit;
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
      this.ctx.lineWidth = rand(0.05, 2);
      this.ctx.lineTo(drop.x, drop.y);
      drop.update();
      drop.checkBoundaries();
    });
  }

  render(): void {
    this.ctx.fillStyle = `rgba(0, 0, 0, .05)`;
    this.ctx.fillRect(0, 0, this.width, this.height);
    this.ctx.filter = "none";

    this.pushParticles(this.options.rate);

    this.ctx.beginPath();
    this.renderParticles(this.particles);
    this.ctx.stroke();

    while (this.particles.length > this.options.maxRadius * 5)
      this.particles.shift();
  }
}
