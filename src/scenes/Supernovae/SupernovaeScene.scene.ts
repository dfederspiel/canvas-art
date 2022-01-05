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

  private layers = 2;

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

    if (this.supernovae.length < this.layers && this.count % 60 === 0) {
      // this.ctx.globalAlpha = 1
      // this.ctx.fillStyle = 'black'
      // this.ctx.fillRect(0, 0, this.width, this.height)
      let f = new Supernova(0, Math.floor(rand(2, 20)), this.ctx)
      this.supernovae.push(f);
    }


    // if (this.supernovae?.length > this.layers) {
    //   this.supernovae?.shift();
    // }

    this.supernovae?.forEach((c, idx) => {
      c.render();
      // if (c.isDead) {
      //   this.ctx.fillStyle = `rgba(0, 0, 0, )`
      //   this.ctx.fillRect(0, 0, this.width, this.height)
      //   this.ctx.globalAlpha = 1;
      // }
    })


    this.ctx.fillStyle = 'black'
    this.ctx.fillRect(0, 0, 320, 70)

    this.supernovae = this.supernovae.filter(s => !s.isDead)

    this.count++;
  }
}