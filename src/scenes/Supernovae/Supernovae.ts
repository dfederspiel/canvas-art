import { easeInOutCubic, easeInQuad, easeInSine, easeOutSine, effects } from '../../lib/easing';
import { calculate, rand } from '../../lib/helpers';
import Rect from '../../lib/Rect';
import { Randomizable } from '../../lib/types';
import Segment from './Segment';
import RGB from "./RGB";

export default class Supernova implements Randomizable {

  private maxAlpha: number = 0;
  private maskAlpha: number = 0;
  private fadeInterval: number = 0;
  private timeBeganDying: number = 0;

  private velocityModifierMin: number = rand(.00125, .005)
  private velocityModifierMax: number = rand(.005, .0125)

  //alpha: number = 1; // this is a buggy remnant
  private direction: number = 0;
  private rotationInterval: number = rand(-Math.PI / 60 / 60, Math.PI / 60 / 60);
  private limit: number;
  private angle: number = 0;

  private color: RGB
  private strokeColor: RGB

  private width = window.innerWidth;
  private height = window.innerHeight;
  private lineWidth: number = 0.5;
  private offset = rand(-50, 100);
  private steps: number = Math.floor(rand(50, 145));
  private ease: Function;
  private segments: Segment[] = [];
  private renderOutlines = false;

  private minModifier: number;
  private maxModifier: number;

  private life: number = 0;
  private duration: number = Math.floor(rand(300, 600));

  private ctx: CanvasRenderingContext2D;

  private minRadius = rand(-50, 50);
  private maxRadius = rand(50, 75);

  isDying: boolean = false;
  isDead: boolean = false;

  constructor(
    angle: number,
    numPetals: number,
    context: CanvasRenderingContext2D
  ) {
    this.limit = numPetals;
    this.angle = angle;
    this.ctx = context;
    this.ease = effects[Math.floor(rand(0, effects.length))];

    this.maxAlpha = 1
    this.direction = this.maxAlpha / Math.floor(this.duration);

    this.renderOutlines = Math.random() < .5;

    let r = Math.floor(rand(125, 255))
    let g = Math.floor(rand(125, 255))
    let b = Math.floor(rand(125, 255))

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
    this.ctx.beginPath();
    this.ctx.lineWidth = this.lineWidth;
    this.ctx.strokeStyle = this.strokeColor.toString();
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
    this.minRadius = rand(5, 30);
    this.maxRadius = rand(10, 30);
    this.minModifier = rand(-.5, -1);
    this.maxModifier = rand(-1.5, -2.5);
    this.limit = Math.floor(rand(2, 20));
    this.steps = Math.floor(rand(10, 200 / this.limit));
    this.offset = 0;
    this.rotationInterval = rand(-(Math.PI / 60), Math.PI / 60) / 20;
  }

  render() {
    this.ctx.fillStyle = `rgba(0, 0, 0, .03)`
    this.ctx.fillRect(0, 0, this.width, this.height)

    this.segments.forEach((p) => {
      this.renderLines(
        p.points.filter((i, idx) => idx % Math.floor(rand(2, 20)) === 0),
        this.color.alpha / Math.floor(rand(5, 10))
      );

      if (this.renderOutlines) this.renderOutline(p.points, this.color.alpha);

      this.renderArcs(
        p.points.filter((i, idx) => idx % Math.floor(rand(1, 5)) === 0),
        this.color.alpha
      );
    });

    if (this.color.alpha > 0.8 && this.direction > 0) {
      this.direction = -this.direction;
    }

    this.ctx.strokeStyle = this.color.toString();
    this.update(this.rotationInterval);

    if (!this.isDying) {
      this.color.alpha += 1 / this.duration * 2;
      this.strokeColor.alpha += 1 / this.duration * 4;
      this.fadeInterval = this.color.alpha / 120;
    } else {
      const alpha = easeInSine(this.timeBeganDying, 0, 1, 120)

      this.color.alpha = 1 - alpha;
      this.strokeColor.alpha = 1 - alpha;

      console.log(alpha)
      this.ctx.fillStyle = `rgba(0, 0, 0, ${alpha < 0 ? 0 : alpha})`
      this.ctx.fillRect(0, 0, this.width, this.height)

      if (this.color.alpha <= 0) this.isDead = true

      this.maskAlpha += this.fadeInterval
      this.timeBeganDying++
    }

    if (this.life > this.duration) {
      this.isDying = true;
    }

    this.minModifier += this.velocityModifierMin;
    this.maxModifier += this.velocityModifierMax;

    this.life++;
  }
}
