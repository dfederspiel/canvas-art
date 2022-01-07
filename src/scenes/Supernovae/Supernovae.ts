import { easeInElastic, easeInOutBack, easeInOutCubic, easeInOutElastic, easeInOutSine, easeInQuad, easeInSine, easeOutQuad, easeOutSine, effects } from '../../lib/easing';
import { calculate, rand } from '../../lib/helpers';
import Rect from '../../lib/Rect';
import { Randomizable } from '../../lib/types';
import Segment from './Segment';
import RGB from "./RGB";
import Phosphorous from './Phosphorous';

export default class Supernova implements Randomizable {

  private maxAlpha: number = 0;


  private cx: number;
  private cy: number;

  private timeBeganDying: number = 0;

  private velocityModifierMin: number = rand(.0005, .001)
  private velocityModifierMax: number = rand(.01, .025)

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
  private duration: number = Math.floor(rand(120, 300));

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

    let r = Math.floor(rand(5, 255))
    let g = Math.floor(rand(5, 255))
    let b = Math.floor(rand(5, 255))

    this.color = new RGB(r, g, b, 0)
    this.strokeColor = new RGB(r, g, b, rand(.1, .3))

    this.strokeColor.darken(100)

    this.randomize();
    this.renderLobes();
  }

  update(step: number) {
    this.maxRadius += this.maxModifier;
    this.minRadius += this.minModifier;
    this.angle += step;
    this.segments.forEach(s => {
      this.angle += (Math.PI * 2) / this.limit;
      s.update(this.angle, this.minModifier, this.maxModifier)
    })
  }

  renderLobes() {
    let color = (Math.random() > .8) ? new RGB(rand(50, 255), rand(50, 255), rand(50, 255), rand(.8, 1)) : null
    for (let c = 0; c < this.limit; c++) {
      this.angle += (Math.PI * 2) / this.limit;
      const { x: pX, y: pY } = calculate.getVertexFromAngle(
        this.cx,
        this.cy,
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
        this.ease,
        color
      );
      this.segments.push(p);
    }
  }

  private renderLines(objects: Rect[]): void {
    this.ctx.beginPath();
    this.ctx.lineWidth = this.lineWidth;
    this.ctx.strokeStyle = this.strokeColor.toString();
    objects.forEach((o, idx) => {
      this.ctx.moveTo(this.cx, this.cy);
      this.ctx.lineTo(o.x, o.y);
    });
    this.ctx.stroke();
  }

  private renderOutline(objects: Rect[]): void {
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

  private renderArcs(objects: Phosphorous[]): void {
    if (objects.length === 0) return;
    this.ctx.strokeStyle = this.strokeColor.toString()
    objects.forEach((o, idx) => {
      if (o.isDead) return
      this.ctx.beginPath();
      this.ctx.fillStyle = o.color.toString();
      // const e = easeInSine(idx + 1, 1, o.size, objects.length);
      this.ctx.arc(o.x, o.y, o.size < 0 ? 0 : o.size, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.stroke();
    });
  }

  randomize(): void {
    this.angle = 0;
    this.minRadius = rand(1, 10);
    this.maxRadius = rand(10, 30);
    this.minModifier = rand(.1, .5);
    this.maxModifier = rand(2, 3.5);
    this.limit = Math.floor(rand(2, 12));
    this.steps = Math.floor(rand(20, 150 / this.limit));
    this.offset = 0;
    this.rotationInterval = rand(-(Math.PI / 30), Math.PI / 30);
    this.cx = rand(this.width * .25, this.width * .75);
    this.cy = rand(this.height * .25, this.height * .25);
    // this.cx = this.width / 2;
    // this.cy = this.height / 4
  }

  render() {
    this.segments.forEach((p) => {
      // this.renderLines(
      //   p.points.filter((i, idx) => idx % Math.floor(rand(2, 10)) === 0)
      // );

      // if (this.renderOutlines) this.renderOutline(p.points);

      this.renderArcs(p.points);
    });
    this.update(this.rotationInterval)

    if (this.color.alpha > 0.8 && this.direction > 0) {
      this.direction = -this.direction;
    }

    this.ctx.strokeStyle = this.color.toString();
    //this.update(this.rotationInterval);

    if (!this.isDying) {
      this.color.alpha += 1 / this.duration * 2;
      // this.strokeColor.alpha += 1 / this.duration * 4;
      // this.fadeInterval = this.color.alpha / 120;
    } else {
      const alpha = easeInSine(this.timeBeganDying, 0, 1, 120)

      this.color.alpha = 1 - alpha;
      this.strokeColor.alpha = 1 - alpha;

      // console.log(alpha)
      // this.ctx.fillStyle = `rgba(0, 0, 0, ${alpha < 0 ? 0 : alpha})`
      // this.ctx.fillRect(0, 0, this.width, this.height)

      if (this.color.alpha <= 0) this.isDead = true

      // this.maskAlpha += this.fadeInterval
      this.timeBeganDying++
    }

    if (this.life > this.duration) {
      this.isDying = true;
    }

    if (this.minModifier > 0) this.minModifier -= this.velocityModifierMin;
    if (this.maxModifier > 0) this.maxModifier -= this.velocityModifierMax;

    if (this.minModifier < 0 && this.maxModifier < 0) this.isDead = true

    this.life++;
  }
}
