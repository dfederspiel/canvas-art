import { ObjectType } from "../lib/enums";
import Rect from "../lib/Rect";
import Size from "../lib/Size";
import Sprite from "../lib/Sprite";
import { Scene } from "../lib/types";
import { rand } from '../lib/helpers'
import { easeInElastic } from '../lib/easing'

const MAX_PARTICLES = 1000;

let ROTATION_INTERVAL = (Math.PI * 2) / (60 * 60);
let ROTATION_ANGLE = ROTATION_INTERVAL - (Math.PI * 2) / 4;

export default class ClockScene implements Scene {

  width: number;
  height: number;

  #timeInMs: number;
  #ctx: CanvasRenderingContext2D;
  #radiansPerSecond: number;
  #radiansPerMinute: number;
  #radiansPerHour: number;

  #radius: number;

  particles: Sprite[];

  #date: Date

  constructor(width: number, height: number, context: CanvasRenderingContext2D) {


    this.width = width;
    this.height = height;
    this.#ctx = context;
    this.#date = new Date();
    this.#radius = 50;
    this.particles = []
    this.#timeInMs =
      (this.#date.getHours() * 60 * 60 + this.#date.getMinutes() * 60 + this.#date.getSeconds()) *
      1000 +
      this.#date.getMilliseconds();

    // In order for things to move slowly around the screen, it
    this.#radiansPerSecond = (Math.PI * 2) / 60;
    this.#radiansPerMinute = this.#radiansPerSecond / 60; // 0.10471975511966 / 60 minutes = 0.001745329251994 radians
    this.#radiansPerHour = (this.#radiansPerMinute * 60) / 12 / 60;
  }

  getXYOnCircle(x: number, y: number, a: number, distance: number) {
    return {
      x: x + Math.cos(a) * distance,
      y: y + Math.sin(a) * distance,
    };
  }

  renderParticleRing(cx: number, cy: number, srcRect: Rect, radius: number, angle: number) {
    const { x, y } = this.getXYOnCircle(cx, cy, ROTATION_ANGLE, radius);
    let sizeMin = rand(.5, 1.5)
    let sizeMax = rand(2.5, 5)
    this.particles.push(
      new Sprite(
        new Rect(x, y, 3, 3),
        60,
        `rgb(${rand(209, 255)}, ${rand(211, 251)}, ${rand(158, 218)})`,
        easeInElastic,
        (x - (srcRect.x + srcRect.w / 2)) / rand(radius * 16, radius * 100),
        (y - (srcRect.y + srcRect.h / 2)) / rand(radius * 16, radius * 100),
        new Rect(
          100,
          this.height / 4,
          this.width - 100,
          this.height - this.height / 4
        ),
        new Size(sizeMin, sizeMin, sizeMax, sizeMax),
        rand(2000, 10000),
        ObjectType.Particle
      )
    );
    this.#ctx.globalAlpha = 1;
    if (angle >= Math.PI * 2) {
      angle = 0;
    }
    while (this.particles.length > MAX_PARTICLES) this.particles.shift();
  }

  render() {
    this.#date = new Date();
    this.#timeInMs =
      (this.#date.getHours() * 60 * 60 + this.#date.getMinutes() * 60 + this.#date.getSeconds()) *
      1000 +
      this.#date.getMilliseconds();

    this.#ctx.globalAlpha = .75;

    // Second Hand Position
    const { x: secondsX, y: secondsY } = this.getXYOnCircle(
      this.width / 2,
      this.height / 2,
      (this.#timeInMs / 1000) * this.#radiansPerSecond - (Math.PI * 2) / 4,
      this.#radius + 20
    );

    // Minute Hand Position
    const { x: minutesX, y: minutesY } = this.getXYOnCircle(
      this.width / 2,
      this.height / 2,
      (this.#timeInMs / 1000) * this.#radiansPerMinute - (Math.PI * 2) / 4,
      this.#radius + 100
    );

    // Hour Hand Position
    const { x: hoursX, y: hoursY } = this.getXYOnCircle(
      this.width / 2,
      this.height / 2,
      (this.#timeInMs / 1000) * this.#radiansPerHour - (Math.PI * 2) / 4,
      this.#radius + 150
    );

    //
    const { x: secondHandOrbiterX, y: secondHandOrbiterY } = this.getXYOnCircle(
      secondsX,
      secondsY,
      (this.#timeInMs / 1000) * this.#radiansPerSecond * 60 - (Math.PI * 2) / 4,
      25
    );



    this.renderParticleRing(
      secondHandOrbiterX,
      secondHandOrbiterY,
      new Rect(secondsX, secondsY, 1, 1),
      10,
      10
    );

    this.#ctx.globalAlpha = 1;

    this.#ctx.beginPath();

    this.#ctx.strokeStyle = "#ddd";

    this.#ctx.moveTo(this.width / 2, this.height / 2);
    this.#ctx.lineTo(secondsX, secondsY);

    this.#ctx.moveTo(this.width / 2, this.height / 2);
    this.#ctx.lineTo(minutesX, minutesY);

    this.#ctx.moveTo(this.width / 2, this.height / 2);
    this.#ctx.lineTo(hoursX, hoursY);

    this.#ctx.moveTo(secondsX, secondsY);
    this.#ctx.lineTo(secondHandOrbiterX, secondHandOrbiterY);

    this.#ctx.stroke();

    this.#ctx.strokeStyle = "#cc0";
    this.#ctx.fillStyle = "#cc0";

    this.#ctx.beginPath();
    this.#ctx.arc(this.width / 2, this.height / 2, 15, 0, 2 * Math.PI);
    this.#ctx.stroke();
    this.#ctx.fill();

    this.#ctx.beginPath();
    this.#ctx.arc(secondsX, secondsY, 8, 0, 2 * Math.PI);
    this.#ctx.fill();
    this.#ctx.stroke();

    this.#ctx.beginPath();
    this.#ctx.arc(minutesX, minutesY, 10, 0, 2 * Math.PI);

    this.#ctx.stroke();
    this.#ctx.fill();

    this.#ctx.beginPath();
    this.#ctx.arc(hoursX, hoursY, 12, 0, 2 * Math.PI);

    this.#ctx.fill();
    this.#ctx.stroke();

    this.#ctx.beginPath();
    this.#ctx.arc(secondHandOrbiterX, secondHandOrbiterY, 5, 0, 2 * Math.PI);
    this.#ctx.fill();

    this.#ctx.textAlign = "center";
    this.#ctx.textBaseline = "top";
    this.#ctx.fillStyle = '#000'
    this.#ctx.font = "10px Helvetica";
    this.#ctx.fillText(`${this.#date.getSeconds()}`, secondsX, secondsY - 5)
    this.#ctx.font = "12px Helvetica";
    this.#ctx.fillText(`${this.#date.getMinutes()}`, minutesX, minutesY - 6)
    this.#ctx.font = "16px Helvetica";
    this.#ctx.fillText(`${this.#date.getHours() > 12 ? this.#date.getHours() - 12 : this.#date.getHours()}`, hoursX, hoursY - 8)
  }
}
