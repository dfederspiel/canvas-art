import { easeInCirc, easeInElastic, easeInExpo, easeInOutElastic, easeInOutQuart, easeInOutSine, easeInSine, easeOutElastic, easeOutSine } from "../../lib/easing";
import { ObjectType } from "../../lib/enums";
import { calculate, rand } from "../../lib/helpers";
import Rect from "../../lib/Rect";
import Size from "../../lib/Size";
import Sprite from "../../lib/Sprite";
import { Scene } from "../../lib/types";
import Snake from "./Snake";

export default class SnakesScene implements Scene {
  width: number;
  height: number;
  ctx: CanvasRenderingContext2D

  snakes: Snake[] = [];

  private radius = 20;
  private count: number = 0;

  constructor(width: number, height: number, context: CanvasRenderingContext2D) {
    this.width = width;
    this.height = height;
    this.ctx = context;
  }

  renderOtherStuff(objects: Sprite[]): void {
    this.ctx.beginPath()
    this.ctx.lineWidth = .5
    this.ctx.strokeStyle = 'green'
    objects.forEach((drop, idx) => {
      drop.update();
      this.ctx.globalAlpha = drop.alpha;
      this.ctx.fillStyle = drop.colorString;
      this.ctx.arc(drop.x - drop.w / 2, drop.y - drop.h / 2, drop.w, 0, Math.PI * 2)
      this.ctx.fillRect(drop.x - drop.w / 2, drop.y - drop.h / 2, drop.w, drop.h);
    });
    this.ctx.stroke()
  }

  render(): void {
    this.ctx.clearRect(0, 0, this.width, this.height); // clear the screen

    if (this.snakes?.length < 10 && this.count % 60 === 0) {
      let min = 1
      let max = 10
      let size = new Size(min, min, max, max)
      this.snakes.push(new Snake(
        this.width,
        this.height,
        `rgb(${rand(75, 255)},${rand(75, 255)},${rand(75, 255)})`,
        45,
        easeInOutSine, // effects[Math.floor(Math.random() * effects.length)],
        size
      ))
    }

    this.snakes?.forEach(r => {
      r.plot(2)
      this.renderOtherStuff(r.particles);
    })

    this.snakes = this.snakes?.filter(r => !r.hasFinishedTearingThroughSpaceTimeFabric)

    this.count++
  }

}