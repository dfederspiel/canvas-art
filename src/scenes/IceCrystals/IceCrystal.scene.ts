import { easeInCirc, easeInElastic, easeInOutExpo, easeInOutSine, easeOutElastic, easeOutSine } from "../../lib/easing";
import { calculate, rand } from "../../lib/helpers";
import Rect from "../../lib/Rect";
import { Randomizable, Scene } from "../../lib/types";
import Crystal from "./Crystal";
import Segment from "./Segment";

export default class IceCrystalScene implements Scene, Randomizable {
  width: number;
  height: number;
  ctx: CanvasRenderingContext2D

  private angle = 0;
  private count = 0;

  private layers = 4;

  private crystals: Crystal[] = []

  constructor(width: number, height: number, context: CanvasRenderingContext2D) {
    this.width = width;
    this.height = height;
    this.ctx = context;
  }
  randomize(): void {
    //this.crystals.forEach(f => f.randomize())
  }

  renderLines(objects: Rect[], alpha: number): void {
    this.ctx.beginPath();
    objects.forEach((drop, idx) => {
      this.ctx.globalAlpha = alpha
      this.ctx.moveTo(this.width / 2, this.height / 2)
      this.ctx.lineTo(drop.x, drop.y)
    });
    this.ctx.stroke();
  }

  renderOutline(objects: Rect[]): void {
    if (objects.length === 0) return;
    objects.forEach((drop, idx) => {
      this.ctx.beginPath()
      this.ctx.moveTo(drop.x, drop.y)
      if (idx === objects.length - 1)
        this.ctx.lineTo(objects[0].x, objects[0].y)
      else
        this.ctx.lineTo(objects[idx + 1].x, objects[idx + 1].y)
      this.ctx.stroke();
    });
  }

  renderArcs(objects: Rect[]): void {
    if (objects.length === 0) return;
    objects.forEach((drop, idx) => {
      const e = easeOutElastic(idx + 1, 1, drop.w / 2, objects.length)
      this.ctx.beginPath()
      this.ctx.arc(drop.x, drop.y, e / 2, 0, Math.PI * 2)
      this.ctx.stroke();
    });
  }



  render(): void {

    this.ctx.strokeStyle = 'white';

    if (this.count % 60 === 0) {
      console.log(this.crystals)
      let f = new Crystal(this.angle, Math.floor(rand(2, 20)))
      this.crystals.push(f);
    }


    if (this.crystals?.length > this.layers) {
      this.crystals?.shift();
    }

    this.crystals?.forEach((f, idx) => {
      this.ctx.strokeStyle = f.color;

      f.segments.forEach(p => {
        this.ctx.lineWidth = f.lineWidth * 4
        this.renderLines(p.points.filter((i, idx) => idx % 1 === 0), f.alpha / Math.floor(rand(5, 10)));
        this.ctx.globalAlpha = f.alpha
        this.renderOutline(p.points);
        this.renderArcs(p.points.filter((i, idx) => idx % 5 === 0))
      })
    })

    this.crystals?.forEach(f => {
      this.ctx.strokeStyle = f.color;
      f.update(f.rotationInterval)
      f.alpha += f.direction
      if (f.alpha >= .8 && f.direction > 0) {
        f.direction = -f.direction
      }
    })

    this.count++
  }
}