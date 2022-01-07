import { calculate, rand } from "../../lib/helpers";
import Rect from "../../lib/Rect";
import RGB from "./RGB";

export default class Phosphorous extends Rect {

  size: number;
  color: RGB;
  isDead: boolean;

  private vx: number;
  private vy: number;

  private age: number = 0;
  private ageLimit: number = rand(100, 300)

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

    this.vx = (x - cx) / rand(3, 8)
    this.vy = (y - cy) / rand(3, 8)
  }

  update() {
    if (this.ageLimit - this.age > 0) {
      this.x += this.vx;
      this.y += this.vy

      this.vx += -this.vx / 50
      this.vy += -this.vy / 50

      this.vy += .035
      this.size = rand(.2, 3)

    } else {
      this.isDead = true;
    }
    this.age++
  }
}