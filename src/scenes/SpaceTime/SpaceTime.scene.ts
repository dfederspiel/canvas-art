import { easeInBack, easeInOutSine, effects } from "../../lib/easing";
import { rand } from "../../lib/helpers";
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
    this.ctx.lineWidth = rand(.5, 1)
    objects.forEach((drop, idx) => {
      this.ctx.beginPath()
      this.ctx.globalAlpha = rand(.025, .05)
      this.ctx.strokeStyle = drop.colorString;
      this.ctx.moveTo(this.width / 2, this.height / 2)
      this.ctx.lineTo(drop.x, drop.y)
      this.ctx.stroke();
    });
  }

  renderPoints(objects: Sprite[]): void {
    this.ctx.beginPath()
    this.ctx.globalAlpha = .9
    objects.forEach((drop, idx) => {
      this.ctx.fillStyle = drop.colorString;
      this.ctx.moveTo(drop.x - drop.w / 2, drop.y - drop.h / 2)
      this.ctx.arc(drop.x, drop.y, drop.w > 0 ? drop.w : 0, 0, Math.PI * 2)
      drop.update();
    });
    this.ctx.fill()
  }

  render(): void {
    this.ctx.clearRect(0, 0, this.width, this.height); // clear the screen

    if (this.rifts?.length < 3) {
      let min = rand(.5, 1)
      let max = rand(min, 7)
      let size = new Size(min, min, max, max)
      this.rifts.push(new Rift(
        this.width,
        this.height,
        `rgb(${rand(75, 255)},${rand(75, 255)},${rand(75, 255)})`,
        15,
        easeInOutSine, // effects[Math.floor(Math.random() * effects.length)],
        size
      ))
    }

    this.rifts?.forEach(r => {
      r.plot(15)
      this.renderLines(r.particles, r);
      this.renderPoints(r.particles);
    })

    this.rifts = this.rifts?.filter(r => !r.hasFinishedTearingThroughSpaceTimeFabric)


    // this.ctx.beginPath();
    // this.ctx.arc(
    //   this.width / 2,
    //   this.height / 2,
    //   75,
    //   0,
    //   Math.PI * 2
    // )
    // this.ctx.stroke()

    this.count++;
  }

}