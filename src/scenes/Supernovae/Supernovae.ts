import { effects } from "../../lib/easing";
import { calculate, rand } from "../../lib/helpers";
import { Randomizable } from "../../lib/types";
import Segment from "./Segment";

export default class Supernova implements Randomizable {
  maxAlpha: number = 0;
  alpha: number = 0;
  direction: number = 0;
  rotationInterval: number = rand(-Math.PI / 60 / 60, Math.PI / 60 / 60);
  limit: number;
  angle: number = 0;
  color: string = `rgb(${rand(125, 255)},${rand(125, 255)},${rand(125, 255)})`
  width = window.innerWidth;
  height = window.innerHeight
  lineWidth: number = .5
  offset = rand(-50, 100)
  steps: number = Math.floor(rand(50, 145))
  ease: Function
  segments: Segment[] = []
  renderOutlines = false;

  minModifier = rand(-2, 2)
  maxModifier = rand(-2, 2);

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
    if (step === 0) return;
    this.angle += step;
    this.segments = []
    this.maxRadius += this.maxModifier
    this.minRadius += this.minModifier

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
    this.minRadius = rand(5, 50)
    this.maxRadius = rand(10, 50)
    this.minModifier = rand(-.1, -1.5)
    this.maxModifier = rand(-.5, -2.5);
    this.limit = Math.floor(rand(2, 20))
    this.steps = Math.floor(rand(10, 200 / this.limit))
    this.offset = 0
    this.rotationInterval = rand(-(Math.PI / 60), Math.PI / 60) / 20
  }
}