import { easeInOutSine, effects, getRandomEasing } from '../../lib/easing';
import { calculate, getRandomPhosphorousType, rand } from '../../lib/helpers';
import { Randomizable } from '../../lib/types';
import Segment from './Segment';
import Phosphorous from './Phosphorous/Phosphorous';
import RGB from '../../lib/RGB';
import { PhosphorousType } from './Phosphorous/types';
import HSL from '../../lib/HSL';
import Size from '../../lib/Size';


function generateCirclePoints(cx: number, cy: number): { x: number; y: number }[] {
  const points: { x: number; y: number }[] = [];
  const numPoints = 60;
  const radius = 50;
  const centerX = cx;
  const centerY = cy;

  for (let i = 0; i < numPoints; i++) {
    const angle = (2 * Math.PI / numPoints) * i;
    const x = centerX + radius * Math.cos(angle)+ rand(-.05, .05);
    const y = centerY + radius * Math.sin(angle)+ rand(-.05, .05);
    points.push({ x, y });
  }

  return points;
}

function generateStarPoints(cx: number, cy: number, num: number): { x: number; y: number }[] {
  const points: { x: number; y: number }[] = [];
  const numPoints = num;
  const outerRadius = 15;
  const innerRadius = 2;
  const centerX = cx;
  const centerY = cy;

  for (let i = 0; i < numPoints; i++) {
    const angle = (Math.PI / (numPoints / 2)) * i;
    const radius = i % 2 === 0 ? outerRadius : innerRadius;
    const x = centerX + radius * Math.cos(angle)+ rand(-5, 5);
    const y = centerY + radius * Math.sin(angle)+ rand(-5, 5);
    points.push({ x, y });
  }

  return points;
}


const GRAVITY = -65; // Gravity constant

export default class Firework implements Randomizable {

  private cx: number;
  private cy: number;

  private mortarX: number = window.innerWidth / 2;
  private mortarY: number = window.innerHeight;

  private count: number = 0;

  private renderFancyFirework: boolean = false;

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

  // segments: Segment[] = [];

  protected points: Phosphorous[] = [];

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

    let r = Math.floor(rand(5, 255))
    let g = Math.floor(rand(5, 255))
    let b = Math.floor(rand(5, 255))

    this.strokeColor = new RGB(r, g, b, rand(.1, .3))

    this.strokeColor.darken(100);

    this.randomize();

    this.renderFancyFirework = Math.random() > .95;

    let minLaunchAngle = 0;
    let maxLaunchAngle = 0;

    if(this.renderFancyFirework) {
      this.launchVelocity =  rand(200, 230); // Adjust initial launch velocity as needed
    
      // Convert degrees to radians: (Math.PI / 180) * degrees
      minLaunchAngle = (Math.PI / 180) * (90 - 25); // 70 degrees in radians
      maxLaunchAngle = (Math.PI / 180) * (90 + 25); // 110 degrees in radians
    } else {
      this.launchVelocity = rand(120, 180); // Adjust initial launch velocity as needed
    
      // Convert degrees to radians: (Math.PI / 180) * degrees
      minLaunchAngle = (Math.PI / 180) * (90 - 15); // 70 degrees in radians
      maxLaunchAngle = (Math.PI / 180) * (90 + 15); // 110 degrees in radians
    }
    
    this.launchAngle = rand(minLaunchAngle, maxLaunchAngle); // Launch angle: straight up +/- 20 degrees
  }

  update(step: number) {
    // this.maxRadius += this.maxModifier;
    // this.minRadius += this.minModifier;
    // this.angle += step;
    this.points.forEach(p => {
      // this.angle += (Math.PI * 2) / this.limit;
      p.update()
    })
  }

  plotPhosphorousPoints() {
    const c1 = new HSL(rand(0, 360), 100, 40, 1)
    const c2 = new HSL(rand(0, 360), 100, 40, 1)
    if (this.renderFancyFirework) {
      let r = Math.random() > .2
      let fType = getRandomPhosphorousType();
      let segments: Segment[] = [];
      const ease = getRandomEasing();
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
          ease,
          c1,
          c2,
          fType,
          this.cx,
          this.cy,
        );
        segments.push(p);
      }

      segments.forEach(s => { this.points.push(...s.points) });
    } else {
      const points = generateStarPoints(this.cx, this.cy, rand(20, 60));
      const c1 =new HSL(rand(0, 360), rand(40, 80), 60, 1)
      const c2 =new HSL(rand(0, 360), rand(40, 80), 60, 1)
      const size = new Size(0.8, rand(1, 1.8), 0.8, rand(1, 1.8));
      this.points.push(...points.map(p => new Phosphorous(p.x, p.y, this.cx, this.cy, size, c1, c2, getRandomEasing())))
    }
  }


  // plotPhosphorousPoints(colorPrimary?: HSL, colorSecondary?: HSL) {
  //   const points = generateStarPoints(this.cx, this.cy, rand(10, 100));
  //   const c1 =new HSL(rand(0, 360), 100, 40, 1)
  //   const c2 = new HSL(rand(0, 360), 100, 40, 1)
  //   this.points.push(...points.map(p => new Phosphorous(p.x, p.y, this.cx, this.cy, new Size(1,1,.3,.3), c1, c2, easeInOutSine)))
  // }

  private renderPhosphorous(objects: Phosphorous[]): void {
    if (objects.length === 0) return;
    objects.forEach((o, idx) => {
      if (o.isDead) return
      this.ctx.beginPath();
      this.ctx.fillStyle = o.color.toString();
      // this.ctx.strokeStyle = o.secondaryColor.toString()
      this.ctx.arc(o.x, o.y, o.w < 0 ? 0 : o.w, 0, Math.PI * 2);
      this.ctx.fill();
      //this.ctx.stroke();
    });
  }

  randomize(): void {
    this.angle = 0;
    this.minRadius = rand(5, 10);
    this.maxRadius = rand(15, 45);
    this.minModifier = rand(.1, .5);
    this.maxModifier = rand(2, 3.5);
    this.limit = Math.floor(rand(2, 30));
    this.steps = Math.floor(rand(50 / this.limit, 300 / this.limit));
    this.offset = rand(5, 20);
    this.rotationInterval = rand(0, 1);
    this.cx = rand(this.width * .45, this.width * .65);
    this.cy = rand(this.height * .20, this.height * .30);
  }

  private updateLaunch() {
    let r = easeInOutSine(this.count,.5, 1, 2)
    this.ctx.beginPath();
    this.ctx.fillStyle = 'rgba(150, 150, 150, .3)'
    this.ctx.strokeStyle = 'rgba(150, 150, 150, .9)'
    this.ctx.arc(this.mortarX, this.mortarY, r, 0, Math.PI * 2)
    this.ctx.fill();
    this.ctx.stroke();

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

    if (this.count > timeToApex * 50) {
      this.cx = this.mortarX - r / 2;
      this.cy = this.mortarY - r / 2;
      this.hasDetonated = true;
      if (Math.random() < .2) {
        this.plotPhosphorousPoints();
      } else {
        let c = new HSL(rand(0, 360), rand(90, 100), rand(33, 100)) // HSL.fromRGB(rand(50, 255), rand(50, 255), rand(50, 255), rand(.8, 1))
        let d = new HSL(rand(0, 360), rand(60, 100), rand(33, 100)) // HSL.fromRGB(rand(50, 255), rand(50, 255), rand(50, 255), rand(.8, 1))
        this.plotPhosphorousPoints()
      }
      this.ctx.fillStyle = 'rgba(255,255,255,.15)'
    }
  }

  render() {
    if (this.hasDetonated) {
      
      this.update(this.rotationInterval)
      this.renderPhosphorous(this.points);
      
      this.isDead = true;
      this.points.forEach(p => {
        if (!p.isDead) this.isDead = false;
      })

      if (this.minModifier > 0) this.minModifier -= this.velocityModifierMin;
      if (this.maxModifier > 0) this.maxModifier -= this.velocityModifierMax;
    } else {
      this.updateLaunch()
    }
  }
}
