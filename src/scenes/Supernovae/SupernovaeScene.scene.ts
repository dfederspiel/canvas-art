import { effects } from "../../lib/easing";
import { rand } from "../../lib/helpers";
import { Randomizable, Scene } from "../../lib/types";
import Supernova from "./Supernovae";

export default class SupernovaeScene implements Scene, Randomizable {
  width: number;
  height: number;
  ctx: CanvasRenderingContext2D

  private angle = 0;
  private count = 0;
  private maxOpacity = .75;
  private displayDuration = 480;

  private layers = 1;

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

    this.ctx.strokeStyle = 'white';

    if (this.count % this.displayDuration === 0) {
      // this.ctx.globalAlpha = 1
      // this.ctx.fillStyle = 'black'
      // this.ctx.fillRect(0, 0, this.width, this.height)
      let f = new Supernova(this.angle, Math.floor(rand(2, 20)), this.ctx)
      f.direction = this.maxOpacity / Math.floor(this.displayDuration / 2);
      f.maxAlpha = this.maxOpacity
      f.color.alpha = 0;
      f.renderOutlines = Math.random() < .5;
      f.ease = effects[Math.floor(rand(0, effects.length))]
      this.supernovae.push(f);
    }


    if (this.supernovae?.length > this.layers) {
      this.supernovae?.shift();
    }

    this.supernovae?.forEach((c, idx) => {
      c.render();
    })

    // this.ctx.fillStyle = `rgba(0, 0, 0, ${1 / (this.displayDuration / 20)})`
    // this.ctx.fillRect(0, 0, this.width, this.height)
    this.ctx.globalAlpha = 1;
    this.ctx.fillStyle = 'black'
    this.ctx.fillRect(0, 0, 320, 70)
    this.count++
  }
}