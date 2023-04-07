import { effects } from "../../lib/easing";
import { rand } from "../../lib/helpers";
import { Randomizable, Scene } from "../../lib/types";
import Firework from "./Firework";

export default class FireworkScene implements Scene {
  width: number;
  height: number;
  ctx: CanvasRenderingContext2D

  private count = 0;
  private layers = 15;
  private lowLayers = 15;
  private highLayers = 50;
  private distributionInterval: number = 30;
  private timeSinceSwitch = 0;
  private switchInterval = rand(20, 31) * 1000; // 20-30 seconds

  private fireworks: Firework[] = [];

  // Add a fireworkCounter
  private fireworkCounter = 0;

  constructor(width: number, height: number, context: CanvasRenderingContext2D) {
    this.width = width;
    this.height = height;
    this.ctx = context;

    // Start with low number of layers
    this.layers = this.lowLayers;
    
  }

  render(): void {

     // Calculate elapsed time in milliseconds
     const elapsedTime = this.count * (1000 / 60);

     if (elapsedTime > this.timeSinceSwitch + this.switchInterval) {
       // Switch between low and high number of layers
       this.layers = this.layers === this.lowLayers ? this.highLayers : this.lowLayers;
       this.timeSinceSwitch = elapsedTime;
       this.switchInterval = rand(20, 31) * 1000;
       this.distributionInterval = this.distributionInterval <= 10 ? rand(20, 60) : rand(2, 10)
     }

    if (this.count % 15 === 0) {
      this.ctx.filter = 'blur(10px)';
      var imageData = this.ctx.getImageData(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
      this.ctx.putImageData(imageData, 0, 0);
    }
    this.ctx.fillStyle = `rgba(0, 0, 0, ${this.count == 0 ? 1 : .1})`;
    this.ctx.fillRect(0, 0, this.width, this.height);
    this.ctx.filter = 'none';

    // Increment the fireworkCounter
    this.fireworkCounter++;

    if (this.fireworks.length < this.layers && this.fireworkCounter >= this.distributionInterval) {
      this.fireworks.push(new Firework(rand(0, 360), Math.ceil(rand(4, 20)), this.ctx));
      
      // Reset the fireworkCounter
      this.fireworkCounter = 0;
    }

    this.fireworks?.forEach((c, idx) => {
      c.render();
    });

    this.ctx.fillStyle = 'black';
    this.ctx.fillRect(0, 0, 320, 70);

    this.fireworks = this.fireworks.filter(s => !s.isDead);
    this.count++;
  }
}
