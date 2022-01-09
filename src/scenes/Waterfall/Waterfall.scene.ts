import { easeInBack, easeInElastic, easeInOutQuad, easeLinear } from "../../lib/easing";
import { ObjectType } from "../../lib/enums";
import { collision, colorRand, rand } from "../../lib/helpers";
import Rect from "../../lib/Rect";
import RGB from "../../lib/RGB";
import Size from "../../lib/Size";
import Sprite from "../../lib/Sprite";
import { Scene } from "../../lib/types";
import Wall from "../../lib/Wall";

export default class WaterfallScene implements Scene {
  width: number;
  height: number;
  ctx: CanvasRenderingContext2D;

  private walls: Wall[] = [];
  private particles: Sprite[] = [];

  private maxParticles = 10000

  private counter: number = 0;
  private max_color: number = 255;
  private direction: number = 1;

  private xpos = 0;
  private xposplus = 0

  constructor(width: number, height: number, context: CanvasRenderingContext2D) {
    this.width = width;
    this.height = height;
    this.ctx = context;

    this.xpos = this.width / 2;
    this.xposplus = 5

    // this.red = new RGB(0xcc, 0, 0, 1);
    // this.green = new RGB(0, 0xcc, 0, 1);
    // this.blue = new RGB(0, 0, 0xcc, 1);

    this.walls = [
      new Wall(this.width * .2, this.height / 2 - 200, this.width * .6, 1, new RGB(rand(50, 200), rand(50, 200), rand(150, 250), .8)),
      new Wall(this.width * .2, this.height / 2, this.width * .6, 1, new RGB(rand(50, 200), rand(50, 200), rand(150, 250), .8)),
      new Wall(this.width * .2, this.height / 2 + 200, this.width * .6, 1, new RGB(rand(50, 200), rand(50, 200), rand(150, 250), .8)),
    ]

    // for (let x = 0; x < 4000; x++) this.particles.push(this.particle(
    //   rand(0, this.width),
    //   rand(-100, -75)
    // ))
    // for (let x = 0; x < 2000; x++) this.particles.push(this.particle(
    //   rand(0, this.width),
    //   rand(this.height - 100, this.height)
    // ))
  }

  private particle(
    x: number = rand(0, this.width),
    y: number = rand(0, this.height),
    w: number = rand(1, 5),
    h: number = rand(1, 5),
    c: string = new RGB(0, rand(0, 50), rand(100, 250), .8).toString()
  ) {
    const frames = rand(5, 150);
    return new Sprite(
      new Rect(
        x - w / 2,
        y - h / 2,
        w,
        h,
      ),
      frames,
      c,
      easeLinear,
      0,
      rand(1, 2.5),
      new Rect(0, 0, this.width, this.height),
      new Size(0, 0, 7.5, 7.5),
      200,
      ObjectType.Particle,
      rand(0, frames),
    )
  }

  private doCollision(angle: number, obj: Sprite, wall: Rect) {
    // did we have an intersection?
    if (angle !== null) {
      /// if we're not already in a hit situation, create one
      if (!obj.hit) {
        obj.hit = true;
        const { angles } = wall;
        /// zone 1 - left
        if (
          (angle >= 0 && angle < angles.tl) ||
          (angle > angles.bl && angle < 360)
        ) {
          /// if moving in + direction deflect rect 1 in x direction etc.
          if (obj.speedX > 0) obj.speedX = -obj.speedX;
        } else if (angle >= angles.tl && angle < angles.tr) {
          /// zone 2 - top
          if (obj.speedY > 0) obj.speedY = -obj.speedY;
        } else if (angle >= angles.tr && angle < angles.br) {
          /// zone 3 - right
          if (obj.speedX < 0) obj.speedX = -obj.speedX;
        } else {
          /// zone 4 - bottom
          if (obj.speedY < 0) obj.speedY = -obj.speedY;
        }
      }
    } else obj.hit = false; /// reset hit when this hit is done (angle = null)
  }

  render(): void {
    this.ctx.clearRect(0, 0, this.width, this.height); // clear the screen

    for (let x = 0; x < 5; x++) this.particles.push(this.particle(
      this.xpos,
      rand(-100, -75),
    ))

    this.xpos += this.xposplus;

    if (this.xpos > this.width - 300 || this.xpos < 300) this.xposplus = -this.xposplus;

    // this.walls[0].colorString = `rgb(${this.counter}, 0, 0)`
    // this.walls[1].colorString = `rgb(0, ${this.counter}, 0)`
    // this.walls[2].colorString = `rgb(0, 0, ${this.counter})`

    this.ctx.globalAlpha = .5

    this.walls.forEach(wall => {
      this.ctx.fillStyle = wall.color.toString();
      this.ctx.fillRect(wall.x, wall.y, wall.w, wall.h)
    })

    this.particles.forEach(p => {
      p.checkBoundaries();

      this.walls.forEach(wall => {
        const angle = collision.collides(p, wall);
        if (angle) {
          wall.hits++;
          p.colorString = wall.color.toString();
          p.hitTime = Date.now();
          p.alpha = 1;
        }

        if (p.hitTime > 0) {
          const a = easeInOutQuad(
            Date.now() - p.hitTime,
            0,
            1,
            p.hitEffectDuration
          );
          p.alpha = 1 - a;
          if (Date.now() > p.hitTime + p.hitEffectDuration) {
            p.hitTime = 0;
            p.alpha = 0;
          }
        }
        //this.doCollision(angle, p, wall);
      })
      this.ctx.globalAlpha = .8
      this.ctx.fillStyle = p.colorString
      const cp = {
        x: p.x - p.w / 2, // use a center x point to calculate trajectory
        y: p.y - p.h / 2, // use a center y point to calculate trajectory
        w: p.w,
        h: p.h,
      } as Rect;
      this.ctx.fillRect(cp.x, cp.y, cp.w, cp.h)
      p.update();

    })

    if (this.counter < 200) this.direction = 1

    if (this.direction > 0)
      this.counter += 1;
    else
      this.counter -= 1;

    if (this.counter % this.max_color === 0)
      this.direction = -this.direction

    while (this.particles.length > this.maxParticles) this.particles.shift()
  }
}