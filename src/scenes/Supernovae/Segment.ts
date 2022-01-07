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
  private steps: number;
  private minRadius: number;
  private maxRadius: number;

  private interval: number;

  private cx: number;
  private cy: number;
  private minModifier: number;
  private maxModifier: number;

  constructor(
    cx: number,
    cy: number,
    angle: number,
    minRadius: number,
    maxRadius: number,
    steps: number,
    ease: Function,
    interval: number,


  ) {

    this.ease = ease;
    this.interval = interval;
    this.minRadius = minRadius;
    this.maxRadius = maxRadius;
    this.steps = steps;
    this.cx = cx;
    this.cy = cy;
    this.minModifier = rand(.001, .005);
    this.maxModifier = rand(.01, .05);

    // const radiusInterval = maxRadius / steps * 2;
    const rotationAngle = Math.PI / steps;
    let inverseAngle = angle - Math.PI
    let currentAngleRight = inverseAngle;
    let currentAngleLeft = inverseAngle;

    let c1 = new RGB(rand(0, 255), rand(0, 255), rand(0, 255), rand(.1, 1))
    let c2 = new RGB(rand(0, 255), rand(0, 255), rand(0, 255), rand(.1, 1))

    for (let s = 0; s < steps; s++) {
      let radius = ease(s, this.minRadius, this.maxRadius, steps);
      let size = this.ease(s, 5, 10, steps)
      const { x: x1, y: y1 } = calculate.getVertexFromAngle(cx, cy, currentAngleRight, radius)
      this.lPoints.push(new Phosphorous(x1, y1, this.cx, this.cy, size / 4, c1))
      const { x: x2, y: y2 } = calculate.getVertexFromAngle(cx, cy, currentAngleLeft, radius)
      this.rPoints.push(new Phosphorous(x2, y2, this.cx, this.cy, size / 4, c2))
      currentAngleRight += rotationAngle;
      currentAngleLeft -= rotationAngle;
    }
  }

  update(angle: number, minModifier: number, maxModifier: number) {
    const rotationAngle = Math.PI / this.steps;
    let inverseAngle = angle - Math.PI
    let currentAngleLeft = inverseAngle;
    let currentAngleRight = inverseAngle;

    // for (let s = 0; s < this.rPoints.length; s++) {
    //   let radius = this.ease(s, this.minRadius, this.maxRadius, this.steps);
    //   let size = this.ease(s, 5, 10, this.steps)
    //   const { x: x1, y: y1 } = calculate.getVertexFromAngle(this.cx, this.cy, currentAngleRight, radius)
    //   // const p1 = this.rPoints[s]
    //   // p1.x = x1
    //   // p1.y = y1
    //   // const { x: x2, y: y2 } = calculate.getVertexFromAngle(this.cx, this.cy, currentAngleLeft, radius)
    // }

    this.lPoints.forEach((p, idx) => {
      let radius = this.ease(idx, this.minRadius, this.maxRadius, this.steps);
      let size = this.ease(idx, 5, 10, this.steps)
      const { x, y } = calculate.getVertexFromAngle(this.cx, this.cy, currentAngleLeft, radius)
      p.x = x
      p.y = y
      p.update()
      currentAngleLeft -= rotationAngle;
    })

    this.rPoints.forEach((p, idx) => {
      let radius = this.ease(idx, this.minRadius, this.maxRadius, this.steps);
      let size = this.ease(idx, 5, 10, this.steps)
      const { x, y } = calculate.getVertexFromAngle(this.cx, this.cy, currentAngleRight, radius)
      p.x = x
      p.y = y
      p.update()
      currentAngleRight += rotationAngle;
    })

    // this.points.forEach((p, idx) => {
    //   let radius;
    //   let size = 0;
    //   if (idx % 2 === 0) {
    //     radius = this.ease(idx / 2, this.minRadius, this.maxRadius, this.steps);
    //     size = this.ease(idx / 2, 5, 10, this.steps)
    //     const { x: x1, y: y1 } = calculate.getVertexFromAngle(this.cx, this.cy, currentAngleRight, radius)
    //     p.x = x1;
    //     p.y = y1;
    //     p.size = size / 2;
    //     currentAngleRight += rotationAngle;
    //   } else {
    //     const { x: x2, y: y2 } = calculate.getVertexFromAngle(this.cx, this.cy, currentAngleLeft, radius)
    //     p.x = x2;
    //     p.y = y2
    //     p.size = size / 2;
    //     currentAngleLeft -= rotationAngle;
    //   }
    // })

    this.maxRadius += maxModifier;
    this.minRadius += minModifier;


    // for (let s = 0; s < this.points.length; s++) {
    //   let radius = this.ease(s, this.minRadius, this.maxRadius, this.steps);
    //   let size = this.ease(s, 1, 3, this.steps)
    //   currentAngle += rotationInterval;
    //   const { x, y } = calculate.getVertexFromAngle(this.cx, this.cy, currentAngle, radius)
    //   this.points[s].x = x;
    //   this.points[s].y = y;
    //   this.points[s].size = size
    //   this.points[s].update()
    // }

    //currentAngle = angle + Math.PI * 2;

    // for (let t = this.points.length - 1; t > s; t--) {
    //   let radius = this.ease(t, this.minRadius, this.maxRadius, this.steps / 2);
    //   let size = this.ease(t, 1, 3, this.steps / 2)
    //   currentAngle -= rotationInterval;
    //   const { x, y } = calculate.getVertexFromAngle(this.cx, this.cy, currentAngle, radius)
    //   this.points[t].x = x;
    //   this.points[t].y = y;
    //   this.points[t].size = size
    //   this.points[t].update()
    // }

    // this.points.forEach((p, idx) => {
    //   let radius = this.ease(idx, this.minRadius, this.maxRadius, this.steps);
    //   let size = easeOutSine(idx, 1, 3, this.steps)
    //   currentAngle += Math.PI / this.steps;;
    //   currentRadius += this.maxRadius / this.steps;
    //   const { x, y } = calculate.getVertexFromAngle(this.cx, this.cy, currentAngle, radius)
    //   p.x = x;
    //   p.y = y;
    //   p.size = size
    //   p.update()
    // })
    //this.points = this.points.filter(p => !p.isDead)
  }
}