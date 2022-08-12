import { calculate, rand } from "../../lib/helpers";
import Rect from "../../lib/Rect";
import RGB from "../../lib/RGB";
import { Randomizable, Scene } from "../../lib/types";

type SpirographOptions = {
  angleStep: number;
  radiusStepExit: number;
  radiusStepReturn: number;
  color: string;
  stroke: string;
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
  const angleStep = Math.PI / Math.floor(rand(2, 150));
  return {
    angleStep,
    radiusStepExit: angleStep * rand(300, 800),
    radiusStepReturn: angleStep * rand(300, 800),
    color: fill,
    stroke,
    minRadius: Math.floor(rand(0, 75)),
    maxRadius,
    rate: 50,
  };
};

export default class SpirographScene implements Scene, Randomizable {
  width: number;
  height: number;
  ctx: CanvasRenderingContext2D;

  private options = getRandomOptions();
  private particleCenterX = 0;
  private particleCenterY = 0;
  private radius = this.options.minRadius;
  private angle = 0;
  private direction = 1;
  private frameCount = 0;

  private particles: Rect[] = [];

  constructor(
    width: number,
    height: number,
    context: CanvasRenderingContext2D
  ) {
    this.width = width;
    this.height = height;
    this.ctx = context;

    this.particleCenterX = this.width / 2;
    this.particleCenterY = this.height / 2;

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
      this.particles.push(new Rect(x, y, 0, 0));

      this.angle += this.options.angleStep;
      if (this.direction < 0) {
        this.radius -= this.options.radiusStepReturn; // this.options.angleStep * 500;
      } else if (this.direction > 0) {
        this.radius += this.options.radiusStepExit; // this.options.angleStep * 500;
      }
      if (
        (this.radius > this.options.maxRadius && this.direction > 0) ||
        (this.radius < this.options.minRadius && this.direction <= 0)
      ) {
        this.direction = -this.direction;
      }
    }
  }

  renderParticles(objects: Rect[]): void {
    objects.forEach((drop, idx) => {
      this.ctx.fillStyle = this.options.color;
      this.ctx.strokeStyle = this.options.stroke;
      this.ctx.lineWidth = 0.5;
      this.ctx.lineTo(drop.x, drop.y);
    });
  }

  render(): void {
    this.frameCount++;

    // if (this.frameCount % 2 === 0) {
    this.ctx.fillStyle = `rgba(0, 0, 0, .05)`;
    this.ctx.fillRect(0, 0, this.width, this.height);
    this.ctx.filter = "none";
    // }

    this.pushParticles(this.options.rate);

    this.ctx.beginPath();
    this.renderParticles(this.particles);
    this.ctx.stroke();

    while (this.particles.length > 500) this.particles.shift();
  }
}
