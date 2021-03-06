import { easeInBack, easeInElastic, easeInOutCirc, easeInOutElastic, easeInOutSine, easeInSine, effects } from '../../lib/easing';
import { calculate, rand } from '../../lib/helpers';
import { Randomizable } from '../../lib/types';
import Segment from './Segment';
import Phosphorous from './Phosphorous/Phosphorous';
import RGB from '../../lib/RGB';
import { Distance, PhosphorousType } from './Phosphorous/types';
import Rect from '../../lib/Rect';
import Blinker from './Phosphorous/Blinker';

export default class Firework implements Randomizable {

  private maxAlpha: number = 0;


  private cx: number;
  private cy: number;

  private mortarX: number = window.innerWidth / 2;
  private mortarY: number = window.innerHeight;

  private mortar: Blinker;

  private count: number = 0;

  private distance: Distance

  private timeBeganDying: number = 0;

  private velocityModifierMin: number = rand(.0005, .001)
  private velocityModifierMax: number = rand(.001, .0025)

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
  private offset = 0 // rand(-50, 100);
  private steps: number = Math.floor(rand(50, 145));
  private ease: Function;
  private segments: Segment[] = [];
  private renderOutlines = false;

  private minModifier: number;
  private maxModifier: number;

  private life: number = 0;
  private duration: number = Math.floor(rand(120, 300));

  private ctx: CanvasRenderingContext2D;

  private minRadius: number;
  private maxRadius: number;

  private hasDetonated: boolean = false;

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

    this.strokeColor.darken(100);

    this.randomize();

    this.distance = calculate.distance({
      x: this.width / 2,
      y: this.height,
      w: 5,
      h: 5,
    } as Rect, {
      x: this.cx,
      y: this.cy,
      w: 5,
      h: 5,
    } as Rect)
  }

  update(step: number) {
    this.maxRadius += this.maxModifier;
    this.minRadius += this.minModifier;
    this.angle += step;
    this.segments.forEach(s => {
      this.angle += (Math.PI * 2) / this.limit;
      s.update()
    })
  }

  renderNodes(colorPrimary?: RGB, colorSecondary?: RGB) {
    let r = Math.random() > .2
    let fType = r ? PhosphorousType.Default : PhosphorousType.Blinker;

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
        colorPrimary,
        colorSecondary,
        fType,
        this.cx,
        this.cy,
      );
      this.segments.push(p);
    }
  }

  private renderArcs(objects: Phosphorous[]): void {
    if (objects.length === 0) return;
    this.ctx.strokeStyle = this.strokeColor.toString()
    objects.forEach((o, idx) => {
      if (o.isDead) return
      this.ctx.beginPath();
      this.ctx.fillStyle = o.color.toString();
      this.ctx.arc(o.x, o.y, o.w < 0 ? 0 : o.h, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.stroke();
    });
  }

  randomize(): void {
    this.angle = 0;
    this.minRadius = rand(-10, 10);
    this.maxRadius = rand(20, 40);
    this.minModifier = rand(.1, .5);
    this.maxModifier = rand(2, 3.5);
    this.limit = Math.floor(rand(2, 12));
    this.steps = Math.floor(rand(50 / this.limit, 150 / this.limit));
    this.offset = rand(5, 20);
    this.rotationInterval = 0;
    this.cx = rand(this.width * .45, this.width * .65);
    this.cy = rand(this.height * .20, this.height * .30);
  }

  private updateLaunch() {
    let r = easeInOutSine(this.count, 1, 2, 2)
    this.ctx.beginPath();
    this.ctx.fillStyle = 'rgba(150, 150, 150, .3)'
    this.ctx.arc(this.mortarX, this.mortarY, r, 0, Math.PI * 2)
    this.ctx.fill();
    this.ctx.stroke();
    this.mortarX += this.distance.dx / 60
    this.mortarY += this.distance.dy / (this.height / 20) + this.count / (this.height / 150)
    this.count++;
    if (this.count > this.height / 10) {
      this.cx = this.mortarX - r / 2;
      this.cy = this.mortarY - r / 2;
      this.hasDetonated = true;
      if (Math.random() < .2) {
        this.renderNodes();
      } else {
        let c = new RGB(rand(50, 255), rand(50, 255), rand(50, 255), rand(.8, 1))
        let d = new RGB(rand(50, 255), rand(50, 255), rand(50, 255), rand(.8, 1))
        this.renderNodes(
          c, Math.random() < .5 ? d : null
        )
      }
      this.ctx.fillStyle = 'rgba(255,255,255,.15)'
    }
  }

  render() {
    if (this.hasDetonated) {
      this.segments.forEach((p) => {
        this.renderArcs(p.points);
      });
      this.update(this.rotationInterval)

      this.isDead = true;
      this.segments.forEach(s => {
        if (!s.isDead) this.isDead = false;
      })

      if (this.minModifier > 0) this.minModifier -= this.velocityModifierMin;
      if (this.maxModifier > 0) this.maxModifier -= this.velocityModifierMax;
    } else {
      this.updateLaunch()
    }

    this.life++;
  }
}
