import { easeInCirc, easeInElastic, easeInOutExpo, easeInOutSine, easeInSine, easeOutElastic, easeOutSine, effects } from "../../lib/easing";
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
  private maxOpacity = .75;
  private displayDuration = 480;

  private layers = 1;

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
    objects.forEach((o, idx) => {
      this.ctx.globalAlpha = alpha
      this.ctx.moveTo(this.width / 2, this.height / 2)
      this.ctx.lineTo(o.x, o.y)
    });
    this.ctx.stroke();
  }

  renderOutline(objects: Rect[], alpha: number): void {
    if (objects.length === 0) return;
    this.ctx.globalAlpha = alpha
    objects.forEach((o, idx) => {
      this.ctx.beginPath()
      this.ctx.moveTo(o.x, o.y)
      if (idx === objects.length - 1)
        this.ctx.lineTo(objects[0].x, objects[0].y)
      else
        this.ctx.lineTo(objects[idx + 1].x, objects[idx + 1].y)
      this.ctx.stroke();
    });
  }

  renderArcs(objects: Rect[], alpha: number): void {
    if (objects.length === 0) return;
    this.ctx.globalAlpha = alpha
    objects.forEach((o, idx) => {
      const e = easeInSine(idx + 1, 1, o.w / 2, objects.length)
      this.ctx.beginPath()
      this.ctx.arc(o.x, o.y, e, 0, Math.PI * 2)
      this.ctx.fill()
      this.ctx.stroke();
    });
  }



  render(): void {

    this.ctx.strokeStyle = 'white';

    if (this.count % this.displayDuration === 0) {
      this.ctx.globalAlpha = 1
      this.ctx.fillStyle = 'black'
      this.ctx.fillRect(0, 0, this.width, this.height)
      let f = new Crystal(this.angle, Math.floor(rand(2, 20)))
      f.direction = this.maxOpacity / Math.floor(this.displayDuration / 2);
      f.maxAlpha = this.maxOpacity
      f.alpha = 0;
      f.ease = effects[Math.floor(rand(0, effects.length))]
      this.crystals.push(f);
    }


    if (this.crystals?.length > this.layers) {
      this.crystals?.shift();
    }

    this.crystals?.forEach((c, idx) => {

      c.segments.forEach(p => {
        this.ctx.strokeStyle = c.color;
        this.ctx.lineWidth = c.lineWidth
        this.renderLines(p.points.filter((i, idx) => idx % Math.floor(rand(1, 10)) === 0), c.alpha / Math.floor(rand(5, 10)));
        this.ctx.lineWidth = c.lineWidth * 2
        this.ctx.fillStyle = c.color
        this.renderOutline(p.points, c.alpha);
        this.renderArcs(p.points.filter((i, idx) => idx % Math.floor(rand(3, 8)) === 0), c.alpha)
      })
    })

    this.crystals?.forEach(c => {
      if (c.alpha > this.maxOpacity && c.direction > 0) {
        c.direction = -c.direction
      }
      this.ctx.strokeStyle = c.color;
      c.update(c.rotationInterval)
      c.alpha += c.direction
      console.log(c.alpha)
    })

    this.ctx.globalAlpha = .05
    this.ctx.fillStyle = '#000'
    this.ctx.fillRect(0, 0, this.width, this.height)
    this.ctx.globalAlpha = 1;
    this.ctx.fillRect(0, 0, 220, 70)
    this.count++
  }
}