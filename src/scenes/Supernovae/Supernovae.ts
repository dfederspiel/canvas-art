import { easeInSine, effects } from '../../lib/easing';
import { calculate, rand } from '../../lib/helpers';
import Rect from '../../lib/Rect';
import RGB from '../../lib/RGB';
import { Randomizable } from '../../lib/types';
import Segment from './Segment';

export default class Supernova implements Randomizable {

  maxAlpha: number = 0;
  //alpha: number = 1; // this is a buggy remnant
  direction: number = 0;
  rotationInterval: number = rand(-Math.PI / 60 / 60, Math.PI / 60 / 60);
  limit: number;
  angle: number = 0;

  color: RGB
  strokeColor: RGB

  width = window.innerWidth;
  height = window.innerHeight;
  lineWidth: number = 0.5;
  offset = rand(-50, 100);
  steps: number = Math.floor(rand(50, 145));
  ease: Function;
  segments: Segment[] = [];
  renderOutlines = false;

  minModifier = rand(-2, 2);
  maxModifier = rand(-2, 2);

  posX = 0;
  posY = 0;

  ctx: CanvasRenderingContext2D;

  private minRadius = rand(-50, 50);
  private maxRadius = rand(50, 75);

  constructor(
    angle: number,
    numPetals: number,
    context: CanvasRenderingContext2D
  ) {
    this.limit = numPetals;
    this.angle = angle;
    this.ctx = context;
    this.ease = effects[Math.floor(rand(0, effects.length))];

    let r = Math.floor(rand(25, 255))
    let g = Math.floor(rand(25, 255))
    let b = Math.floor(rand(25, 255))

    this.color = new RGB(r, g, b, 0)
    this.strokeColor = new RGB(r, g, b, 0)
    this.strokeColor.darken(100)

    this.randomize();
    this.update(0);
  }

  update(step: number) {
    if (step === 0) return;
    this.angle += step;
    this.segments = [];
    this.maxRadius += this.maxModifier;
    this.minRadius += this.minModifier;

    for (let c = 0; c < this.limit; c++) {
      this.angle += (Math.PI * 2) / this.limit;
      const { x: pX, y: pY } = calculate.getVertexFromAngle(
        this.width / 2,
        this.height / 2,
        this.angle,
        this.offset
      );
      let p = new Segment(
        pX,
        pY,
        this.angle,
        this.minRadius,
        this.maxRadius,
        this.steps,
        this.ease
      );
      this.segments.push(p);
    }
  }

  private renderLines(objects: Rect[], alpha: number): void {
    this.ctx.strokeStyle = this.color.toString();
    this.ctx.lineWidth = this.lineWidth;
    this.ctx.beginPath();
    objects.forEach((o, idx) => {
      this.ctx.moveTo(this.width / 2, this.height / 2);
      this.ctx.lineTo(o.x, o.y);
    });
    this.ctx.stroke();
  }

  private renderOutline(objects: Rect[], alpha: number): void {
    if (objects.length === 0) return;
    this.ctx.lineWidth = this.lineWidth * 2;
    this.ctx.fillStyle = this.color.toString();
    this.ctx.strokeStyle = this.strokeColor.toString()
    objects.forEach((o, idx) => {
      this.ctx.beginPath();
      this.ctx.moveTo(o.x, o.y);
      if (idx === objects.length - 1)
        this.ctx.lineTo(objects[0].x, objects[0].y);
      else this.ctx.lineTo(objects[idx + 1].x, objects[idx + 1].y);
      this.ctx.stroke();
    });
  }

  private renderArcs(objects: Rect[], alpha: number): void {
    if (objects.length === 0) return;
    this.ctx.fillStyle = this.color.toString();
    this.ctx.strokeStyle = this.strokeColor.toString()
    objects.forEach((o, idx) => {
      this.ctx.beginPath();
      const e = easeInSine(idx + 1, 1, o.w / 2, objects.length);
      this.ctx.arc(o.x, o.y, e, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.stroke();
    });
  }

  randomize(): void {
    this.angle = 0;
    this.minRadius = rand(5, 50);
    this.maxRadius = rand(10, 50);
    this.minModifier = rand(-0.1, -1.5);
    this.maxModifier = rand(-0.5, -2.5);
    this.limit = Math.floor(rand(2, 20));
    this.steps = Math.floor(rand(10, 200 / this.limit));
    this.offset = 0;
    this.rotationInterval = rand(-(Math.PI / 60), Math.PI / 60) / 20;
  }

  render() {
    this.segments.forEach((p) => {
      // this.renderLines(
      //   p.points.filter((i, idx) => idx % Math.floor(rand(3, 20)) === 0),
      //   this.color.alpha / Math.floor(rand(5, 10))
      // );

      // if (this.renderOutlines) this.renderOutline(p.points, this.color.alpha);

      this.renderArcs(
        p.points.filter((i, idx) => idx % Math.floor(rand(1, 20)) === 0),
        this.color.alpha
      );
    });
    if (this.color.alpha > 0.8 && this.direction > 0) {
      this.direction = -this.direction;
    }
    this.ctx.strokeStyle = this.color.toString();
    this.update(this.rotationInterval);
    this.color.alpha += this.direction;
    this.strokeColor.alpha += this.direction;
  }
}
