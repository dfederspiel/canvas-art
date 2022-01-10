import { easeInCubic, easeInElastic, effects } from "../../lib/easing";
import { calculate, rand } from "../../lib/helpers";
import RGB from "../../lib/RGB";
import Size from "../../lib/Size";
import Blinker from "./Phosphorous/Blinker";
import Phosphorous from "./Phosphorous/Phosphorous";
import { PhosphorousType } from "./Phosphorous/types";

export default class Segment {

  public get points(): Phosphorous[] {
    return [...this.lPoints, ...this.rPoints];
  }

  lPoints: Phosphorous[] = []
  rPoints: Phosphorous[] = []

  isDead: boolean = false;

  private ease: Function;
  private minRadius: number;
  private maxRadius: number;


  private cx: number;
  private cy: number;

  private type: PhosphorousType;

  constructor(
    cx: number,
    cy: number,
    angle: number,
    minRadius: number,
    maxRadius: number,
    steps: number,
    ease: Function,
    color?: RGB,
    type?: PhosphorousType,
  ) {

    this.ease = ease;
    this.minRadius = minRadius;
    this.maxRadius = maxRadius;
    this.cx = cx;
    this.cy = cy;

    this.type = type;

    const rotationAngle = Math.PI / steps;
    let inverseAngle = angle - Math.PI
    let currentAngleRight = inverseAngle;
    let currentAngleLeft = inverseAngle;

    let r = rand(50, 150);
    let g = rand(50, 150);
    let b = rand(50, 150);

    let c = new RGB(r, g, b, rand(.6, .9));
    let sc = new RGB(r, g, b, rand(.6, .9));
    sc.lighten(50)

    if (this.type && this.type === PhosphorousType.Blinker) steps = 100;
    for (let s = 0; s < steps; s++) {
      let radius = ease(s, this.minRadius, this.maxRadius, steps);


      switch (this.type) {
        case PhosphorousType.Default:
          this.plotPhosphorous(cx, cy, currentAngleRight, currentAngleLeft, radius, c, sc)
          break;
        case PhosphorousType.Blinker:
          radius = easeInElastic(s, this.minRadius, this.maxRadius, steps);
          this.ease = easeInCubic
          this.maxRadius = 60
          this.minRadius = 30
          this.plotBlinker(cx, cy, currentAngleRight, currentAngleLeft, radius)
          break;
      }

      currentAngleRight += rotationAngle;
      currentAngleLeft -= rotationAngle;
    }
  }

  plotPhosphorous(cx: number, cy: number, currentAngleRight: number, currentAngleLeft: number, radius: number, c: RGB, sc: RGB) {
    const { x: x1, y: y1 } = calculate.getVertexFromAngle(cx, cy, currentAngleRight, radius)
    this.lPoints.push(
      new Phosphorous(
        x1,
        y1,
        this.cx,
        this.cy,
        new Size(.1, 1.5, .1, 1.5),
        c,
        sc,
        effects[Math.floor(Math.random() * effects.length)]))

    const { x: x2, y: y2 } = calculate.getVertexFromAngle(cx, cy, currentAngleLeft, radius)
    this.rPoints.push(
      new Phosphorous(
        x2,
        y2,
        this.cx,
        this.cy,
        new Size(.1, 1.5, .1, 1.5),
        c,
        sc,
        effects[Math.floor(Math.random() * effects.length)]))
  }

  plotBlinker(cx: number, cy: number, currentAngleRight: number, currentAngleLeft: number, radius: number) {
    const { x: x1, y: y1 } = calculate.getVertexFromAngle(cx, cy, currentAngleRight, radius)
    this.lPoints.push(
      new Blinker(
        x1,
        y1,
        this.cx,
        this.cy,
      ))

    const { x: x2, y: y2 } = calculate.getVertexFromAngle(cx, cy, currentAngleLeft, radius)
    this.rPoints.push(
      new Blinker(
        x2,
        y2,
        this.cx,
        this.cy,
      ))
  }

  update() {
    this.isDead = true;
    this.lPoints.forEach((p) => {
      p.update()
      if (!p.isDead) this.isDead = false;
    })
    this.rPoints.forEach((p) => {
      p.update()
      if (!p.isDead) this.isDead = false;
    })
  }
}