import { effects } from "../../lib/easing";
import { calculate, rand } from "../../lib/helpers";
import { Randomizable } from "../../lib/types";
import Segment from "./Segment";

export default class Crystal implements Randomizable {
  maxAlpha: number = .8;
  alpha: number = 0;
  direction: number = .8 / 120;
  rotationInterval: number = rand(-.05, .05);
  limit: number;
  angle: number = 0;
  color: string = `rgb(${rand(125, 255)},${rand(125, 255)},${rand(125, 255)})`
  width = window.innerWidth;
  height = window.innerHeight
  lineWidth: number = .2
  offset = rand(-50, 100)
  steps: number = Math.floor(rand(50, 145))
  ease: Function
  segments: Segment[] = []

  posX = 0;
  posY = 0;

  private minRadius = rand(-50, 50)
  private maxRadius = rand(50, 75)

  constructor(angle: number, numPetals: number) {
    this.limit = numPetals
    this.angle = angle;
    this.ease = effects[Math.floor(rand(0, effects.length))];
    this.randomize();
    this.update(0)
  }

  update(step: number) {
    this.angle += step;
    this.segments = []
    this.maxRadius -= .125
    this.minRadius -= .125

    for (let c = 0; c < this.limit; c++) {
      this.angle += ((Math.PI * 2) / this.limit);
      const { x: pX, y: pY } = calculate.getVertexFromAngle(
        this.width / 2,
        this.height / 2,
        this.angle,
        this.offset
      )
      let p = new Segment(
        pX,
        pY,
        this.angle,
        this.minRadius,
        this.maxRadius,
        this.steps,
        this.ease
      )
      this.segments.push(p)
    }
  }

  randomize(): void {
    this.angle = 0;
    this.minRadius = rand(-50, 0)
    this.maxRadius = rand(0, 250)
    this.limit = Math.floor(rand(2, 15))
    this.steps = Math.floor(rand(15, 40))
    this.offset = rand(-150, 150)
    this.rotationInterval = rand(-Math.PI / 60 / 5, Math.PI / 60 / 5)
  }
}