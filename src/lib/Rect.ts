export interface Angles {
  tl: number;
  tr: number;
  bl: number;
  br: number;
}

export default class Rect {
  #angles: Angles = null;
  x: number;
  y: number;
  w: number;
  h: number;
  /**
   * Defines a new Rectangle
   * @param {Number} x
   * @param {Number} y
   * @param {Number} w
   * @param {Number} h
   */
  constructor(x: number, y: number, w: number, h: number) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.#angles = null;
  }

  get angles() {
    if (!this.#angles)
      this.#angles = {
        tl: this.#angle(this.x, this.y),
        tr: this.#angle(this.x + this.w, this.y),
        bl: this.#angle(this.x, this.y + this.h),
        br: this.#angle(this.x + this.w, this.y + this.h),
      }
    return this.#angles
  }

  #angle(x: number, y: number) {
    var dx = this.x + this.w / 2 - x;
    var dy = this.y + this.h / 2 - y;

    var angle = (Math.atan2(dy, dx) * 180) / Math.PI;
    if (angle < 0) angle += 360;

    return angle;
  }
}
