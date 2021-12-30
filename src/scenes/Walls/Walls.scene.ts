import { easeInElastic, easeInOutQuad } from "../../lib/easing";
import { calculate, collision, rand } from "../../lib/helpers";
import Rect from "../../lib/Rect";
import Size from "../../lib/Size";
import Sprite from "../../lib/Sprite";
import { Scene } from "../../lib/types";
import Wall from "../../lib/Wall";

export default class WallsScene implements Scene {

  static WALL_DIVISIONS = 4
  static PARTICLE_VX = 0;
  static PARTICLE_VY = 0;
  static ROTATION_STEP = .01;
  static MAX_PARTICLES = 1750;
  static WALL_WIDTH = 2;
  static WALL_HEIGHT = 2;

  static RIGHT_PRESSED = false;
  static LEFT_PRESSED = false;
  static UP_PRESSED = false;
  static DOWN_PRESSED = false;

  width: number;
  height: number;

  private ctx: CanvasRenderingContext2D;

  private walls: Wall[] = [];
  private drops: Sprite[] = [];
  private particles: Sprite[] = [];

  private particleCenterX = 0;
  private particleCenterY = 0;
  private radius = rand(50, 200);
  private angle = 0;

  /**
   *
   */
  constructor(width: number, height: number, context: CanvasRenderingContext2D) {
    this.width = width;
    this.height = height;
    this.ctx = context;

    this.particleCenterX = rand(0, this.width);
    this.particleCenterY = rand(0, this.height);

    for (let idx = 0; idx < WallsScene.WALL_DIVISIONS; idx++) {
      const w = this.width;
      const h = WallsScene.WALL_WIDTH
      const x = rand(0, this.width - w);
      const y = (this.height / WallsScene.WALL_DIVISIONS) * idx + this.height / WallsScene.WALL_DIVISIONS / 2;

      this.walls.push(
        new Wall(
          x,
          y,
          w,
          h,
          `rgb(${rand(0, 255)}, ${rand(0, 255)}, ${rand(0, 255)})`
        )
      );
    }

    for (let idx = 0; idx < WallsScene.WALL_DIVISIONS; idx++) {
      const w = WallsScene.WALL_WIDTH;
      const h = this.height;
      const x = (this.width / WallsScene.WALL_DIVISIONS) * idx + this.width / WallsScene.WALL_DIVISIONS / 2;
      const y = rand(0, this.height - h);

      this.walls.push(
        new Wall(
          x,
          y,
          w,
          h,
          `rgb(${rand(0, 255)}, ${rand(0, 255)}, ${rand(0, 255)})`
        )
      );
    }

    for (var x = 0; x < 1000; x++) {
      let size = Math.floor(rand(2, 12));
      this.drops.push(
        new Sprite(
          new Rect(rand(0, this.width), rand(0, this.height), size, size),
          rand(15, 600),
          `rgb(160,160,160)`,
          easeInElastic,
          rand(-2.5, 2.5),
          rand(-2.5, 2.5),
          new Rect(0, 0, this.width, this.height),
          new Size(2, 2, 5, 5)
        )
      );
    }
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

  private renderOtherStuff(objects: Sprite[], checkBoundaries: boolean, checkCollisions: boolean) {
    this.ctx.globalAlpha = 0.5;
    objects.forEach((p, idx) => {
      const cp = {
        x: p.x - p.w / 2, // use a center x point to calculate trajectory
        y: p.y - p.h / 2, // use a center y point to calculate trajectory
        w: p.w,
        h: p.h,
      } as Rect;
      this.ctx.globalAlpha = p.alpha;
      this.ctx.fillStyle = p.colorString;
      this.ctx.fillRect(cp.x, cp.y, p.w, p.h);

      // if (RIGHT_PRESSED) p.speedx = Math.abs(p.speedx);
      // if (LEFT_PRESSED) p.speedx = -Math.abs(p.speedx);
      // if (UP_PRESSED) p.speedy = -Math.abs(p.speedy);
      // if (DOWN_PRESSED) p.speedy = Math.abs(p.speedy);

      p.update();

      if (checkBoundaries) {
        p.checkBoundaries();
      }

      if (checkCollisions) {
        this.walls.forEach((wall) => {
          const angle = collision.collides(cp, wall);

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

          // if (angle !== null) {
          //   /// if we're not already in a hit situation, create one
          //   if (!p.hit) {
          //     p.hit = true;
          this.doCollision(angle, p, wall);
          //   }
          // } else p.hit = false; /// reset hit when this hit is done (angle = null)
        });
      }
    });
  }

  render(): void {

    this.ctx.globalAlpha = 0.8;
    this.walls.forEach((w) => {
      this.ctx.fillStyle = w.colorString;
      this.ctx.globalAlpha = .2;
      this.ctx.fillRect(w.x, w.y, w.w, w.h);
    });

    this.ctx.globalAlpha = 1;
    const { x, y } = calculate.getVertexFromAngle(
      this.particleCenterX,
      this.particleCenterY,
      this.angle,
      this.radius
    );
    this.particles.push(
      new Sprite(
        new Rect(x, y, 10, 10),
        120,
        `rgb(${rand(50, 255)}, ${rand(50, 255)}, ${rand(50, 255)})`,
        easeInElastic,
        rand(-2, 2),
        rand(-2, 2),
        new Rect(0, 0, this.width, this.height),
        new Size(2, 2, 8, 8)
      )
    );
    // run the render function
    this.renderOtherStuff(this.drops, true, true);
    // this.renderOtherStuff(this.particles, true, true);
    this.angle += WallsScene.ROTATION_STEP;
    if (this.angle >= 2 * Math.PI) {
      this.angle = 0;
      this.particleCenterX = rand(0, this.width);
      this.particleCenterY = rand(0, this.height);
      this.radius = rand(50, 200);
    }
    // Request to do this again ASAP
    while (this.particles.length > WallsScene.MAX_PARTICLES) this.particles.shift();


  }

}