import { effects } from "../../lib/easing";
import { rand } from "../../lib/helpers";
import { Randomizable, Scene } from "../../lib/types";
import Firework from "./Firework";

export default class FireworkScene implements Scene, Randomizable {
  width: number;
  height: number;
  ctx: CanvasRenderingContext2D

  // private angle = 0;
  private count = 0;
  // private maxOpacity = .75;
  // private displayDuration = 480;

  private layers = 15;
  private distributionInterval: number = 15;

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
    this.ctx.fillStyle = `rgba(10, 10, 10, ${this.count == 0 ? 1 : .2})`
    this.ctx.fillRect(0, 0, this.width, this.height)

    if (this.fireworks.length < this.layers && this.count % this.distributionInterval === 0) {
      this.fireworks.push(new Firework(0, Math.floor(rand(2, 15)), this.ctx));
      this.distributionInterval = Math.floor(rand(30, 120))
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