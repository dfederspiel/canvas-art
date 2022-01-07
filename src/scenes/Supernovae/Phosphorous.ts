import { calculate, rand } from "../../lib/helpers";
import Rect from "../../lib/Rect";
import RGB from "./RGB";

export default class Phosphorous extends Rect {

  size: number;
  color: RGB;
  isDead: boolean;

  private originX: number;
  private originY: number;

  private age: number = 0;
  private ageLimit: number = rand(45, 300)

  get angle() {
    return calculate.angle(
      { x: this.x, y: this.y } as unknown as Rect,
      { x: this.originX, y: this.originY } as unknown as Rect,
    )
  }

  constructor(
    x: number,
    y: number,
    cx: number,
    cy: number,
    size: number,
    color: RGB,
  ) {
    super(x, y, size, size)
    this.size = size;
    this.color = color;
    this.originX = cx;
    this.originY = cy;
  }

  update() {
    if (this.ageLimit - this.age > 0) {
      console.log('alive')
    } else {
      this.isDead = true;
    }
    this.age++
  }
}