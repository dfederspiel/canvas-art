import { ObjectType } from "../../lib/enums";
import Rect from "../../lib/Rect";
import Size from "../../lib/Size";
import Sprite from "../../lib/Sprite";
import { Scene } from "../../lib/types";
import { collision, colorRand, rand } from '../../lib/helpers'
import { easeInBack, easeInElastic, easeInOutQuad } from '../../lib/easing'
import Wall from "../../lib/Wall";

const MAX_PARTICLES = 1000;

let ROTATION_INTERVAL = (Math.PI * 2) / (60 * 60);
let ROTATION_ANGLE = ROTATION_INTERVAL - (Math.PI * 2) / 4;

export default class ClockScene implements Scene {

  width: number;
  height: number;

  #timeInMs: number;
  #ctx: CanvasRenderingContext2D;
  #radiansPerSecond: number;
  #radiansPerMinute: number;
  #radiansPerHour: number;

  #radius: number;

  private particles: Sprite[] = [];
  private backgroundGlitter: Sprite[] = [];

  #date: Date

  private walls: Wall[] = [];

  constructor(width: number, height: number, context: CanvasRenderingContext2D) {
    this.width = width;
    this.height = height;
    this.#ctx = context;
    this.#date = new Date();
    this.#radius = 50;
    this.particles = []
    this.#timeInMs =
      (this.#date.getHours() * 60 * 60 + this.#date.getMinutes() * 60 + this.#date.getSeconds()) *
      1000 +
      this.#date.getMilliseconds();

    // In order for things to move slowly around the screen, it
    this.#radiansPerSecond = (Math.PI * 2) / 60;
    this.#radiansPerMinute = this.#radiansPerSecond / 60; // 0.10471975511966 / 60 minutes = 0.001745329251994 radians
    this.#radiansPerHour = (this.#radiansPerMinute * 60) / 12 / 60;

    const WALL_WIDTH = 5;
    const MARGIN = .2 * this.width;
    this.walls.push(
      // LEFT
      new Wall(
        MARGIN - WALL_WIDTH / 2,
        MARGIN / 2 - WALL_WIDTH / 2,
        WALL_WIDTH,
        this.height - (MARGIN / 2) * 2,
        colorRand()
      ),
      // RIGHT
      new Wall(
        this.width - MARGIN - (WALL_WIDTH / 2),
        MARGIN / 2 - WALL_WIDTH / 2,
        WALL_WIDTH,
        this.height - (MARGIN / 2) * 2,
        colorRand()
      ),
      // TOP
      new Wall(
        MARGIN - WALL_WIDTH / 2,
        MARGIN / 2 - WALL_WIDTH / 2,
        this.width - MARGIN * 2 + WALL_WIDTH,
        WALL_WIDTH,
        colorRand()
      ),
      // BOTTOM
      new Wall(
        MARGIN - WALL_WIDTH / 2,
        this.height - MARGIN / 2 - (WALL_WIDTH / 2),
        this.width - MARGIN * 2 + WALL_WIDTH,
        WALL_WIDTH,
        colorRand()
      )
    );


    for (var x = 0; x < 1000; x++) {
      let sizeMin = rand(1, 3)
      let sizeMax = rand(4, 6)
      this.backgroundGlitter.push(
        new Sprite(
          new Rect(
            rand(0, this.width),
            rand(0, this.height),
            10,
            10,
          ),
          rand(15, 240),
          '#000',
          easeInElastic,
          rand(-2, 2),
          rand(-2, 2),
          new Rect(40, 40, this.width - 40, this.height - 40),
          new Size(sizeMin, sizeMin, sizeMax, sizeMax),
          rand(500, 5000),
          ObjectType.Particle,
        )
      );
    }
  }

  private getXYOnCircle(x: number, y: number, a: number, distance: number) {
    return {
      x: x + Math.cos(a) * distance,
      y: y + Math.sin(a) * distance,
    };
  }

  private renderParticleRing(cx: number, cy: number, srcRect: Rect, radius: number, angle: number) {
    const { x, y } = this.getXYOnCircle(cx, cy, ROTATION_ANGLE, radius);
    let sizeMin = rand(.5, 1.5)
    let sizeMax = rand(2.5, 5)
    this.particles.push(
      new Sprite(
        new Rect(x, y, 3, 3),
        rand(15, 300),
        `rgb(${rand(209, 255)}, ${rand(211, 251)}, ${rand(158, 218)})`,
        easeInBack,
        (x - (srcRect.x + srcRect.w / 2)) / rand(radius * 16, radius * 100),
        (y - (srcRect.y + srcRect.h / 2)) / rand(radius * 16, radius * 100),
        new Rect(
          100,
          this.height / 4,
          this.width - 100,
          this.height - this.height / 4
        ),
        new Size(sizeMin, sizeMin, sizeMax, sizeMax),
        rand(2000, 10000),
        ObjectType.Particle
      )
    );
    this.#ctx.globalAlpha = 1;
    if (angle >= Math.PI * 2) {
      angle = 0;
    }
    while (this.particles.length > MAX_PARTICLES) this.particles.shift();
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

  private renderOtherStuff(objects: Sprite[], checkBoundaries: boolean, checkCollisions: boolean) {
    this.#ctx.globalAlpha = 0.5;
    objects.forEach((p, idx) => {
      const cp = {
        x: p.x - p.w / 2, // use a center x point to calculate trajectory
        y: p.y - p.h / 2, // use a center y point to calculate trajectory
        w: p.w,
        h: p.h,
      } as Rect;
      this.#ctx.globalAlpha = p.alpha;
      this.#ctx.fillStyle = p.colorString;
      this.#ctx.fillRect(cp.x, cp.y, p.w, p.h);

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

    this.walls.forEach((w) => {
      this.#ctx.fillStyle = w.color.toString();
      this.#ctx.globalAlpha = checkCollisions ? 0.8 : 0.2;
      this.#ctx.fillRect(w.x, w.y, w.w, w.h);
    });

    this.#ctx.globalAlpha = 0.2;
  }

  render() {
    this.#ctx.clearRect(0, 0, this.width, this.height); // clear the screen

    this.#date = new Date();
    this.#timeInMs =
      (this.#date.getHours() * 60 * 60 + this.#date.getMinutes() * 60 + this.#date.getSeconds()) *
      1000 +
      this.#date.getMilliseconds();

    this.#ctx.globalAlpha = .75;

    // Hour Hand Position
    const { x: hoursX, y: hoursY } = this.getXYOnCircle(
      this.width / 2,
      this.height / 2,
      (this.#timeInMs / 1000) * this.#radiansPerHour - (Math.PI * 2) / 4,
      this.#radius + 150
    );

    // Minute Hand Position
    const { x: minutesX, y: minutesY } = this.getXYOnCircle(
      this.width / 2,
      this.height / 2,
      (this.#timeInMs / 1000) * this.#radiansPerMinute - (Math.PI * 2) / 4,
      this.#radius + 100
    );

    // Second Hand Position
    const { x: secondsX, y: secondsY } = this.getXYOnCircle(
      this.width / 2,
      this.height / 2,
      (this.#timeInMs / 1000) * this.#radiansPerSecond - (Math.PI * 2) / 4,
      this.#radius + 20
    );

    // Millisecond Hand Position
    const { x: secondHandOrbiterX, y: secondHandOrbiterY } = this.getXYOnCircle(
      secondsX,
      secondsY,
      (this.#timeInMs / 1000) * this.#radiansPerSecond * 60 - (Math.PI * 2) / 4,
      25
    );

    this.renderParticleRing(
      secondHandOrbiterX,
      secondHandOrbiterY,
      new Rect(secondsX, secondsY, 1, 1),
      10,
      10
    );

    this.renderOtherStuff(this.backgroundGlitter, true, true);
    this.renderOtherStuff(this.particles, true, true)

    this.#ctx.globalAlpha = 1;

    this.#ctx.beginPath();

    this.#ctx.lineWidth = .5
    this.#ctx.strokeStyle = "#ddd";

    this.#ctx.moveTo(this.width / 2, this.height / 2);
    this.#ctx.lineTo(secondsX, secondsY);

    this.#ctx.moveTo(this.width / 2, this.height / 2);
    this.#ctx.lineTo(minutesX, minutesY);

    this.#ctx.moveTo(this.width / 2, this.height / 2);
    this.#ctx.lineTo(hoursX, hoursY);

    this.#ctx.moveTo(secondsX, secondsY);
    this.#ctx.lineTo(secondHandOrbiterX, secondHandOrbiterY);

    this.#ctx.stroke();

    this.#ctx.strokeStyle = "#cc0";
    this.#ctx.fillStyle = "#cc0";

    this.#ctx.beginPath();
    this.#ctx.arc(this.width / 2, this.height / 2, 15, 0, 2 * Math.PI);
    this.#ctx.stroke();
    this.#ctx.fill();

    this.#ctx.beginPath();
    this.#ctx.arc(secondsX, secondsY, 8, 0, 2 * Math.PI);
    this.#ctx.fill();
    this.#ctx.stroke();

    this.#ctx.beginPath();
    this.#ctx.arc(minutesX, minutesY, 10, 0, 2 * Math.PI);

    this.#ctx.stroke();
    this.#ctx.fill();

    this.#ctx.beginPath();
    this.#ctx.arc(hoursX, hoursY, 12, 0, 2 * Math.PI);

    this.#ctx.fill();
    this.#ctx.stroke();

    this.#ctx.beginPath();
    this.#ctx.arc(secondHandOrbiterX, secondHandOrbiterY, 5, 0, 2 * Math.PI);
    this.#ctx.fill();

    this.#ctx.textAlign = "center";
    this.#ctx.textBaseline = "top";
    this.#ctx.fillStyle = '#000'
    this.#ctx.font = "10px Helvetica";
    this.#ctx.fillText(`${this.#date.getSeconds()}`, secondsX, secondsY - 5)
    this.#ctx.font = "12px Helvetica";
    this.#ctx.fillText(`${this.#date.getMinutes()}`, minutesX, minutesY - 6)
    this.#ctx.font = "16px Helvetica";
    this.#ctx.fillText(`${this.#date.getHours() > 12 ? this.#date.getHours() - 12 : this.#date.getHours()}`, hoursX, hoursY - 8)
  }
}
