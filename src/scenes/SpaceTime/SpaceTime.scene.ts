import { easeInCirc, easeInElastic, easeInExpo, easeInOutElastic, easeInOutQuart, easeInOutSine, easeInSine, easeOutSine, effects } from "../../lib/easing";
import { ObjectType } from "../../lib/enums";
import { calculate, rand } from "../../lib/helpers";
import Rect from "../../lib/Rect";
import Size from "../../lib/Size";
import Sprite from "../../lib/Sprite";
import { Randomizable, Scene } from "../../lib/types";
import Rift from "./Rift";

/**
 * Snakes on a Plane
 */
export default class SpaceTimeScene implements Scene, Randomizable {
  width: number;
  height: number;
  ctx: CanvasRenderingContext2D

  rifts: Rift[] = []



  private direction = Math.PI * 2 / 60 / 2.5;

  private count: number = 0;



  constructor(width: number, height: number, context: CanvasRenderingContext2D) {
    this.width = width;
    this.height = height;
    this.ctx = context;

    this.randomize();
  }

  randomize(): void {
    this.direction = -this.direction
  }

  renderLines(objects: Sprite[], rift: Rift): void {
    objects.forEach((drop, idx) => {
      this.ctx.beginPath();
      this.ctx.lineWidth = rand(.05, .5)
      this.ctx.strokeStyle = drop.colorString;
      this.ctx.moveTo(this.width / 2, this.height / 2 - rift.baseRadius)
      this.ctx.lineTo(drop.x, drop.y)
      this.ctx.stroke();
    });
  }

  renderPoints(objects: Sprite[]): void {
    objects.forEach((drop, idx) => {
      this.ctx.fillStyle = drop.colorString;
      this.ctx.fillRect(drop.x - drop.w / 2, drop.y - drop.h / 2, drop.w, drop.h);
      drop.update();
    });
  }

  // plotPoints(count: number) {
  //   for (let c = 0; c < count; c++) {

  //     const { x, y } = calculate.getVertexFromAngle(
  //       this.particleCenterX,
  //       this.particleCenterY,
  //       this.angle,
  //       this.radius
  //     );

  //     // if we collide with a wall, reset the origin point
  //     if (x < -50 || x > this.width + 50 || y < -50 || y > this.height + 50) {
  //       this.radius = this.baseRadius
  //       this.particleCenterX = this.width / 2 + this.radius
  //       this.particleCenterY = this.height / 2 - this.radius
  //       this.angle = Math.PI;
  //       this.direction = Math.abs(this.direction)
  //       this.color = `rgb(${rand(20, 255)},${rand(20, 255)},${rand(20, 255)})`
  //     }

  //     this.particles.push(
  //       new Sprite(
  //         new Rect(x, y, 0, 0),
  //         this.frames,
  //         this.color,
  //         this.effect,
  //         0, //rand(-.1, .1),
  //         0, //rand(-.1, .1),
  //         new Rect(0, 0, this.width, this.height),
  //         this.size,
  //         500,
  //         ObjectType.Particle,
  //         0
  //       )
  //     );

  //     this.updateDirection();
  //     this.angle += this.direction;
  //   }
  // }

  // private updateDirection() {
  //   // if we have travelled the length of the arc and need to change directions

  //   // clockwise
  //   if (this.angle >= this.toAngle && this.direction > 0) {
  //     this.direction = -this.direction; // change direction
  //     this.angle -= Math.PI; // rewind the angle 180 degrees ccw
  //     this.toAngle = this.angle - rand(0, Math.PI); // set a new to angle between 0 and 180 degrees

  //     // get a new centerpoint
  //     const { x: newX, y: newY } = calculate.getVertexFromAngle(
  //       this.particleCenterX, // current center x
  //       this.particleCenterY, // current center y
  //       this.angle, // starting angle
  //       -this.radius * (2 + this.step) // radius of current arc +
  //     );

  //     this.radius = this.radius * (1 + this.step);
  //     this.particleCenterX = newX;
  //     this.particleCenterY = newY;
  //   }

  //   // counter clockwise
  //   if (this.angle <= this.toAngle && this.direction < 0) {
  //     this.direction = -this.direction;
  //     this.angle += Math.PI;
  //     this.toAngle = this.angle + rand(0, Math.PI);
  //     const { x: newX, y: newY } = calculate.getVertexFromAngle(
  //       this.particleCenterX,
  //       this.particleCenterY,
  //       this.angle,
  //       -this.radius * (2 + this.step)

  //     );
  //     this.radius = this.radius * (1 + this.step);
  //     this.particleCenterX = newX;
  //     this.particleCenterY = newY;
  //   }
  // }

  render(): void {
    this.ctx.fillStyle = 'black'
    this.ctx.clearRect(0, 0, this.width, this.height); // clear the screen

    if (this.count % 60 === 0) {
      let min = rand(0, 2)
      let max = rand(min, 10)
      let size = new Size(min, min, max, max)
      this.rifts.push(new Rift(
        this.width,
        this.height,
        `rgb(${rand(20, 255)},${rand(20, 255)},${rand(20, 255)})`,
        Math.floor(rand(15, 120)),
        effects[Math.floor(Math.random() * effects.length)],
        size
      ))
      console.log(this.rifts)
    }

    this.rifts?.forEach(r => {
      r.plot(1)
      this.ctx.globalAlpha = rand(.1, .4)
      this.renderLines(r.particles, r);
      this.ctx.globalAlpha = rand(.5, .8)
      this.renderPoints(r.particles);
    })

    let deadRifts = this.rifts.filter(r => r.hasTornTroughSpaceTimeFabric)


    // this.plotPoints(this.speed) // the number of points correlates to speed
    // this.renderLines(this.particles); // 
    // this.renderPoints(this.particles); // 

    // Request to do this again ASAP
    //while (this.particles.length > this.limit) this.particles.shift();

    this.count++;
  }

}