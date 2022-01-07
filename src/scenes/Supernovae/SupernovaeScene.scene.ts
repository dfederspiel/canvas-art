import { effects } from "../../lib/easing";
import { rand } from "../../lib/helpers";
import { Randomizable, Scene } from "../../lib/types";
import Supernova from "./Supernovae";

export default class SupernovaeScene implements Scene, Randomizable {
  width: number;
  height: number;
  ctx: CanvasRenderingContext2D

  // private angle = 0;
  private count = 0;
  // private maxOpacity = .75;
  // private displayDuration = 480;

  private layers = 4;
  private distributionInterval: number = 60;

  private supernovae: Supernova[] = []

  constructor(width: number, height: number, context: CanvasRenderingContext2D) {
    this.width = width;
    this.height = height;
    this.ctx = context;
  }
  randomize(): void {
    //this.crystals.forEach(f => f.randomize())
  }

  render(): void {
    this.ctx.fillStyle = `rgba(10, 10, 10, ${this.count == 0 ? 1 : .2})`
    this.ctx.fillRect(0, 0, this.width, this.height)

    if (this.supernovae.length < this.layers && this.count % this.distributionInterval === 0) {
      this.supernovae.push(new Supernova(0, Math.floor(rand(1, 8)), this.ctx));
      this.distributionInterval = Math.floor(rand(30, 120))
    }

    this.supernovae?.forEach((c, idx) => {
      c.render();
    })


    this.ctx.fillStyle = 'black'
    this.ctx.fillRect(0, 0, 320, 70)

    this.supernovae = this.supernovae.filter(s => !s.isDead)

    this.count++;
  }
}