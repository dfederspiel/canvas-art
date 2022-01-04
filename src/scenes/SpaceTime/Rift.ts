import { effects } from "../../lib/easing";
import { ObjectType } from "../../lib/enums";
import { calculate, rand } from "../../lib/helpers";
import Rect from "../../lib/Rect";
import Size from "../../lib/Size";
import Sprite from "../../lib/Sprite";

export default class Rift {
  hasTornTroughSpaceTimeFabric: boolean = false;

  private width: number;
  private height: number;

  private angle: number = 0;
  private toAngle: number = 0;
  private direction: number = .125;

  private cx: number = 0;
  private cy: number = 0;

  baseRadius: number = 20;
  private radius: number = 10;

  private step: number = .0125;

  particles: Sprite[] = []

  private color: string;
  private frames: number = 200;
  private effect: Function;

  private size: Size;

  private limit: number = 1000

  constructor(
    width: number,
    height: number,
    color: string,
    frames: number,
    effect: Function,
    size: Size
  ) {
    this.width = width;
    this.height = height;
    this.color = color;
    this.frames = frames;
    this.effect = effect;
    this.size = size;
    this.randomize()
  }

  randomize(): void {
    this.step = rand(.0001, .025)
    this.baseRadius = 20
    this.radius = this.baseRadius
    this.frames = Math.floor(rand(15, 120));
    this.limit = rand(1000, 2500)
    this.particles = []
    let min = rand(0, 5)
    let max = rand(min, 10)
    this.size = new Size(min, min, max, max)
    this.cx = this.width / 2 + this.radius
    this.cy = this.height / 2 - this.radius
    this.angle = Math.PI;
    this.direction = -this.direction
    this.effect = effects[Math.floor(Math.random() * effects.length)]
    this.color = `rgb(${rand(20, 255)},${rand(20, 255)},${rand(20, 255)})`
  }

  private updateDirection() {
    // if we have travelled the length of the arc and need to change directions

    // clockwise
    if (this.angle >= this.toAngle && this.direction > 0) {
      this.direction = -this.direction; // change direction
      this.angle -= Math.PI; // rewind the angle 180 degrees ccw 
      this.toAngle = this.angle - rand(0, Math.PI); // set a new to angle between 0 and 180 degrees

      // get a new centerpoint
      const { x: newX, y: newY } = calculate.getVertexFromAngle(
        this.cx, // current center x
        this.cy, // current center y
        this.angle, // starting angle
        -this.radius * (2 + this.step) // radius of current arc + 
      );

      this.radius = this.radius * (1 + this.step);
      this.cx = newX;
      this.cy = newY;
    }

    // counter clockwise
    if (this.angle <= this.toAngle && this.direction < 0) {
      this.direction = -this.direction;
      this.angle += Math.PI;
      this.toAngle = this.angle + rand(0, Math.PI);
      const { x: newX, y: newY } = calculate.getVertexFromAngle(
        this.cx,
        this.cy,
        this.angle,
        -this.radius * (2 + this.step)

      );
      this.radius = this.radius * (1 + this.step);
      this.cx = newX;
      this.cy = newY;
    }
  }

  plot(count: number) {
    for (let c = 0; c < count; c++) {

      const { x, y } = calculate.getVertexFromAngle(
        this.cx,
        this.cy,
        this.angle,
        this.radius
      );

      // if we collide with a wall, reset the origin point
      if (x < -50 || x > this.width + 50 || y < -50 || y > this.height + 50) {
        this.hasTornTroughSpaceTimeFabric = true;
      }

      this.particles.push(
        new Sprite(
          new Rect(x, y, 0, 0),
          this.frames,
          this.color,
          this.effect,
          0, //rand(-.1, .1),
          0, //rand(-.1, .1),
          new Rect(0, 0, this.width, this.height),
          this.size,
          500,
          ObjectType.Particle,
          0
        )
      );

      this.updateDirection();
      this.angle += this.direction;

      while (this.particles.length > this.limit) this.particles.shift();
    }
  }
}