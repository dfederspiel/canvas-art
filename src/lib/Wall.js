export default class Wall {
  constructor(x, y, w, h, colorString) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.colorString = colorString;
    this.hits = 0;

    const halfWidth = this.w / 2;
    const halfHeight = this.h / 2;

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
