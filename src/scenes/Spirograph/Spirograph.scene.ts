import { calculate, rand } from "../../lib/helpers";
import Rect from "../../lib/Rect";
import RGB from "../../lib/RGB";
import { Randomizable, Scene } from "../../lib/types";

const _patternSeeds = [2, 3, 4, 5, 6, 7, 8, 9, 10];
const patternSeeds = [2, 3, 4, 5, 6, 7, 8, 9, 10];

const getPatternSeed = () => {
  const seed1 = patternSeeds[Math.floor(rand(0, patternSeeds.length))];
  const seed2 = patternSeeds[Math.floor(rand(0, patternSeeds.length))];
  return Number(rand(seed1, seed2).toFixed(2));
};

type SpirographOptions = {
  angleStep: number;
  radiusStepExit: number;
  radiusStepReturn: number;
  color: RGB;
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
  color.lighten(50);
  const stroke = color.toString();

  const maxRadius = Math.ceil(rand(150, 200));
  const angleStep = Math.PI / getPatternSeed();
  return {
    angleStep,
    radiusStepExit: angleStep * rand(100, 400),
    radiusStepReturn: angleStep * rand(100, 400),
    color,
    stroke,
    minRadius: Math.floor(rand(10, 75)),
    maxRadius,
    rate: 5,
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
    console.log("CONFIG", this.options);
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
    this.ctx.beginPath();
    objects.forEach((drop, idx) => {
      const colorBump = Math.floor(
        Math.abs(
          calculate.distance(
            new Rect(this.width / 2, this.height / 2, 0, 0),
            drop
          ).dx
        )
      );
      this.ctx.strokeStyle = this.options.color.lighten(50);
      this.ctx.lineWidth = 10 / idx;
      this.ctx.lineTo(drop.x, drop.y);
    });
    this.ctx.stroke();
  }

  render(): void {
    this.frameCount++;

    if (this.frameCount % 2 === 0) {
      this.ctx.fillStyle = `rgba(0, 0, 0, .05)`;
      this.ctx.fillRect(0, 0, this.width, this.height);
      this.ctx.filter = "none";
    }

    this.pushParticles(this.options.rate);

    this.renderParticles(this.particles);

    while (this.particles.length > 200) this.particles.shift();
  }
}
