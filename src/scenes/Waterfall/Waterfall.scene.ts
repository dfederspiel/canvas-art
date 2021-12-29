import { easeInOutQuad, easeLinear } from "../../lib/easing";
import { ObjectType } from "../../lib/enums";
import { collision, rand } from "../../lib/helpers";
import Rect from "../../lib/Rect";
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

  constructor(width: number, height: number, context: CanvasRenderingContext2D) {
    this.width = width;
    this.height = height;
    this.ctx = context;

    this.walls = [
      new Wall(this.width * .3 - 50, this.height / 2 - 50, 100, 100, '#c00'),
      new Wall(this.width / 2 - 50, this.height / 2 - 50, 100, 100, '#0c0'),
      new Wall(this.width * .7 - 50, this.height / 2 - 50, 100, 100, '#00c'),
    ]

    for (let x = 0; x < 2000; x++) this.particles.push(this.particle(
      rand(0, this.width),
      rand(0, 100)
    ))
    for (let x = 0; x < 2000; x++) this.particles.push(this.particle(
      rand(0, this.width),
      rand(this.height - 100, this.height)
    ))
  }

  private particle(
    x: number = rand(0, this.width),
    y: number = rand(0, this.height),
    w: number = rand(1, 5),
    h: number = rand(1, 5),
    c: string = '#222'
  ) {
    return new Sprite(
      new Rect(
        x,
        y,
        w,
        h,
      ),
      rand(60, 240),
      c,
      easeLinear,
      rand(-.01, .01),
      rand(-2, 2),
      new Rect(0, 0, this.width, this.height),
      new Size(2, 2, 6, 6),
      1000,
      ObjectType.Particle
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
          if (obj.speedx > 0) obj.speedx = -obj.speedx;
        } else if (angle >= angles.tl && angle < angles.tr) {
          /// zone 2 - top
          if (obj.speedy > 0) obj.speedy = -obj.speedy;
        } else if (angle >= angles.tr && angle < angles.br) {
          /// zone 3 - right
          if (obj.speedx < 0) obj.speedx = -obj.speedx;
        } else {
          /// zone 4 - bottom
          if (obj.speedy < 0) obj.speedy = -obj.speedy;
        }
      }
    } else obj.hit = false; /// reset hit when this hit is done (angle = null)
  }

  render(): void {

    // this.particles.push(this.particle())

    this.walls.forEach(wall => {
      this.ctx.fillStyle = wall.colorString;
      this.ctx.fillRect(wall.x, wall.y, wall.w, wall.h)
    })

    this.particles.forEach(p => {
      p.checkBoundaries();

      this.walls.forEach(wall => {
        const angle = collision.collides(p, wall);
        if (angle) {
          wall.hits++;
          p.colorString = wall.colorString;
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
        this.doCollision(angle, p, wall);
      })

      this.ctx.fillStyle = p.colorString
      this.ctx.fillRect(p.x, p.y, p.w, p.h)
      p.update();

    })

    while (this.particles.length > 4000) this.particles.shift();
  }
}