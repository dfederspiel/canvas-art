import { effects, easeInBack, easeInCirc, easeInExpo, easeInOutCirc, easeInOutElastic, easeInOutQuad, easeOutElastic, easeOutSine } from "../../lib/easing";
import { calculate, rand } from "../../lib/helpers";
import Rect from "../../lib/Rect";
import Phosphorous from "./Phosphorous";
import RGB from "./RGB";

export default class Segment {

  public get points(): Phosphorous[] {
    return [...this.lPoints, ...this.rPoints];
  }

  lPoints: Phosphorous[] = []
  rPoints: Phosphorous[] = []

  private ease: Function;
  private minRadius: number;
  private maxRadius: number;


  private cx: number;
  private cy: number;

  constructor(
    cx: number,
    cy: number,
    angle: number,
    minRadius: number,
    maxRadius: number,
    steps: number,
    ease: Function,
    color?: RGB,
  ) {

    this.ease = ease;
    this.minRadius = minRadius;
    this.maxRadius = maxRadius;
    this.cx = cx;
    this.cy = cy;

    // const radiusInterval = maxRadius / steps * 2;
    const rotationAngle = Math.PI / steps;
    let inverseAngle = angle - Math.PI
    let currentAngleRight = inverseAngle;
    let currentAngleLeft = inverseAngle;

    let c = color || new RGB(rand(50, 255), rand(50, 255), rand(50, 255), rand(.6, .9))

    for (let s = 0; s < steps; s++) {
      let radius = ease(s, this.minRadius, this.maxRadius, steps);
      let size = this.ease(s, 1, 5, steps)

      const { x: x1, y: y1 } = calculate.getVertexFromAngle(cx, cy, currentAngleRight, radius)
      this.lPoints.push(new Phosphorous(x1, y1, this.cx, this.cy, size / 2, c))

      const { x: x2, y: y2 } = calculate.getVertexFromAngle(cx, cy, currentAngleLeft, radius)
      this.rPoints.push(new Phosphorous(x2, y2, this.cx, this.cy, size / 4, c))

      currentAngleRight += rotationAngle;
      currentAngleLeft -= rotationAngle;
    }
  }

  update(angle: number, minModifier: number, maxModifier: number) {
    this.lPoints.forEach((p, idx) => {
      p.update()
    })
    this.rPoints.forEach((p, idx) => {
      p.update()
    })
  }
}