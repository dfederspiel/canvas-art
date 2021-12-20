import Size from "./Size";
export default class Rect {
  /**
   *
   * @param {Number} x
   * @param {Number} y
   * @param {Number} w
   * @param {Number} h
   * @param {Size} size
   */
  constructor(x, y, w, h, size) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.size = size;
    this.angles = {
      tl: this.angle(this.x, this.y),
      tr: this.angle(this.x + this.w, this.y),
      bl: this.angle(this.x, this.y + this.h),
      br: this.angle(this.x + this.w, this.y + this.h),
    };
  }

  angle(x, y) {
    var dx = this.x + this.w / 2 - x;
    var dy = this.y + this.h / 2 - y;

    var angle = (Math.atan2(dy, dx) * 180) / Math.PI;
    if (angle < 0) angle += 360;

    return angle;
  }
}
