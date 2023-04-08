import { easeInOutSine, effects } from '../../lib/easing';
import { calculate, getRandomPhosphorousType, rand } from '../../lib/helpers';
import { Randomizable } from '../../lib/types';
import Segment from './Segment';
import Phosphorous from './Phosphorous/Phosphorous';
import RGB from '../../lib/RGB';
import { PhosphorousType } from './Phosphorous/types';
import HSL from '../../lib/HSL';


const GRAVITY = -65; // Gravity constant

export default class Firework implements Randomizable {

  private maxAlpha: number = 0;


  private cx: number;
  private cy: number;

  private mortarX: number = window.innerWidth / 2;
  private mortarY: number = window.innerHeight;

  private count: number = 0;

  private velocityModifierMin: number = rand(.0005, .001)
  private velocityModifierMax: number = rand(.001, .0025)

  private rotationInterval: number = rand(-Math.PI / 60 / 60, Math.PI / 60 / 60);
  private limit: number;
  private angle: number = 0;

  private strokeColor: RGB

  private width = window.innerWidth;
  private height = window.innerHeight;
  private offset = 0 // rand(-50, 100);
  private steps: number = Math.floor(rand(50, 145));
  private ease: Function;
  segments: Segment[] = [];

  private minModifier: number;
  private maxModifier: number;

  private duration: number = Math.floor(rand(120, 300));

  private ctx: CanvasRenderingContext2D;

  private minRadius: number;
  private maxRadius: number;

  private hasDetonated: boolean = false;

  private launchVelocity: number;
  private launchAngle: number;

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

    let r = Math.floor(rand(5, 255))
    let g = Math.floor(rand(5, 255))
    let b = Math.floor(rand(5, 255))

    this.strokeColor = new RGB(r, g, b, rand(.1, .3))

    this.strokeColor.darken(100);

    this.randomize();

    this.launchVelocity = rand(190, 230); // Adjust initial launch velocity as needed
    
    // Convert degrees to radians: (Math.PI / 180) * degrees
    let minLaunchAngle = (Math.PI / 180) * (90 - 10); // 70 degrees in radians
    let maxLaunchAngle = (Math.PI / 180) * (90 + 10); // 110 degrees in radians
    this.launchAngle = rand(minLaunchAngle, maxLaunchAngle); // Launch angle: straight up +/- 20 degrees
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

  renderNodes(colorPrimary?: HSL, colorSecondary?: HSL) {
    let r = Math.random() > .2
    let fType = getRandomPhosphorousType();

    for (let c = 0; c <= this.limit; c++) {
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
    objects.forEach((o, idx) => {
      if (o.isDead) return
      this.ctx.beginPath();
      this.ctx.fillStyle = o.color.toString();
      this.ctx.strokeStyle = o.color.toString()
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
    this.ctx.strokeStyle = 'rgba(150, 150, 150, .9)'
    this.ctx.arc(this.mortarX, this.mortarY, r, 0, Math.PI * 2)
    this.ctx.fill();
    this.ctx.stroke();


    //this.mortarX += this.distance.dx / 60
    //this.mortarY += this.distance.dy / (this.height / 20) + this.count / (this.height / 150)
    let elapsedTime = this.count / 60; // Assuming 60 frames per second
    let vx = this.launchVelocity * Math.cos(this.launchAngle);
    let vy = this.launchVelocity * Math.sin(this.launchAngle) + GRAVITY * elapsedTime;

    this.mortarX += vx / 30; // Update the x position
    this.mortarY -= vy / 30; // Update the y position

    this.count++;

    // Gravity (in pixels per second squared)
    const gravity = 50;

    // Calculate the time it takes for the shell to reach its highest point
    const timeToApex = this.launchVelocity / gravity;

    if (this.count > timeToApex * 60) {
      this.cx = this.mortarX - r / 2;
      this.cy = this.mortarY - r / 2;
      this.hasDetonated = true;
      if (Math.random() < .2) {
        this.renderNodes();
      } else {
        let c = new HSL(rand(0, 360), rand(90, 100), rand(33, 100)) // HSL.fromRGB(rand(50, 255), rand(50, 255), rand(50, 255), rand(.8, 1))
        let d = new HSL(rand(0, 360), rand(60, 100), rand(33, 100)) // HSL.fromRGB(rand(50, 255), rand(50, 255), rand(50, 255), rand(.8, 1))
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

    // this.life++;
  }
}
