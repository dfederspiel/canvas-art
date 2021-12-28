import Rect from "./Rect";

export default class Collider {
  #collision = false
  r1: Rect;
  r2: Rect;
  /**
   * @param {Rect} r1 
   * @param {Rect} r2 
   */
  constructor(r1: Rect, r2: Rect) {
    if (!r1 || !r2) throw new Error("error")
    this.r1 = r1;
    this.r2 = r2;
  }

  get collision() {
    let r1 = this.r1;
    let r2 = this.r2;
    this.#collision = !(
      r1.x + r1.w < r2.x ||
      r2.x + r2.w < r1.x ||
      r1.y + r1.h < r2.y ||
      r2.y + r2.h < r1.y
    );
    return this.#collision
  }
}