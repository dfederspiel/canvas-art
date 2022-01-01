import { easeInCirc, easeInElastic, easeInExpo, easeInOutElastic, easeInOutQuart, easeInOutSine, easeInSine, easeOutSine, effects } from "../../lib/easing";
import { ObjectType } from "../../lib/enums";
import { calculate, rand } from "../../lib/helpers";
import Rect from "../../lib/Rect";
import Size from "../../lib/Size";
import Sprite from "../../lib/Sprite";
import { Randomizable, Scene } from "../../lib/types";

/**
 * Snakes on a Plane
 */
export default class EscherScene implements Scene, Randomizable {
  width: number;
  height: number;
  ctx: CanvasRenderingContext2D

  private step: number = .0125; // 

  private particleCenterX = 0;
  private particleCenterY = 0;

  private baseRadius = rand(1, 100);
  private radius = 0;
  private frames = 30;
  private speed = 2;
  private limit = 500;
  private size = new Size(0, 0, 7, 7)
  private angle = Math.PI;

  private effect = effects[Math.floor(Math.random() * effects.length)];

  private direction = Math.PI * 2 / 60 / 2.5;

  private count: number = 0;
  private color: string = `rgb(${rand(200, 255)},0,0)`

  private toAngle = rand(Math.PI, Math.PI * 2);

  private particles: Sprite[] = [];

  constructor(width: number, height: number, context: CanvasRenderingContext2D) {
    this.width = width;
    this.height = height;
    this.ctx = context;

    this.radius = this.baseRadius

    // set the center point 
    this.particleCenterX = this.width / 2 + this.radius
    this.particleCenterY = this.height - this.radius
  }
  randomize(): void {
    this.step = rand(.0001, .005)
    this.baseRadius = rand(50, 100)
    this.radius = this.baseRadius
    this.frames = Math.floor(rand(15, 60));
    this.speed = rand(.1, 3);
    this.limit = rand(10, 2500)
    this.particles = []
    let min = rand(0, 5)
    let max = rand(min, 20)
    this.size = new Size(min, min, max, max)
    this.particleCenterX = this.width / 2 + this.radius
    this.particleCenterY = this.height - this.radius
    this.angle = Math.PI;
    this.direction = Math.abs(this.direction)
  }

  renderPoints(objects: Sprite[]): void {
    objects.forEach((drop, idx) => {
      this.ctx.globalAlpha = drop.alpha;
      this.ctx.fillStyle = drop.colorString;
      this.ctx.strokeStyle = '#fff';
      this.ctx.lineWidth = .5
      this.ctx.strokeRect(drop.x - drop.w / 2, drop.y - drop.h / 2, drop.w, drop.h);
      //this.ctx.fillRect(drop.x - drop.w / 2, drop.y - drop.h / 2, drop.w, drop.h);

      drop.update();
      // drop.checkBoundaries();
    });
  }

  plotPoints(count: number) {
    for (let c = 0; c < count; c++) {

      const { x, y } = calculate.getVertexFromAngle(
        this.particleCenterX,
        this.particleCenterY,
        this.angle,
        this.radius
      );

      // if we collide with a wall, reset the origin point
      if (x < -50 || x > this.width + 50 || y < -50) {
        this.radius = this.baseRadius
        this.particleCenterX = this.width / 2 + this.radius
        this.particleCenterY = this.height - this.radius
        this.angle = Math.PI;
        this.direction = Math.abs(this.direction)
        this.color = `rgb(${rand(20, 255)},${rand(20, 255)},${rand(20, 255)})`
        this.effect = effects[Math.floor(Math.random() * effects.length)]
      }

      this.particles.push(
        new Sprite(
          new Rect(x, y, 0, 0),
          this.frames,
          this.color,
          this.effect,
          0,
          rand(.25, .5),
          new Rect(0, 0, this.width, this.height),
          this.size,
          500,
          ObjectType.Particle,
          0
        )
      );

      // run the render function
      this.angle += this.direction;


      if (this.angle >= this.toAngle && this.direction > 0) {
        this.direction = -this.direction;
        this.angle -= Math.PI;
        this.toAngle = -(rand(-Math.PI, Math.PI));
        const { x: newX, y: newY } = calculate.getVertexFromAngle(
          this.particleCenterX,
          this.particleCenterY,
          this.angle,
          -this.radius * (2 + this.step)
        );
        this.radius = this.radius * (1 + this.step)
        this.particleCenterX = newX;
        this.particleCenterY = newY;
      }
      // counter clockwise
      if (this.angle <= this.toAngle && this.direction < 0) {
        this.direction = -this.direction;
        this.angle += Math.PI;
        this.toAngle = rand(-Math.PI * 2, Math.PI * 2);
        const { x: newX, y: newY } = calculate.getVertexFromAngle(
          this.particleCenterX,
          this.particleCenterY,
          this.angle,
          -this.radius * (2 + this.step)

        );
        this.radius = this.radius * (1 + this.step)
        this.particleCenterX = newX;
        this.particleCenterY = newY;
      }
    }
  }

  renderStem(r: number) {
    this.ctx.globalAlpha = 1;
    this.ctx.strokeStyle = "#fff"
    this.ctx.lineWidth = this.size.max.w;
    this.ctx.beginPath();
    this.ctx.moveTo(this.width / 2, this.height)
    this.ctx.lineTo(this.width / 2, this.height - r / 2)
    this.ctx.stroke();

  }

  render(): void {
    this.count = this.count + 1 // count render calls
    this.plotPoints(this.speed) // the number of points correlates to speed
    this.renderPoints(this.particles); // 
    //this.renderStem(this.baseRadius * 1.5)

    // Request to do this again ASAP
    while (this.particles.length > this.limit) this.particles.shift();
  }

}