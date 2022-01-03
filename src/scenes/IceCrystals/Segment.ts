import { effects, easeInBack, easeInCirc, easeInExpo, easeInOutCirc, easeInOutElastic, easeInOutQuad, easeOutElastic, easeOutSine } from "../../lib/easing";
import { calculate, rand } from "../../lib/helpers";
import Rect from "../../lib/Rect";

export default class Segment {

  points: Rect[] = [];

  constructor(
    cx: number,
    cy: number,
    angle: number,
    minRad: number,
    maxRadius: number,
    steps: number,
    ease: Function
  ) {
    let currentAngle = 0
    let currentRadius = 0
    const radiusInterval = maxRadius / steps;
    const rotationInterval = Math.PI / steps;


    currentAngle = angle - Math.PI * 2
    currentRadius = 0;
    for (let s = 0; s < steps; s++) {
      let radius = ease(s, minRad, maxRadius, steps);
      currentAngle += rotationInterval;
      currentRadius += radiusInterval;
      const { x, y } = calculate.getVertexFromAngle(cx, cy, currentAngle, radius)
      this.points.push(new Rect(
        x, y, s, s
      ))

    }

    currentAngle = angle + Math.PI * 2;
    currentRadius = 0;
    let pts: Rect[] = []
    for (let s = 0; s < steps; s++) {
      let radius = ease(s, minRad, maxRadius, steps);
      currentAngle -= rotationInterval;
      currentRadius -= radiusInterval;
      const { x, y } = calculate.getVertexFromAngle(cx, cy, currentAngle, radius)
      pts.push(new Rect(
        x, y, s, s
      ))
    }

    pts.reverse();
    this.points.push(...pts);
  }
}