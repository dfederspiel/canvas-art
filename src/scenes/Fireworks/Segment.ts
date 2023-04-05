import { easeInCubic, easeInElastic, effects } from "../../lib/easing";
import { calculate, rand } from "../../lib/helpers";
import HSL from "../../lib/HSL";
import RGB from "../../lib/RGB";
import Size from "../../lib/Size";
import Blinker from "./Phosphorous/Blinker";
import Hue from './Phosphorous/Hue';
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

  private origcx: number;
  private origcy: number;

  private type: PhosphorousType;

  constructor(
    cx: number,
    cy: number,
    angle: number,
    minRadius: number,
    maxRadius: number,
    steps: number,
    ease: Function,
    color?: HSL,
    secondaryColor?: HSL,
    type?: PhosphorousType,
    origcx?: number,
    origcy?: number,
  ) {

    this.ease = ease;
    this.minRadius = minRadius;
    this.maxRadius = maxRadius;
    this.cx = cx;
    this.cy = cy;
    this.origcx = origcx
    this.origcy = origcy

    this.type = type;

    const rotationAngle = Math.PI / steps;
    let inverseAngle = angle - Math.PI
    let currentAngleRight = inverseAngle;
    let currentAngleLeft = inverseAngle;

    let c = color || new HSL(rand(0, 360), rand(0,100), rand(33,66)) // HSL.fromRGB(r, g, b, rand(.6, .9));
    let sc = secondaryColor || color || new HSL(rand(0, 360), rand(0,100), rand(33,66)) ;

    // if (!secondaryColor)
    //   sc.lighten(50)

    //if (this.type && this.type === PhosphorousType.Blinker) steps = 100;
    for (let s = 0; s <= steps; s++) {
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
        case PhosphorousType.Hue:
          this.plotHues(cx, cy, currentAngleRight, currentAngleLeft, radius, c, sc)
          break;
      }

      currentAngleRight += rotationAngle;
      currentAngleLeft -= rotationAngle;
    }
  }

  plotHues(cx: number, cy: number, currentAngleRight: number, currentAngleLeft: number, radius: number, c: HSL, sc: HSL) {
    const { x: x1, y: y1 } = calculate.getVertexFromAngle(cx, cy, currentAngleRight, radius)
    this.lPoints.push(
      new Hue(
        c,
        sc,
        x1,
        y1,
        this.origcx,
        this.origcy
      )
    );
  
    const { x: x2, y: y2 } = calculate.getVertexFromAngle(cx, cy, currentAngleLeft, radius)
    this.rPoints.push(
      new Hue(
        c,
        sc,
        x2,
        y2,
        this.origcx,
        this.origcy
      )
    );
  }

  plotPhosphorous(cx: number, cy: number, currentAngleRight: number, currentAngleLeft: number, radius: number, c: HSL, sc: HSL) {
    const { x: x1, y: y1 } = calculate.getVertexFromAngle(cx, cy, currentAngleRight, radius)
    this.lPoints.push(
      new Phosphorous(
        x1,
        y1,
        this.origcx,
        this.origcy,
        new Size(.1, .8, .1, .8),
        c,
        sc,
        effects[Math.floor(Math.random() * effects.length)]))

    const { x: x2, y: y2 } = calculate.getVertexFromAngle(cx, cy, currentAngleLeft, radius)
    this.rPoints.push(
      new Phosphorous(
        x2,
        y2,
        this.origcx,
        this.origcy,
        new Size(.1, 1, .1, 1),
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
        this.origcx,
        this.origcy,
      ))

    const { x: x2, y: y2 } = calculate.getVertexFromAngle(cx, cy, currentAngleLeft, radius)
    this.rPoints.push(
      new Blinker(
        x2,
        y2,
        this.origcx,
        this.origcy,
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