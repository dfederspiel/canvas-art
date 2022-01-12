import { effects } from "../../lib/easing";
import { rand } from "../../lib/helpers";
import { Randomizable, Scene } from "../../lib/types";
import Firework from "./Firework";

export default class FireworkScene implements Scene, Randomizable {
  width: number;
  height: number;
  ctx: CanvasRenderingContext2D

  private count = 0;
  private layers = 10;
  private distributionInterval: number = 1;

  private fireworks: Firework[] = []

  constructor(width: number, height: number, context: CanvasRenderingContext2D) {
    this.width = width;
    this.height = height;
    this.ctx = context;
  }

  randomize(): void {
    this.fireworks.forEach(s => s.randomize())
  }

  render(): void {
    if (this.count % 15 === 0) {
      this.ctx.filter = 'blur(10px)'
      var imageData = this.ctx.getImageData(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
      this.ctx.putImageData(imageData, 0, 0);
    }
    this.ctx.fillStyle = `rgba(0, 0, 0, ${this.count == 0 ? 1 : .1})`
    this.ctx.fillRect(0, 0, this.width, this.height)
    this.ctx.filter = 'none'

    if (this.fireworks.length < this.layers && this.count % this.distributionInterval === 0) {
      this.fireworks.push(new Firework(0, Math.floor(rand(2, 15)), this.ctx));
      this.distributionInterval = Math.floor(rand(15, 60))
      this.layers = Math.floor(rand(1, 3))
    }

    this.fireworks?.forEach((c, idx) => {
      c.render();
    })

    this.ctx.fillStyle = 'black'
    this.ctx.fillRect(0, 0, 320, 70)

    this.fireworks = this.fireworks.filter(s => !s.isDead)
    this.count++;

  }
}